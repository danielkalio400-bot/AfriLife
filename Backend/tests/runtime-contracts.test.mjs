import test from "node:test";
import assert from "node:assert/strict";
import {
  cityRuntimeProfiles,
  neighborhoodRuntime,
  publicTransitRuntime,
} from "../src/runtime-contracts.mjs";

test("city runtime profiles include first-class Nigerian and Ghanaian cities", () => {
  const ids = cityRuntimeProfiles.profiles.map(profile => profile.cityId);
  assert.ok(ids.includes("Lagos"));
  assert.ok(ids.includes("PortHarcourt"));
  assert.ok(ids.includes("Accra"));
  assert.ok(ids.includes("Kumasi"));
});

test("first neighborhood acceptance loop preserves daily-life milestone", () => {
  assert.ok(neighborhoodRuntime.requiredRuntimeSystems.includes("persistent-npcs"));
  assert.ok(neighborhoodRuntime.requiredRuntimeSystems.includes("telecom"));
  assert.ok(neighborhoodRuntime.acceptanceLoop.includes("save-and-reload"));
});

test("public transit runtime includes routes, timetables and fares", () => {
  assert.ok(publicTransitRuntime.systems.includes("routes"));
  assert.ok(publicTransitRuntime.systems.includes("timetables"));
  assert.ok(publicTransitRuntime.systems.includes("fares"));
});
