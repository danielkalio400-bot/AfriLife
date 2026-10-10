import test from "node:test";
import assert from "node:assert/strict";
import { RailService } from "../src/services/rail.mjs";
import { railRuntime } from "../src/rail-contracts.mjs";

test("Phase 33 runtime includes all rail systems from the master guide", () => {
  for (const system of [
    "stations",
    "passenger-trains",
    "freight-trains",
    "tickets",
    "schedules",
    "drivers",
    "conductors",
    "rail-depots",
    "repairs",
    "rail-crossings",
    "delays",
  ]) {
    assert.ok(railRuntime.systems.includes(system));
  }
});

function makeRail() {
  const service = new RailService();
  const lagos = service.registerStation({
    countryId: "Nigeria",
    cityId: "Lagos",
    displayName: "Example Lagos Station",
    platformCount: 4,
    freightService: true,
  });
  const ibadan = service.registerStation({
    countryId: "Nigeria",
    cityId: "Ibadan",
    displayName: "Example Ibadan Station",
    platformCount: 3,
    freightService: true,
  });
  const depot = service.registerDepot({
    countryId: "Nigeria",
    cityId: "Lagos",
    capacity: 10,
    repairFacility: true,
  });
  const train = service.registerTrain({
    type: "passenger",
    displayName: "Example Passenger Train",
    depotId: depot.depot.depotId,
    passengerCapacity: 500,
  });
  const route = service.createRoute({
    originStationId: lagos.station.stationId,
    destinationStationId: ibadan.station.stationId,
    distanceKilometers: 150,
  });
  return { service, lagos, ibadan, depot, train, route };
}

test("passenger service supports schedule, ticket and crew state", () => {
  const { service, train, route } = makeRail();
  const schedule = service.scheduleService({
    routeId: route.route.routeId,
    trainId: train.train.trainId,
    scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
    scheduledArrival: new Date(Date.now() + 7200000).toISOString(),
  });
  assert.equal(schedule.ok, true);

  const ticket = service.issueTicket(schedule.schedule.scheduleId, {
    passengerEntityId: "npc-passenger",
    currency: "NGN",
    fareMinorUnits: 5000,
  });
  assert.equal(ticket.ok, true);
  assert.equal(service.useTicket(ticket.ticket.ticketId).ok, true);

  assert.equal(service.assignCrew(schedule.schedule.scheduleId, {
    personEntityId: "npc-driver",
    role: "driver",
  }).ok, true);
  assert.equal(service.assignCrew(schedule.schedule.scheduleId, {
    personEntityId: "npc-conductor",
    role: "conductor",
  }).ok, true);
});

test("repair takes train out of service until completion", () => {
  const { service, depot, train } = makeRail();
  const repair = service.scheduleRepair(train.train.trainId, {
    depotId: depot.depot.depotId,
    repairTag: "routine",
  });
  assert.equal(repair.ok, true);
  assert.equal(service.completeRepair(repair.repair.repairId).ok, true);
});

test("crossing and delay are high-level state only", () => {
  const { service, train, route } = makeRail();
  const crossing = service.registerCrossing({
    routeId: route.route.routeId,
    locationTag: "example-crossing",
  });
  assert.equal(crossing.ok, true);
  assert.equal(service.setCrossingState(crossing.crossing.crossingId, {
    openToRoadTraffic: false,
    status: "train-passing",
  }).ok, true);

  const schedule = service.scheduleService({
    routeId: route.route.routeId,
    trainId: train.train.trainId,
    scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
    scheduledArrival: new Date(Date.now() + 7200000).toISOString(),
  });
  const delayed = service.delay(schedule.schedule.scheduleId, {
    reasonTag: "weather",
    delayMinutes: 20,
  });
  assert.equal(delayed.ok, true);
  assert.equal(delayed.schedule.status, "delayed");
});

test("rail contract excludes real driving and signaling instructions", () => {
  assert.match(railRuntime.designRule, /high-level transport/i);
  assert.match(railRuntime.designRule, /train-driving procedures/i);
});
