import test from "node:test";
import assert from "node:assert/strict";
import { CorrectionsService } from "../src/services/corrections.mjs";
import { prisonRuntime } from "../src/prison-contracts.mjs";

test("Phase 29 contract includes prison services, release and reintegration", () => {
  for (const system of [
    "intake",
    "cells",
    "meals",
    "recreation",
    "work",
    "education",
    "health-care",
    "family-visits",
    "lawyer-visits",
    "rehabilitation",
    "parole-release",
    "time-compression",
    "reintegration",
  ]) {
    assert.ok(prisonRuntime.systems.includes(system));
  }
  assert.match(prisonRuntime.designRule, /does not include escape methods/i);
});

test("intake requires facility capacity and a court decision", () => {
  const service = new CorrectionsService();
  const facility = service.registerFacility({
    countryId: "Nigeria",
    regionId: "Lagos",
    capacity: 1,
  });
  assert.equal(facility.ok, true);

  const record = service.intake({
    facilityId: facility.facility.facilityId,
    personEntityId: "npc-1",
    courtDecisionId: "decision-1",
    sentenceDays: 30,
  });
  assert.equal(record.ok, true);

  const second = service.intake({
    facilityId: facility.facility.facilityId,
    personEntityId: "npc-2",
    courtDecisionId: "decision-2",
    sentenceDays: 10,
  });
  assert.equal(second.error, "correctional_facility_full");
});

test("record supports cell assignment, programs, visits and healthcare", () => {
  const service = new CorrectionsService();
  const facility = service.registerFacility({
    countryId: "Ghana",
    regionId: "Accra",
    capacity: 10,
  });
  const intake = service.intake({
    facilityId: facility.facility.facilityId,
    personEntityId: "npc-1",
    courtDecisionId: "decision-1",
    sentenceDays: 20,
  });

  assert.equal(service.assignCell(intake.record.recordId, { cellId: "cell-a" }).ok, true);
  assert.equal(service.enrollProgram(intake.record.recordId, {
    programType: "education",
    plannedSessions: 5,
  }).ok, true);
  assert.equal(service.scheduleVisit(intake.record.recordId, {
    visitorEntityId: "family-1",
    visitType: "family",
    scheduledAt: new Date(Date.now() + 60000).toISOString(),
  }).ok, true);
  assert.equal(service.requestHealthCare(intake.record.recordId, { priority: "routine" }).ok, true);
});

test("time compression can reach release-approved but not bypass approval state", () => {
  const service = new CorrectionsService();
  const facility = service.registerFacility({
    countryId: "Nigeria",
    regionId: "Abuja",
    capacity: 10,
  });
  const intake = service.intake({
    facilityId: facility.facility.facilityId,
    personEntityId: "npc-1",
    courtDecisionId: "decision-1",
    sentenceDays: 4,
  });

  assert.equal(service.release(intake.record.recordId).error, "release_not_approved");
  const advanced = service.advanceTime(intake.record.recordId, 4);
  assert.equal(advanced.record.state, "release-approved");

  const released = service.release(intake.record.recordId, {
    housingSupport: true,
    employmentSupport: true,
  });
  assert.equal(released.ok, true);
  assert.equal(released.record.state, "released");
  assert.equal(released.reintegrationPlan.housingSupport, true);
});

test("parole review uses fictional game-state eligibility only", () => {
  const service = new CorrectionsService();
  const facility = service.registerFacility({
    countryId: "Ghana",
    regionId: "Kumasi",
    capacity: 10,
  });
  const intake = service.intake({
    facilityId: facility.facility.facilityId,
    personEntityId: "npc-1",
    courtDecisionId: "decision-1",
    sentenceDays: 100,
  });

  service.advanceTime(intake.record.recordId, 50);
  const review = service.reviewParole(intake.record.recordId, {
    minimumDaysRequired: 50,
    approve: true,
    outcomeTag: "fictional-game-review",
  });
  assert.equal(review.ok, true);
  assert.equal(review.review.state, "approved");
});
