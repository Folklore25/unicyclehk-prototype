import { cp, mkdir, rm, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { siteEntries, siteFiles } from "./site-files.mjs";
import { validateSite } from "./validate-site.mjs";

const root = resolve(import.meta.dirname, "..");
const target = resolve(root, "_site");
await validateSite(root);
await rm(target, { recursive: true, force: true });
await mkdir(target);
for (const entry of siteEntries) await cp(resolve(root, entry), resolve(target, entry), { recursive: true });
assert.deepEqual((await readdir(target)).sort(), [...siteEntries].sort(), "Unexpected deployment entry");
assert.deepEqual(await siteFiles(target), await siteFiles(root), "Deployment files differ from validated source");
await validateSite(target, { checkTooling: false });
console.log(`Built ${target} from the validated public-file allowlist.`);
