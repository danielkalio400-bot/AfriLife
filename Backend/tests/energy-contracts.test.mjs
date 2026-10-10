import test from "node:test";
import assert from "node:assert/strict";
import {
  backupEnergyRuntime,
  fuelEconomyRuntime,
  telecomBillingRuntime,
  maintenanceBusinessRuntime,
} from "../src/energy-contracts.mjs";

test("backup energy covers generator, solar, batteries and hybrid switching", () => {
  assert.ok(backupEnergyRuntime.systems.includes("generator-ownership"));
  assert.ok(backupEnergyRuntime.systems.includes("solar-arrays"));
  assert.ok(backupEnergyRuntime.systems.includes("battery-storage"));
  assert.ok(backupEnergyRuntime.systems.includes("hybrid-switching"));
});

test("fuel economy remains an abstract logistics simulation", () => {
  assert.ok(fuelEconomyRuntime.systems.includes("stations"));
  assert.ok(fuelEconomyRuntime.systems.includes("reserves"));
  assert.match(fuelEconomyRuntime.designRule, /abstractly/i);
});

test("telecom billing includes bundles and roaming", () => {
  assert.ok(telecomBillingRuntime.systems.includes("data-bundles"));
  assert.ok(telecomBillingRuntime.systems.includes("roaming"));
});

test("maintenance businesses expose safe service work orders", () => {
  assert.ok(maintenanceBusinessRuntime.systems.includes("work-orders"));
  assert.ok(maintenanceBusinessRuntime.serviceTypes.includes("solar-service"));
});
