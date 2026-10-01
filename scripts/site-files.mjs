import { readdir, lstat } from "node:fs/promises";
import { resolve, relative } from "node:path";

// Only these entries can reach GitHub Pages. Never publish the repository root.
export const siteEntries = ["index.html", "404.html", "styles.css", "app.js", "service-worker.js", "manifest.webmanifest", ".nojekyll", "assets"];

export async function siteFiles(root) {
  const files = [];
  async function walk(path) {
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Error(`Symlinks cannot be deployed: ${relative(root, path)}`);
    if (stat.isDirectory()) {
      for (const name of await readdir(path)) await walk(resolve(path, name));
    } else if (stat.isFile()) {
      const name = relative(root, path).replaceAll("\\", "/");
      if (/(?:^|\/)(?:\.[^/]+|[^/]+\.(?:pem|key|env|map|log|zip|sqlite|db))$/i.test(name) && name !== ".nojekyll") throw new Error(`Private/debug file in deployment: ${name}`);
      files.push(name);
    } else throw new Error(`Unsupported deployment entry: ${path}`);
  }
  for (const entry of siteEntries) await walk(resolve(root, entry));
  return files.sort();
}
