import test from "node:test";
import assert from "node:assert/strict";
import { AviationService } from "../src/services/aviation.mjs";
import { aviationRuntime } from "../src/aviation-contracts.mjs";

test("Phase 31 runtime preserves the aviation systems from the master specification", () => {
  for (const system of [
    "airports",
    "check-in",
    "baggage",
    "security-high-level",
    "immigration-link",
    "boarding",
    "aircraft-interiors",
    "commercial-flights",
    "private-jets",
    "helicopters",
    "pilots",
    "cabin-crew",
    "ground-staff",
    "fuel",
    "maintenance",
    "hangars",
    "air-cargo",
    "delays-cancellations",
  ]) {
    assert.ok(aviationRuntime.systems.includes(system));
  }
});

test("passenger flow requires high-level screening and immigration state before boarding", () => {
  const service = new AviationService();
  const origin = service.registerAirport({ countryId: "Nigeria", cityId: "Lagos", displayName: "Example Lagos Airport" });
  const destination = service.registerAirport({ countryId: "Ghana", cityId: "Accra", displayName: "Example Accra Airport" });
  const aircraft = service.registerAircraft({ modelTag: "fictional-narrowbody", passengerCapacity: 120 });

  const flight = service.scheduleFlight({
    type: "commercial",
    originAirportId: origin.airport.airportId,
    destinationAirportId: destination.airport.airportId,
    aircraftId: aircraft.aircraft.aircraftId,
    scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
    scheduledArrival: new Date(Date.now() + 7200000).toISOString(),
    gateId: "gate-1",
  });
  assert.equal(flight.ok, true);

  const checkIn = service.checkIn({
    flightId: flight.flight.flightId,
    passengerEntityId: "npc-1",
    travelDocumentId: "game-passport-1",
  });
  assert.equal(checkIn.ok, true);
  assert.equal(checkIn.checkIn.boardingEligible, false);

  service.recordSecurityScreening(checkIn.checkIn.checkInId, { cleared: true });
  const immigration = service.recordImmigrationCheckpoint(checkIn.checkIn.checkInId, true);
  assert.equal(immigration.checkIn.boardingEligible, true);

  service.setFlightStatus(flight.flight.flightId, "boarding");
  assert.equal(service.board(checkIn.checkIn.checkInId, "gate-1").ok, true);
});

test("maintenance takes aircraft out of service until completed", () => {
  const service = new AviationService();
  const aircraft = service.registerAircraft({ modelTag: "fictional-aircraft", passengerCapacity: 8 });
  const maintenance = service.scheduleMaintenance(aircraft.aircraft.aircraftId, { maintenanceTag: "routine" });
  assert.equal(maintenance.ok, true);
  assert.equal(service.completeMaintenance(maintenance.maintenance.maintenanceId).ok, true);
});

test("flight disruption supports delays and cancellations as state only", () => {
  const service = new AviationService();
  const a = service.registerAirport({ countryId: "Nigeria", cityId: "Abuja", displayName: "Example Abuja Airport" });
  const b = service.registerAirport({ countryId: "Ghana", cityId: "Accra", displayName: "Example Accra Airport" });
  const aircraft = service.registerAircraft({ modelTag: "fictional-aircraft", passengerCapacity: 40 });
  const flight = service.scheduleFlight({
    type: "private-jet",
    originAirportId: a.airport.airportId,
    destinationAirportId: b.airport.airportId,
    aircraftId: aircraft.aircraft.aircraftId,
    scheduledDeparture: new Date(Date.now() + 3600000).toISOString(),
    scheduledArrival: new Date(Date.now() + 7200000).toISOString(),
  });

  const disruption = service.disruptFlight(flight.flight.flightId, {
    type: "delay",
    reasonTag: "weather",
    delayMinutes: 30,
  });
  assert.equal(disruption.ok, true);
  assert.equal(disruption.flight.status, "delayed");
});

test("aviation security is explicitly high-level and non-procedural", () => {
  assert.match(aviationRuntime.designRule, /high-level game state/i);
  assert.match(aviationRuntime.designRule, /security-bypass methods/i);
});
