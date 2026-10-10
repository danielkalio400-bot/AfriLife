import test from "node:test";
import assert from "node:assert/strict";
import {
  roadEvents,
  telecomOperations,
  powerRestoration,
  neighborhoodServiceOperations,
} from "../src/operations-contracts.mjs";

test("road operations include closures, flooding and tow response", () => {
  assert.ok(roadEvents.eventTypes.includes("closure"));
  assert.ok(roadEvents.eventTypes.includes("flooding"));
  assert.ok(roadEvents.eventTypes.includes("tow-operation"));
});

test("telecom operations include outages and roaming", () => {
  assert.ok(telecomOperations.systems.includes("outages"));
  assert.ok(telecomOperations.systems.includes("roaming"));
});

test("power restoration includes load management and repair crews", () => {
  assert.ok(powerRestoration.systems.includes("load-management"));
  assert.ok(powerRestoration.systems.includes("repair-crews"));
  assert.ok(powerRestoration.systems.includes("critical-infrastructure-priority"));
});

test("neighborhood services depend on utilities, staff and capacity", () => {
  assert.ok(neighborhoodServiceOperations.operationalInputs.includes("power"));
  assert.ok(neighborhoodServiceOperations.operationalInputs.includes("staff"));
  assert.ok(neighborhoodServiceOperations.serviceTypes.includes("hospital"));
});
