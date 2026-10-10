import test from "node:test";
import assert from "node:assert/strict";
import { CourtService } from "../src/services/courts.mjs";
import { courtJusticeRuntime } from "../src/court-contracts.mjs";

test("Phase 28 contract covers court roles, court types, disputes and outcomes", () => {
  for (const system of [
    "judges",
    "lawyers",
    "prosecutors",
    "clerks",
    "witnesses",
    "evidence",
    "traffic-court",
    "criminal-court",
    "civil-court",
    "family-court",
    "property-disputes",
    "business-disputes",
    "appeals",
    "sentencing",
    "fines",
    "restitution",
    "community-service",
    "prison-handoff",
  ]) {
    assert.ok(courtJusticeRuntime.systems.includes(system));
  }
});

test("case requires judge before scheduling and decision", () => {
  const courts = new CourtService();
  const created = courts.fileCase({
    courtType: "civil",
    filingPartyEntityId: "npc-a",
    respondingPartyEntityId: "npc-b",
    subjectTag: "property-dispute",
  });

  assert.equal(courts.schedule(created.case.caseId, {
    courtroomId: "room-1",
    startsAt: new Date(Date.now() + 60000).toISOString(),
  }).error, "judge_required_before_scheduling");

  assert.equal(courts.addParticipant(created.case.caseId, {
    personEntityId: "npc-judge",
    role: "judge",
  }).ok, true);

  assert.equal(courts.schedule(created.case.caseId, {
    courtroomId: "room-1",
    startsAt: new Date(Date.now() + 60000).toISOString(),
  }).ok, true);
});

test("decision creates sentence-execution state and appeal can follow", () => {
  const courts = new CourtService();
  const created = courts.fileCase({
    courtType: "traffic",
    filingPartyEntityId: "authority-1",
    respondingPartyEntityId: "driver-1",
    subjectTag: "traffic-case",
  });
  courts.addParticipant(created.case.caseId, {
    personEntityId: "npc-judge",
    role: "judge",
  });

  const decided = courts.decide(created.case.caseId, {
    decisionType: "fine",
    fineMinorUnits: 5000,
    decisionTag: "fictional-game-decision",
  });
  assert.equal(decided.ok, true);
  assert.equal(decided.execution.fineOutstandingMinorUnits, 5000);

  const appeal = courts.appeal(created.case.caseId, {
    filedByEntityId: "driver-1",
    reasonTag: "review-request",
  });
  assert.equal(appeal.ok, true);
  assert.equal(appeal.case.state, "appealed");
});

test("court runtime is explicitly fictional and not legal advice", () => {
  assert.match(courtJusticeRuntime.designRule, /does not provide legal advice/i);
});
