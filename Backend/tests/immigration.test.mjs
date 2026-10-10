import test from "node:test";
import assert from "node:assert/strict";
import { ImmigrationService } from "../src/services/immigration.mjs";
import { immigrationRuntime } from "../src/immigration-contracts.mjs";

test("Phase 30 runtime includes all master immigration systems", () => {
  for (const system of [
    "citizenship",
    "passports",
    "visa-applications",
    "immigration-offices",
    "embassies-consulates",
    "application-forms",
    "supporting-documents",
    "biometrics-high-level",
    "interviews",
    "processing-queues",
    "approval-refusal",
    "residence-permits",
    "work-permits",
    "student-permits",
    "entry-exit-records",
    "border-officers",
  ]) {
    assert.ok(immigrationRuntime.systems.includes(system));
  }
});

test("visa application supports documents, queue, interview, decision and permit", () => {
  const service = new ImmigrationService();
  const office = service.registerOffice({
    countryId: "Ghana",
    cityId: "Accra",
    dailyProcessingCapacity: 50,
  });
  const application = service.createVisaApplication({
    personEntityId: "npc-1",
    destinationCountryId: "Ghana",
    visaCategory: "study",
    processingOfficeId: office.office.officeId,
  });
  assert.equal(application.ok, true);

  assert.equal(service.attachDocument(application.application.applicationId, {
    documentType: "supporting-record",
    referenceTag: "game-doc-1",
  }).ok, true);

  const submitted = service.submit(application.application.applicationId);
  assert.equal(submitted.ok, true);
  assert.equal(submitted.application.state, "submitted");
  assert.equal(submitted.queue.position, 1);

  assert.equal(service.scheduleInterview(application.application.applicationId, {
    officerEntityId: "officer-1",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
  }).ok, true);

  assert.equal(service.decide(application.application.applicationId, "approved").ok, true);
  assert.equal(service.issuePermit(application.application.applicationId, {
    type: "student",
    validMonths: 12,
  }).ok, true);
});

test("passport lifecycle and entry-exit records remain fictional game state", () => {
  const service = new ImmigrationService();
  const passport = service.createPassportApplication({
    personEntityId: "npc-2",
    issuingCountryId: "Nigeria",
  });
  assert.equal(passport.ok, true);
  assert.equal(service.issuePassport(passport.passport.passportRecordId, { validYears: 5 }).ok, true);

  assert.equal(service.recordEntryExit({
    personEntityId: "npc-2",
    countryId: "Nigeria",
    borderPointId: "airport-1",
    direction: "exit",
    travelDocumentId: passport.passport.passportRecordId,
    officerEntityId: "officer-2",
  }).ok, true);
});

test("runtime explicitly avoids real eligibility rules and border-evasion guidance", () => {
  assert.match(immigrationRuntime.designRule, /fictional game simulation/i);
  assert.match(immigrationRuntime.designRule, /border-evasion methods/i);
});
