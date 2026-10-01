import { copyFile } from "node:fs/promises";

for (const file of ["css/bootstrap.min.css", "js/bootstrap.bundle.min.js"]) {
  await copyFile(`node_modules/bootstrap/dist/${file}`, `assets/${file.split("/").at(-1)}`);
}
console.log("Bootstrap assets updated from the locked npm package.");
