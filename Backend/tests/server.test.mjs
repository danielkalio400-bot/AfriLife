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

test("core and neighborhood catalogs are exposed", async () => {
  await withServer(async base => {
    const cities = await (await fetch(`${base}/v1/cities`)).json();
    assert.ok(cities.countries.Nigeria.includes("Lagos"));
    assert.ok(cities.countries.Ghana.includes("Accra"));

    const banks = await (await fetch(`${base}/v1/banks`)).json();
    assert.equal(banks.banks.length, 2);

    const education = await (await fetch(`${base}/v1/education`)).json();
    assert.ok(education.programs.some(program => program.qualificationType === "Degree"));

    const neighborhood = await (await fetch(`${base}/v1/neighborhood-template`)).json();
    assert.ok(neighborhood.requiredServices.includes("Clinic"));
    assert.ok(neighborhood.systems.includes("persistent-npcs"));

    const vehicles = await (await fetch(`${base}/v1/vehicles`)).json();
    assert.ok(vehicles.vehicleClasses.some(vehicle => vehicle.type === "Car"));
  });
});

test("unknown route returns JSON 404", async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/missing`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "not_found" });
  });
});
