import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

test("updating this PWA preserves other sites' caches on the same origin", async () => {
  const source = await readFile(new URL("../../service-worker.js", import.meta.url), "utf8");
  const handlers = {};
  const deleted = [];
  const current = source.match(/const CACHE_NAME = "([^"]+)"/)[1];
  runInNewContext(source, {
    self: { addEventListener(name, handler) { handlers[name] = handler; }, clients: { claim: async () => {} } },
    caches: { keys: async () => ["another-pages-app-v1", "unicyclehk-shell-old", current], delete: async (name) => { deleted.push(name); } }
  });
  let done;
  handlers.activate({ waitUntil(promise) { done = promise; } });
  await done;
  assert.deepEqual(deleted, ["unicyclehk-shell-old"]);
});
