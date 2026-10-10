import test from "node:test";
import assert from "node:assert/strict";
import { EmergencyDispatchService } from "../src/services/emergency-dispatch.mjs";
import { emergencyServicesRuntime } from "../src/emergency-contracts.mjs";

test("Phase 25 contract preserves emergency-service systems", () => {
  for (const system of [
    "emergency-calls",
    "dispatch-center",
    "police",
    "ambulance",
    "fire-service",
    "tow-service",
    "roadside-assistance",
    "incident-priority",
    "unit-assignment",
    "scene-management",
    "hospital-transport",
    "traffic-diversion",
    "after-incident-reports",
  ]) {
    assert.ok(emergencyServicesRuntime.systems.includes(system));
  }
});

test("medical call can assign an available ambulance in the same region", () => {
  const service = new EmergencyDispatchService();
  const unit = service.registerUnit({
    unitType: "ambulance",
    regionId: "Lagos",
  });
  assert.equal(unit.ok, true);

  const call = service.receiveCall({
    callerEntityId: "npc-1",
    regionId: "Lagos",
    incidentType: "medical",
    priority: "high",
  });
  assert.equal(call.ok, true);

  const dispatched = service.dispatch(call.incident.incidentId);
  assert.equal(dispatched.ok, true);
  assert.equal(dispatched.units.length, 1);
  assert.equal(dispatched.units[0].unitType, "ambulance");
});

test("road incident can request traffic diversion and hospital transport", () => {
  const service = new EmergencyDispatchService();
  for (const unitType of ["police", "ambulance", "tow-service"]) {
    service.registerUnit({ unitType, regionId: "Accra" });
  }

  const call = service.receiveCall({
    callerEntityId: "npc-2",
    regionId: "Accra",
    incidentType: "road-incident",
    priority: "critical",
    trafficDiversionRequested: true,
    hospitalTransportRequested: true,
  });

  const dispatched = service.dispatch(call.incident.incidentId);
  assert.equal(dispatched.units.length, 3);
  assert.equal(dispatched.incident.trafficDiversionRequested, true);
});

test("after-incident report is created only after resolution", () => {
  const service = new EmergencyDispatchService();
  service.registerUnit({ unitType: "roadside-assistance", regionId: "Kumasi" });
  service.registerUnit({ unitType: "tow-service", regionId: "Kumasi" });

  const call = service.receiveCall({
    callerEntityId: "driver-1",
    regionId: "Kumasi",
    incidentType: "vehicle-breakdown",
    priority: "normal",
  });

  service.dispatch(call.incident.incidentId);
  assert.equal(service.createReport(call.incident.incidentId).error, "incident_not_resolved");

  service.updateIncident(call.incident.incidentId, { status: "resolved" });
  const report = service.createReport(call.incident.incidentId);
  assert.equal(report.ok, true);
  assert.equal(report.report.unitsDispatched, 2);
  assert.equal(report.report.towServiceUsed, true);
});
