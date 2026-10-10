import test from "node:test";
import assert from "node:assert/strict";
import { JusticeInvestigationService } from "../src/services/justice-investigations.mjs";
import { policeInvestigationFinancialCrimeRuntime } from "../src/justice-contracts.mjs";

test("Phase 27 contract covers enforcement, investigations and lawful financial-crime controls", () => {
  for (const system of [
    "police-patrol",
    "traffic-enforcement",
    "arrest-records",
    "statements",
    "evidence",
    "cid-investigations",
    "cybercrime-investigation-high-level",
    "financial-fraud-investigation",
    "suspicious-transactions",
    "asset-freezing-through-legal-process",
    "evidence-chain",
    "agency-cooperation",
  ]) {
    assert.ok(policeInvestigationFinancialCrimeRuntime.systems.includes(system));
  }
  assert.match(policeInvestigationFinancialCrimeRuntime.designRule, /No hacking methods/i);
});

test("case supports statements, evidence and chain-of-custody metadata", () => {
  const service = new JusticeInvestigationService();
  const created = service.createCase({
    type: "property",
    regionId: "Lagos",
    leadAgencyId: "police-service",
  });
  assert.equal(created.ok, true);

  assert.equal(service.addStatement(created.case.caseId, {
    personEntityId: "npc-witness",
    statementTag: "statement-recorded",
  }).ok, true);

  const evidence = service.addEvidence(created.case.caseId, {
    evidenceType: "record",
    descriptionTag: "case-record",
    currentCustodianId: "officer-1",
  });
  assert.equal(evidence.ok, true);

  const transfer = service.transferEvidence(evidence.evidence.evidenceId, {
    toCustodianId: "evidence-store",
    actionTag: "secured-transfer",
  });
  assert.equal(transfer.ok, true);
});

test("asset freeze and arrest record require legal authority reference", () => {
  const service = new JusticeInvestigationService();
  const created = service.createCase({
    type: "financial-fraud",
    regionId: "Accra",
    leadAgencyId: "fictional-financial-crime-agency",
  });

  assert.equal(service.createFreezeOrder(created.case.caseId, {
    assetId: "asset-1",
  }).error, "legal_authority_required");

  assert.equal(service.createFreezeOrder(created.case.caseId, {
    assetId: "asset-1",
    legalAuthorityRef: "court-order-1",
  }).ok, true);

  assert.equal(service.recordArrest(created.case.caseId, {
    personEntityId: "npc-1",
    legalAuthorityRef: "warrant-1",
  }).ok, true);
});

test("cybercrime and suspicious transaction systems remain high-level records", () => {
  const service = new JusticeInvestigationService();
  const created = service.createCase({
    type: "cybercrime-high-level",
    regionId: "Port-Harcourt",
    leadAgencyId: "cid",
  });
  assert.equal(created.ok, true);

  const flagged = service.flagSuspiciousTransaction({
    accountId: "account-1",
    currency: "NGN",
    amountMinorUnits: 500000,
    reasonTag: "game-rule-review-trigger",
  });
  assert.equal(flagged.ok, true);
  assert.equal(flagged.record.reviewStatus, "flagged");
});

test("patrol and traffic enforcement are administrative state only", () => {
  const service = new JusticeInvestigationService();
  assert.equal(service.registerPatrol({
    regionId: "Kumasi",
    stationId: "station-1",
    assignedZoneId: "zone-a",
  }).ok, true);

  assert.equal(service.recordTrafficEnforcement({
    vehicleId: "vehicle-1",
    driverEntityId: "npc-driver",
    ruleTag: "speed-rule",
    outcome: "warning",
  }).ok, true);
});
