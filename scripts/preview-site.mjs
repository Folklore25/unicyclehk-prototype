import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve(import.meta.dirname, "../_site");
const base = "/unicyclehk-prototype/";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webmanifest": "application/manifest+json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    if (!path.startsWith(base)) { response.writeHead(404).end(); return; }
    const file = resolve(root, path.slice(base.length) || "index.html");
    if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    response.end(await readFile(resolve(root, "404.html")));
  }
});
server.listen(4173, "127.0.0.1", () => console.log("Packaged-site preview: http://127.0.0.1:4173/unicyclehk-prototype/"));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
