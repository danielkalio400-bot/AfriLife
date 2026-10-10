import test from "node:test";
import assert from "node:assert/strict";
import { makeServer } from "../src/server.mjs";

async function withServer(run) {
  const server = makeServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test("status declares all committed platforms", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/v1/status`);
    const status = await response.json();

    assert.equal(response.status, 200);
    assert.equal(status.productionReady, false);
    assert.deepEqual(status.targets, ["android", "ios", "windows"]);
  });
});

test("cities, systems and daily-life milestone are exposed", async () => {
  await withServer(async base => {
    const cities = await (await fetch(`${base}/v1/cities`)).json();
    assert.ok(cities.countries.Nigeria.includes("Lagos"));
    assert.ok(cities.countries.Ghana.includes("Accra"));

    const systems = await (await fetch(`${base}/v1/systems`)).json();
    assert.ok(systems.systems.includes("world-streaming"));
    assert.ok(systems.systems.includes("persistence"));

    const milestone = await (await fetch(`${base}/v1/milestones/daily-life`)).json();
    assert.ok(milestone.steps.includes("save-and-reload"));
  });
});

test("unknown route returns JSON 404", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/missing`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "not_found" });
  });
});
