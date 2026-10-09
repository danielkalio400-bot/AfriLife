import test from "node:test";
import assert from "node:assert/strict";
import { makeServer } from "../src/server.mjs";

test("server can be created", () => {
  const server = makeServer();
  assert.ok(server);
  server.close();
});
