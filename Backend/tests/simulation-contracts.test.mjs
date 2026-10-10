import test from "node:test";
import assert from "node:assert/strict";
import {
  trafficAgents,
  utilityBilling,
  transitPassengers,
  businessRuntime,
} from "../src/simulation-contracts.mjs";

test("traffic runtime includes public and service vehicles", () => {
  assert.ok(trafficAgents.agentKinds.includes("minibus"));
  assert.ok(trafficAgents.agentKinds.includes("emergency"));
  assert.ok(trafficAgents.decisionInputs.includes("signal-state"));
});

test("utility billing is meter-based and balance-driven", () => {
  assert.ok(utilityBilling.billingInputs.includes("meter-reading"));
  assert.ok(utilityBilling.billingInputs.includes("unit-rate"));
  assert.match(utilityBilling.rule, /game-balance/i);
});

test("transit runtime models passengers and driver shifts", () => {
  assert.ok(transitPassengers.systems.includes("driver-shifts"));
  assert.ok(transitPassengers.systems.includes("boarding"));
  assert.ok(transitPassengers.systems.includes("alighting"));
});

test("business runtime depends on staff, utilities and capacity", () => {
  assert.ok(businessRuntime.operationalInputs.includes("staff"));
  assert.ok(businessRuntime.operationalInputs.includes("utilities"));
  assert.ok(businessRuntime.businessTypes.includes("fuel-station"));
});
