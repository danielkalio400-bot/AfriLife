import { randomUUID } from "node:crypto";

const COURT_TYPES = new Set(["traffic", "criminal", "civil", "family"]);
const CASE_STATES = new Set(["filed", "scheduled", "hearing", "awaiting-decision", "decided", "appealed", "closed"]);
const DECISIONS = new Set(["dismissed", "fine", "restitution", "community-service", "custodial-sentence", "civil-order", "settlement-recorded"]);

export class CourtService {
  #cases = new Map();
  #participants = new Map();
  #schedules = new Map();
  #decisions = new Map();
  #appeals = new Map();
  #execution = new Map();

  fileCase(input) {
    const courtType = String(input?.courtType || "").trim();
    const filingPartyEntityId = String(input?.filingPartyEntityId || "").trim();
    if (!COURT_TYPES.has(courtType) || !filingPartyEntityId)
      return { ok: false, error: "invalid_court_case" };

    const now = new Date().toISOString();
    const record = {
      caseId: randomUUID(),
      courtType,
      state: "filed",
      filingPartyEntityId,
      respondingPartyEntityId: String(input?.respondingPartyEntityId || "").trim(),
      subjectTag: String(input?.subjectTag || "").slice(0, 120),
      assignedJudgeEntityId: "",
      evidenceIds: [],
      witnessEntityIds: [],
      filedAt: now,
      updatedAt: now,
    };
    this.#cases.set(record.caseId, record);
    return { ok: true, case: structuredClone(record) };
  }

  getCase(caseId) {
    const record = this.#cases.get(caseId);
    return record ? structuredClone(record) : null;
  }

  addParticipant(caseId, input) {
    const record = this.#cases.get(caseId);
    if (!record) return { ok: false, error: "court_case_not_found" };
    const role = String(input?.role || "").trim();
    const personEntityId = String(input?.personEntityId || "").trim();
    if (!["judge", "lawyer", "prosecutor", "clerk", "witness"].includes(role) || !personEntityId)
      return { ok: false, error: "invalid_case_participant" };

    const participant = {
      participantId: randomUUID(),
      caseId,
      personEntityId,
      role,
      active: true,
    };
    this.#participants.set(participant.participantId, participant);

    if (role === "judge") record.assignedJudgeEntityId = personEntityId;
    if (role === "witness" && !record.witnessEntityIds.includes(personEntityId))
      record.witnessEntityIds.push(personEntityId);

    record.updatedAt = new Date().toISOString();
    return { ok: true, participant: { ...participant }, case: structuredClone(record) };
  }

  attachEvidence(caseId, evidenceId) {
    const record = this.#cases.get(caseId);
    evidenceId = String(evidenceId || "").trim();
    if (!record) return { ok: false, error: "court_case_not_found" };
    if (!evidenceId) return { ok: false, error: "invalid_evidence_id" };

    if (!record.evidenceIds.includes(evidenceId)) record.evidenceIds.push(evidenceId);
    record.updatedAt = new Date().toISOString();
    return { ok: true, case: structuredClone(record) };
  }

  schedule(caseId, input) {
    const record = this.#cases.get(caseId);
    if (!record) return { ok: false, error: "court_case_not_found" };
    if (!record.assignedJudgeEntityId) return { ok: false, error: "judge_required_before_scheduling" };

    const startsAt = input?.startsAt ? Date.parse(String(input.startsAt)) : NaN;
    const courtroomId = String(input?.courtroomId || "").trim();
    if (!Number.isFinite(startsAt) || startsAt <= Date.now() || !courtroomId)
      return { ok: false, error: "invalid_court_schedule" };

    const entry = {
      scheduleId: randomUUID(),
      caseId,
      courtroomId,
      startsAt: new Date(startsAt).toISOString(),
      durationMinutes: Math.min(480, Math.max(15, Math.trunc(Number(input?.durationMinutes) || 60))),
      completed: false,
    };
    this.#schedules.set(entry.scheduleId, entry);
    record.state = "scheduled";
    record.updatedAt = new Date().toISOString();
    return { ok: true, schedule: { ...entry }, case: structuredClone(record) };
  }

