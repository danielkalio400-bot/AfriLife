import test from "node:test";
import assert from "node:assert/strict";
import { LogisticsService } from "../src/services/logistics.mjs";
import { logisticsRuntime } from "../src/logistics-contracts.mjs";

test("Phase 34 contract contains every logistics system from the guide", () => {
  for (const system of [
    "warehouses",
    "trucks",
    "ports-link",
    "rail-freight-link",
    "air-cargo-link",
    "couriers",
    "customs-high-level",
    "distribution-centers",
    "inventory-movement",
    "delivery-tracking",
    "supply-shortages",
    "alternative-suppliers",
    "fuel-dependency",
  ]) {
    assert.ok(logisticsRuntime.systems.includes(system));
  }
});

test("movement produces delivery tracking and can complete", () => {
  const service = new LogisticsService();
  const truck = service.registerTruck({
    operatorEntityId: "business-1",
    capacityUnits: 100,
    fuelLevel01: 0.8,
  });
  const created = service.createMovement({
    itemId: "food-box",
    quantity: 50,
    originNodeId: "warehouse-lagos",
    destinationNodeId: "shop-lagos",
    transportMode: "truck",
    transportResourceId: truck.truck.truckId,
  });
  assert.equal(created.ok, true);
  assert.equal(created.delivery.progress01, 0);

  const update = service.updateMovement(created.movement.movementId, {
    status: "delivered",
    currentNodeId: "shop-lagos",
  });
  assert.equal(update.ok, true);
  assert.equal(update.delivery.progress01, 1);
});

test("shortage can search cheaper alternative suppliers", () => {
  const service = new LogisticsService();
  service.registerSupplier({
    itemId: "rice",
    countryId: "Nigeria",
    availableUnits: 100,
    unitPriceMinorUnits: 2000,
  });
  service.registerSupplier({
    itemId: "rice",
    countryId: "Ghana",
    availableUnits: 100,
    unitPriceMinorUnits: 1800,
  });
  const shortage = service.recordShortage({
    regionId: "Lagos",
    itemId: "rice",
    severity01: 0.6,
    causeTag: "distribution-delay",
  });
  assert.equal(shortage.ok, true);
  assert.equal(service.alternativeSuppliers("rice", "Nigeria")[0].countryId, "Ghana");
});

test("customs remains abstract administrative clearance state", () => {
  const service = new LogisticsService();
  const movement = service.createMovement({
    itemId: "general-goods",
    quantity: 20,
    originNodeId: "node-a",
    destinationNodeId: "node-b",
    transportMode: "rail-freight",
  });
  const clearance = service.createCustomsClearance(movement.movement.movementId, {
    borderOrPortId: "border-1",
  });
  assert.equal(clearance.ok, true);
  assert.equal(service.decideCustomsClearance(clearance.clearance.clearanceId, {
    status: "cleared",
    outcomeTag: "administrative-clearance",
  }).ok, true);
  assert.match(logisticsRuntime.designRule, /no smuggling/i);
});

test("fuel dependency reduces road and courier capacity multipliers", () => {
  const service = new LogisticsService();
  const state = service.updateFuelDependency("national-logistics", {
    fuelAvailability01: 0.4,
  });
  assert.equal(state.ok, true);
  assert.equal(state.fuelDependency.roadCapacityMultiplier, 0.4);
});
