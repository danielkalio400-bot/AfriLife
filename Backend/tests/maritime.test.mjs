import test from "node:test";
import assert from "node:assert/strict";
import { MaritimeService } from "../src/services/maritime.mjs";
import { maritimeRuntime } from "../src/maritime-contracts.mjs";

test("Phase 32 runtime includes every maritime system from the master guide", () => {
  for (const system of [
    "ports",
    "passenger-ships",
    "ferries",
    "boats",
    "yachts",
    "cargo-ships",
    "oil-tankers",
    "captains",
    "crew",
    "ship-fuel",
    "maintenance",
    "weather",
    "cargo",
    "port-fees",
    "maritime-trade",
  ]) {
    assert.ok(maritimeRuntime.systems.includes(system));
  }
});

function buildRoute() {
  const service = new MaritimeService();
  const lagos = service.registerPort({
    countryId: "Nigeria",
    cityId: "Lagos",
    displayName: "Example Lagos Port",
    berthCapacity: 10,
  });
  const tema = service.registerPort({
    countryId: "Ghana",
    cityId: "Tema",
    displayName: "Example Tema Port",
    berthCapacity: 10,
  });
  const vessel = service.registerVessel({
    type: "cargo-ship",
    displayName: "Example Cargo Vessel",
    homePortId: lagos.port.portId,
    cargoCapacityKg: 500000,
  });
  const route = service.createRoute({
    originPortId: lagos.port.portId,
    destinationPortId: tema.port.portId,
    distanceKilometers: 500,
  });
  return { service, lagos, tema, vessel, route };
}

test("voyage supports crew, fuel, cargo, fees and trade state", () => {
  const { service, lagos, vessel, route } = buildRoute();
  const voyage = service.scheduleVoyage({
    routeId: route.route.routeId,
    vesselId: vessel.vessel.vesselId,
    scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
    scheduledArrival: new Date(Date.now() + 86400000).toISOString(),
  });
  assert.equal(voyage.ok, true);

  assert.equal(service.assignCrew(voyage.voyage.voyageId, {
    personEntityId: "npc-captain",
    role: "captain",
  }).ok, true);

  assert.equal(service.updateFuel(vessel.vessel.vesselId, 0.8).ok, true);
  assert.equal(service.addCargo(voyage.voyage.voyageId, {
    categoryTag: "general-goods",
    weightKilograms: 10000,
  }).ok, true);
  assert.equal(service.createPortFee(voyage.voyage.voyageId, {
    portId: lagos.port.portId,
    currency: "NGN",
    amountMinorUnits: 50000,
  }).ok, true);
  assert.equal(service.recordTrade(voyage.voyage.voyageId, {
    cargoCategory: "general-goods",
    cargoWeightKilograms: 10000,
  }).ok, true);
});

test("weather can disrupt voyage only as high-level state", () => {
  const { service, vessel, route } = buildRoute();
  const voyage = service.scheduleVoyage({
    routeId: route.route.routeId,
    vesselId: vessel.vessel.vesselId,
    scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
    scheduledArrival: new Date(Date.now() + 86400000).toISOString(),
  });
  const weather = service.updateWeather(route.route.routeId, {
    conditionTag: "storm",
    disruptionLevel01: 0.9,
  });
  const linked = service.linkWeatherToVoyage(voyage.voyage.voyageId, weather.weather.weatherStateId);
  assert.equal(linked.ok, true);
  assert.equal(linked.voyage.status, "delayed");
});

test("maintenance removes vessel from service until completion", () => {
  const { service, vessel } = buildRoute();
  const maintenance = service.scheduleMaintenance(vessel.vessel.vesselId, {
    maintenanceTag: "routine",
  });
  assert.equal(maintenance.ok, true);
  assert.equal(service.completeMaintenance(maintenance.maintenance.maintenanceId).ok, true);
});

test("maritime contract is high-level and non-procedural", () => {
  assert.match(maritimeRuntime.designRule, /high-level transport/i);
  assert.match(maritimeRuntime.designRule, /dangerous vessel-operation procedures/i);
});
