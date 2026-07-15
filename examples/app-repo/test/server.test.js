import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/server.js";

test("health endpoint returns healthy status", async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/healthz`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "healthy" });
  } finally {
    server.close();
  }
});
