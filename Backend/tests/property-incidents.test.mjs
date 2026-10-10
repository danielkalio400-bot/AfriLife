import test from "node:test";
import assert from "node:assert/strict";
import { PropertyIncidentService } from "../src/services/property-incident.mjs";
import { propertyTheftRecoveryRuntime } from "../src/property-crime-contracts.mjs";

test("Phase 26 contract preserves reporting, recovery and investigation systems", () => {
  for (const system of [
    "phone-theft",
    "wallet-theft",
    "vehicle-theft",
    "package-theft",
    "shop-theft",
    "home-burglary",
    "property-theft",
    "cctv",
    "witnesses",
    "police-reports",
    "stolen-item-records",
    "recovery",
    "insurance-claims",
    "investigation",
  ]) {
    assert.ok(propertyTheftRecoveryRuntime.systems.includes(system));
  }
  assert.match(propertyTheftRecoveryRuntime.designRule, /does not describe how to commit/i);
});

test("incident creates a stolen-item record and supports evidence metadata", () => {
  const service = new PropertyIncidentService();
  const reported = service.report({
    ownerEntityId: "npc-owner",
    regionId: "Lagos",
    type: "phone-theft",
    category: "phone",
    descriptionTag: "personal-device",
  });
  assert.equal(reported.ok, true);
  assert.ok(reported.item.itemRecordId);

  assert.equal(service.addCctvObservation(reported.incident.incidentId, {
    cameraId: "camera-1",
    locationTag: "shop-front",
    observationTag: "relevant-observation",
  }).ok, true);

  assert.equal(service.addWitness(reported.incident.incidentId, {
    witnessEntityId: "npc-witness",
    statementTag: "witness-statement-recorded",
  }).ok, true);
});

test("police report and investigation are consequence-focused records", () => {
  const service = new PropertyIncidentService();
  const reported = service.report({
    ownerEntityId: "npc-owner",
    regionId: "Accra",
    type: "package-theft",
  });
  const id = reported.incident.incidentId;

  assert.equal(service.filePoliceReport(id, {
    reportingEntityId: "npc-owner",
    stationId: "station-1",
  }).ok, true);

  const investigation = service.openInvestigation(id);
  assert.equal(investigation.ok, true);
  assert.equal(service.getIncident(id).status, "investigating");
});

test("recovery updates item state and insurance claim has controlled lifecycle", () => {
  const service = new PropertyIncidentService();
  const reported = service.report({
    ownerEntityId: "npc-owner",
    regionId: "Kumasi",
    type: "vehicle-theft",
    category: "vehicle",
    serialOrRegistrationTag: "game-registration",
  });
  const id = reported.incident.incidentId;

  const recovery = service.recover(id, {
    recoverySource: "investigation",
    returnedToOwner: true,
  });
  assert.equal(recovery.ok, true);
  assert.equal(recovery.item.recovered, true);

  const claim = service.createInsuranceClaim(id, {
    policyId: "policy-1",
    claimantEntityId: "npc-owner",
    claimedAmountMinorUnits: 100000,
  });
  assert.equal(claim.ok, true);
  assert.equal(service.updateClaim(claim.claim.claimId, "reviewing").ok, true);
});