  setState(caseId, state) {
    const record = this.#cases.get(caseId);
    if (!record) return { ok: false, error: "court_case_not_found" };
    if (!CASE_STATES.has(state)) return { ok: false, error: "invalid_court_case_state" };
    record.state = state;
    record.updatedAt = new Date().toISOString();
    return { ok: true, case: structuredClone(record) };
  }

  decide(caseId, input) {
    const record = this.#cases.get(caseId);
    if (!record) return { ok: false, error: "court_case_not_found" };
    if (!record.assignedJudgeEntityId) return { ok: false, error: "judge_required_for_decision" };

    const decisionType = String(input?.decisionType || "").trim();
    if (!DECISIONS.has(decisionType)) return { ok: false, error: "invalid_court_decision" };

    const decision = {
      decisionId: randomUUID(),
      caseId,
      decisionType,
      fineMinorUnits: Math.max(0, Math.trunc(Number(input?.fineMinorUnits) || 0)),
      restitutionMinorUnits: Math.max(0, Math.trunc(Number(input?.restitutionMinorUnits) || 0)),
      communityServiceHours: Math.max(0, Math.trunc(Number(input?.communityServiceHours) || 0)),
      custodialDays: Math.max(0, Math.trunc(Number(input?.custodialDays) || 0)),
      decisionTag: String(input?.decisionTag || "").slice(0, 160),
      decidedAt: new Date().toISOString(),
    };
    this.#decisions.set(decision.decisionId, decision);
    record.state = "decided";
    record.updatedAt = new Date().toISOString();

    const execution = {
      executionId: randomUUID(),
      decisionId: decision.decisionId,
      fineOutstandingMinorUnits: decision.fineMinorUnits,
      restitutionOutstandingMinorUnits: decision.restitutionMinorUnits,
      communityServiceHoursRemaining: decision.communityServiceHours,
      custodialDaysRemaining: decision.custodialDays,
      status: "pending",
    };
    this.#execution.set(execution.executionId, execution);
    return { ok: true, decision: { ...decision }, execution: { ...execution }, case: structuredClone(record) };
  }

  appeal(caseId, input) {
    const record = this.#cases.get(caseId);
    if (!record) return { ok: false, error: "court_case_not_found" };
    if (record.state !== "decided") return { ok: false, error: "case_not_appealable" };

    const filedByEntityId = String(input?.filedByEntityId || "").trim();
    if (!filedByEntityId) return { ok: false, error: "invalid_appeal" };

    const appeal = {
      appealId: randomUUID(),
      caseId,
      filedByEntityId,
      reasonTag: String(input?.reasonTag || "review-requested").slice(0, 160),
      state: "filed",
      filedAt: new Date().toISOString(),
    };
    this.#appeals.set(appeal.appealId, appeal);
    record.state = "appealed";
    record.updatedAt = new Date().toISOString();
    return { ok: true, appeal: { ...appeal }, case: structuredClone(record) };
  }

  updateExecution(executionId, input) {
    const execution = this.#execution.get(executionId);
    if (!execution) return { ok: false, error: "sentence_execution_not_found" };

    for (const key of [
      "fineOutstandingMinorUnits",
      "restitutionOutstandingMinorUnits",
      "communityServiceHoursRemaining",
      "custodialDaysRemaining",
    ]) {
      if (input?.[key] !== undefined)
        execution[key] = Math.max(0, Math.trunc(Number(input[key]) || 0));
    }

    const complete =
      execution.fineOutstandingMinorUnits === 0 &&
      execution.restitutionOutstandingMinorUnits === 0 &&
      execution.communityServiceHoursRemaining === 0 &&
      execution.custodialDaysRemaining === 0;

    execution.status = complete ? "completed" : "active";
    return { ok: true, execution: { ...execution } };
  }
}
