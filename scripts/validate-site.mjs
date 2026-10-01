import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { Script, runInNewContext } from "node:vm";
import { parse } from "parse5";
import { parseDocument } from "yaml";
import { siteFiles } from "./site-files.mjs";

function nodes(tree) {
  return [tree, ...(tree.childNodes || []).flatMap(nodes), ...(tree.content ? nodes(tree.content) : [])];
}
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

export async function validateSite(root, { checkTooling = true } = {}) {
  const files = new Set(await siteFiles(root));
  const source = async (file) => readFile(resolve(root, file), "utf8");
  const reference = (value, from) => {
    if (/^https:\/\//.test(value)) return;
    assert(!/^(?:[a-z]+:|\/\/|\/)/i.test(value), `${from}: unsafe/absolute resource ${value}`);
    const path = value.split(/[?#]/)[0].replace(/^\.\//, "") || "index.html";
    assert(files.has(path), `${from}: missing local resource ${path}`);
  };
  let homeIds;
  for (const file of ["index.html", "404.html"]) {
    const all = nodes(parse(await source(file)));
    const ids = new Set();
    let policy;
    let noReferrer = false;
    for (const node of all) {
      const attrs = Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));
      if (attrs.id) { assert(!ids.has(attrs.id), `${file}: duplicate id ${attrs.id}`); ids.add(attrs.id); }
      for (const [name, value] of Object.entries(attrs)) {
        assert(!/^on/i.test(name), `${file}: inline event handler ${name}`);
        if ((name === "href" || name === "src") && !value.startsWith("#")) {
          reference(value, file);
          if (node.tagName !== "a") assert(!value.startsWith("https:"), `${file}: remote executable/resource dependency`);
        }
        if (name === "style") for (const match of value.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) reference(match[1], file);
      }
      if (node.tagName === "script") assert(attrs.src && !node.childNodes?.some((child) => child.value?.trim()), `${file}: inline script`);
      if (node.tagName === "a" && attrs.target === "_blank") assert(/\b(?:noopener|noreferrer)\b/.test(attrs.rel || ""), `${file}: unsafe external window`);
      if (node.tagName === "meta" && attrs["http-equiv"]?.toLowerCase() === "content-security-policy") policy = attrs.content;
      if (node.tagName === "meta" && attrs.name === "referrer" && attrs.content === "no-referrer") noReferrer = true;
    }
    assert(policy && noReferrer, `${file}: missing browser security policy`);
    const directives = Object.fromEntries(policy.split(";").map((item) => item.trim().split(/\s+/)).filter(([key]) => key).map(([key, ...values]) => [key, values]));
    for (const [key, expected] of Object.entries({ "default-src": ["'self'"], "script-src": ["'self'"], "connect-src": ["'self'"], "worker-src": ["'self'"], "object-src": ["'none'"], "base-uri": ["'self'"], "form-action": ["'none'"], "frame-src": ["'none'"] })) assert.deepEqual(directives[key], expected, `${file}: unsafe ${key}`);
    for (const node of all) for (const { name, value } of node.attrs || []) {
      if (name === "aria-controls" || name === "aria-labelledby" || name === "for") for (const id of value.split(/\s+/)) assert(ids.has(id), `${file}: missing referenced id ${id}`);
      if (name === "href" && value.startsWith("#")) assert(ids.has(value.slice(1)), `${file}: broken fragment ${value}`);
    }
    if (file === "index.html") homeIds = ids;
  }
  const app = await source("app.js");
  new Script(app, { filename: "app.js" });
  assert(!/\beval\s*\(|\bnew\s+Function\s*\(|document\.write\s*\(/.test(app), "Unsafe dynamic code execution");
  const dynamicIds = new Set([...app.matchAll(/\bid="([\w-]+)"/g)].map((match) => match[1]));
  for (const match of app.matchAll(/\$\(["']#([\w-]+)["']/g)) assert(homeIds.has(match[1]) || dynamicIds.has(match[1]), `app.js: missing DOM target ${match[1]}`);
  for (const match of app.matchAll(/asset:\s*["']([^"']+)["']/g)) reference(match[1], "app.js");
  const worker = await source("service-worker.js");
  new Script(worker, { filename: "service-worker.js" });
  const shell = runInNewContext(`${worker}\nAPP_SHELL`, { self: { addEventListener() {} } });
  for (const entry of shell) reference(entry, "service-worker.js");
  const manifest = JSON.parse(await source("manifest.webmanifest"));
  assert.equal(manifest.scope, "./"); assert.equal(manifest.start_url, "./#home");
  for (const icon of manifest.icons) reference(icon.src, "manifest.webmanifest");
  if (checkTooling) {
    for (const file of ["css/bootstrap.min.css", "js/bootstrap.bundle.min.js"]) assert.equal(digest(await readFile(resolve(root, "assets", file.split("/").at(-1)))), digest(await readFile(resolve(root, "node_modules/bootstrap/dist", file))), "Vendored Bootstrap differs from the audited lockfile; run npm run vendor");
    const doc = parseDocument(await source(".github/workflows/pages.yml"), { uniqueKeys: true });
    assert.equal(doc.errors.length, 0, "Invalid workflow YAML");
    const workflow = doc.toJS();
    assert(["pull_request", "push", "workflow_dispatch"].every((event) => Object.hasOwn(workflow.on, event)), "Missing CI/CD triggers");
    assert.equal(workflow.permissions.contents, "read");
    assert(!workflow.permissions.pages && !workflow.permissions["id-token"], "Deploy privileges must be job-scoped");
    assert(!workflow.on.pull_request_target, "Privileged PR execution is forbidden");
    assert.deepEqual([...workflow.jobs.build.needs].sort(), ["browser", "quality", "secrets"].sort());
    assert.deepEqual(workflow.jobs.deploy.needs, ["build"]);
    assert(workflow.jobs.deploy.if.includes("refs/heads/main") && workflow.jobs.deploy.if.includes("pull_request"), "Deploy must be restricted to main and exclude PRs");
    for (const [name, job] of Object.entries(workflow.jobs)) {
      if (name !== "deploy") assert(!job.permissions?.pages && !job.permissions?.["id-token"], `${name}: excessive deployment permissions`);
      for (const step of job.steps || []) {
        if (step.uses) assert(/^[\w-]+\/[\w-]+@[a-f0-9]{40}$/.test(step.uses), `Unpinned Action: ${step.uses}`);
        if (step.uses?.startsWith("actions/checkout@")) assert.equal(step.with?.["persist-credentials"], false, "Checkout must not persist credentials");
        if (step.run) assert(!/\$\{\{\s*github\.event\./.test(step.run), "Untrusted event data interpolated into shell");
      }
    }
  }
  console.log(`Validated ${files.size} public files, page policies, DOM references and ${checkTooling ? "locked assets / CI gates" : "deployment resources"}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await validateSite(resolve(import.meta.dirname, ".."));
