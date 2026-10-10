import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const OFFICES = new Set(["president", "minister", "governor", "legislator", "agency-director"]);
const MEASURE_STATES = new Set(["introduced", "committee", "voting", "passed", "rejected", "enacted", "withdrawn"]);
const PROJECT_STATES = new Set(["planned", "procurement", "active", "paused", "completed", "cancelled"]);
const PROCUREMENT_STATES = new Set(["open", "evaluation", "awarded", "cancelled", "completed"]);

function clean(value, max = 120) {
  const result = String(value || "").trim();
  return result && result.length <= max ? result : "";
}

export class GovernmentService {
  #officeholders = new Map();
  #agencies = new Map();
  #measures = new Map();
  #budgets = new Map();
  #treasury = new Map();
  #projects = new Map();
  #spending = new Map();
  #audits = new Map();
  #procurements = new Map();
  #elections = new Map();
  #candidates = new Map();
  #approval = new Map();
  #services = new Map();
  #salarySchedules = new Map();

  appoint(input) {
    const countryId = clean(input?.countryId, 32);
    const officeType = clean(input?.officeType, 32);
    const personEntityId = clean(input?.personEntityId, 120);
    if (!COUNTRIES.has(countryId) || !OFFICES.has(officeType) || !personEntityId)
      return { ok: false, error: "invalid_government_appointment" };

    const starts = input?.termStartsAt ? Date.parse(String(input.termStartsAt)) : Date.now();
    const ends = input?.termEndsAt ? Date.parse(String(input.termEndsAt)) : NaN;
    if (!Number.isFinite(starts) || (Number.isFinite(ends) && ends <= starts))
      return { ok: false, error: "invalid_government_term" };

    const appointment = {
      appointmentId: randomUUID(),
      personEntityId,
      countryId,
      regionId: clean(input?.regionId, 80),
      officeType,
      portfolioTag: clean(input?.portfolioTag, 80),
      termStartsAt: new Date(starts).toISOString(),
      termEndsAt: Number.isFinite(ends) ? new Date(ends).toISOString() : null,
      active: true,
    };
    this.#officeholders.set(appointment.appointmentId, appointment);
    return { ok: true, appointment: { ...appointment } };
  }

  registerAgency(input) {
    const countryId = clean(input?.countryId, 32);
    const displayName = clean(input?.displayName, 120);
    if (!COUNTRIES.has(countryId) || !displayName)
      return { ok: false, error: "invalid_government_agency" };

    const agency = {
      agencyId: String(input?.agencyId || randomUUID()),
      countryId,
      displayName,
      mandateTag: clean(input?.mandateTag, 120),
      annualBudgetMinorUnits: Math.max(0, Math.trunc(Number(input?.annualBudgetMinorUnits) || 0)),
      active: input?.active !== false,
    };
    this.#agencies.set(agency.agencyId, agency);
    return { ok: true, agency: { ...agency } };
  }

  createLegislativeMeasure(input) {
    const countryId = clean(input?.countryId, 32);
    const titleTag = clean(input?.titleTag, 140);
    if (!COUNTRIES.has(countryId) || !titleTag)
      return { ok: false, error: "invalid_legislative_measure" };

    const measure = {
      measureId: randomUUID(),
      countryId,
      titleTag,
      status: "introduced",
      votesFor: 0,
      votesAgainst: 0,
      abstentions: 0,
    };
    this.#measures.set(measure.measureId, measure);
    return { ok: true, measure: { ...measure } };
  }

  voteMeasure(measureId, input) {
    const measure = this.#measures.get(measureId);
    if (!measure) return { ok: false, error: "legislative_measure_not_found" };

    const votesFor = Math.max(0, Math.trunc(Number(input?.votesFor) || 0));
    const votesAgainst = Math.max(0, Math.trunc(Number(input?.votesAgainst) || 0));
    const abstentions = Math.max(0, Math.trunc(Number(input?.abstentions) || 0));
    measure.votesFor = votesFor;
    measure.votesAgainst = votesAgainst;
    measure.abstentions = abstentions;
    measure.status = votesFor > votesAgainst ? "passed" : "rejected";
    return { ok: true, measure: { ...measure } };
  }

  setMeasureState(measureId, state) {
    const measure = this.#measures.get(measureId);
    if (!measure) return { ok: false, error: "legislative_measure_not_found" };
    if (!MEASURE_STATES.has(state)) return { ok: false, error: "invalid_legislative_measure_state" };
    measure.status = state;
    return { ok: true, measure: { ...measure } };
  }

  createBudget(input) {
    const countryId = clean(input?.countryId, 32);
    const fiscalPeriod = clean(input?.fiscalPeriod, 32);
    if (!COUNTRIES.has(countryId) || !fiscalPeriod)
      return { ok: false, error: "invalid_public_budget" };

    const budget = {
      budgetId: randomUUID(),
      countryId,
      fiscalPeriod,
      currency: countryId === "Ghana" ? "GHS" : "NGN",
      plannedRevenueMinorUnits: Math.max(0, Math.trunc(Number(input?.plannedRevenueMinorUnits) || 0)),
      plannedSpendingMinorUnits: Math.max(0, Math.trunc(Number(input?.plannedSpendingMinorUnits) || 0)),
      approvedSpendingMinorUnits: Math.max(0, Math.trunc(Number(input?.approvedSpendingMinorUnits) || 0)),
      status: "draft",
    };
    this.#budgets.set(budget.budgetId, budget);
    return { ok: true, budget: { ...budget } };
  }

  approveBudget(budgetId, approvedSpendingMinorUnits) {
    const budget = this.#budgets.get(budgetId);
    if (!budget) return { ok: false, error: "public_budget_not_found" };
    budget.approvedSpendingMinorUnits = Math.max(0, Math.trunc(Number(approvedSpendingMinorUnits) || 0));
    budget.status = "approved";
    return { ok: true, budget: { ...budget } };
  }

  setTreasury(input) {
    const countryId = clean(input?.countryId, 32);
    if (!COUNTRIES.has(countryId)) return { ok: false, error: "invalid_treasury_country" };
    const state = {
      countryId,
      currency: countryId === "Ghana" ? "GHS" : "NGN",
      balanceMinorUnits: Math.max(0, Math.trunc(Number(input?.balanceMinorUnits) || 0)),
      committedMinorUnits: Math.max(0, Math.trunc(Number(input?.committedMinorUnits) || 0)),
      spentMinorUnits: Math.max(0, Math.trunc(Number(input?.spentMinorUnits) || 0)),
    };
    this.#treasury.set(countryId, state);
    return { ok: true, treasury: { ...state } };
  }

  setSalarySchedule(input) {
    const countryId = clean(input?.countryId, 32);
    const roleTag = clean(input?.roleTag, 80);
    if (!COUNTRIES.has(countryId) || !roleTag)
      return { ok: false, error: "invalid_public_salary_schedule" };

    const schedule = {
      scheduleId: randomUUID(),
      countryId,
      roleTag,
      currency: countryId === "Ghana" ? "GHS" : "NGN",
      salaryMinorUnits: Math.max(0, Math.trunc(Number(input?.salaryMinorUnits) || 0)),
      periodTag: clean(input?.periodTag || "monthly", 32),
    };
    this.#salarySchedules.set(schedule.scheduleId, schedule);
    return { ok: true, salarySchedule: { ...schedule } };
  }

  createProject(input) {
    const countryId = clean(input?.countryId, 32);
    const projectType = clean(input?.projectType, 80);
    if (!COUNTRIES.has(countryId) || !projectType)
      return { ok: false, error: "invalid_public_project" };

    const project = {
      projectId: randomUUID(),
      countryId,
      regionId: clean(input?.regionId, 80),
      projectType,
      approvedBudgetMinorUnits: Math.max(0, Math.trunc(Number(input?.approvedBudgetMinorUnits) || 0)),
      spentMinorUnits: 0,
      progress01: 0,
      status: "planned",
    };
    this.#projects.set(project.projectId, project);
    return { ok: true, project: { ...project } };
  }

  updateProject(projectId, input) {
    const project = this.#projects.get(projectId);
    if (!project) return { ok: false, error: "public_project_not_found" };
    const status = clean(input?.status || project.status, 32);
    if (!PROJECT_STATES.has(status)) return { ok: false, error: "invalid_public_project_state" };

    project.status = status;
    if (input?.progress01 !== undefined)
      project.progress01 = Math.max(0, Math.min(1, Number(input.progress01) || 0));
    if (input?.spentMinorUnits !== undefined)
      project.spentMinorUnits = Math.max(0, Math.trunc(Number(input.spentMinorUnits) || 0));
    if (project.spentMinorUnits > project.approvedBudgetMinorUnits)
      return { ok: false, error: "public_project_budget_exceeded" };
    return { ok: true, project: { ...project } };
  }

  recordSpending(input) {
    const countryId = clean(input?.countryId, 32);
    const budgetId = clean(input?.budgetId, 120);
    const agencyId = clean(input?.agencyId, 120);
    const amount = Math.max(0, Math.trunc(Number(input?.amountMinorUnits) || 0));
    if (!COUNTRIES.has(countryId) || !this.#budgets.has(budgetId) || !this.#agencies.has(agencyId) || amount <= 0)
      return { ok: false, error: "invalid_public_spending_record" };

    const budget = this.#budgets.get(budgetId);
    if (budget.countryId !== countryId || budget.status !== "approved")
      return { ok: false, error: "public_budget_not_approved" };

    const alreadySpent = [...this.#spending.values()]
      .filter(entry => entry.budgetId === budgetId)
      .reduce((sum, entry) => sum + entry.amountMinorUnits, 0);
    if (alreadySpent + amount > budget.approvedSpendingMinorUnits)
      return { ok: false, error: "public_spending_exceeds_budget" };

    const spending = {
      spendingId: randomUUID(),
      countryId,
      budgetId,
      agencyId,
      purposeTag: clean(input?.purposeTag, 100),
      amountMinorUnits: amount,
      recordedAt: new Date().toISOString(),
    };
    this.#spending.set(spending.spendingId, spending);
    return { ok: true, spending: { ...spending } };
  }

  createAudit(input) {
    const countryId = clean(input?.countryId, 32);
    const subjectType = clean(input?.subjectType, 64);
    const subjectId = clean(input?.subjectId, 120);
    if (!COUNTRIES.has(countryId) || !subjectType || !subjectId)
      return { ok: false, error: "invalid_public_audit" };

    const audit = {
      auditId: randomUUID(),
      countryId,
      subjectType,
      subjectId,
      outcome: "pending",
      findingCount: 0,
      completedAt: null,
    };
    this.#audits.set(audit.auditId, audit);
    return { ok: true, audit: { ...audit } };
  }

  completeAudit(auditId, input) {
    const audit = this.#audits.get(auditId);
    if (!audit) return { ok: false, error: "public_audit_not_found" };
    audit.outcome = clean(input?.outcome || "completed", 64);
    audit.findingCount = Math.max(0, Math.trunc(Number(input?.findingCount) || 0));
    audit.completedAt = new Date().toISOString();
    return { ok: true, audit: { ...audit } };
  }

  createProcurement(input) {
    const countryId = clean(input?.countryId, 32);
    const agencyId = clean(input?.agencyId, 120);
    const requirementTag = clean(input?.requirementTag, 100);
    if (!COUNTRIES.has(countryId) || !this.#agencies.has(agencyId) || !requirementTag)
      return { ok: false, error: "invalid_procurement" };

    const procurement = {
      procurementId: randomUUID(),
      countryId,
      agencyId,
      requirementTag,
      budgetCeilingMinorUnits: Math.max(0, Math.trunc(Number(input?.budgetCeilingMinorUnits) || 0)),
      status: "open",
      selectedSupplierId: "",
    };
    this.#procurements.set(procurement.procurementId, procurement);
    return { ok: true, procurement: { ...procurement } };
  }

  updateProcurement(procurementId, input) {
    const procurement = this.#procurements.get(procurementId);
    if (!procurement) return { ok: false, error: "procurement_not_found" };
    const status = clean(input?.status || "", 32);
    if (!PROCUREMENT_STATES.has(status)) return { ok: false, error: "invalid_procurement_state" };
    procurement.status = status;
    if (input?.selectedSupplierId !== undefined)
      procurement.selectedSupplierId = clean(input.selectedSupplierId, 120);
    return { ok: true, procurement: { ...procurement } };
  }

  createElection(input) {
    const countryId = clean(input?.countryId, 32);
    const officeTag = clean(input?.officeTag, 80);
    const scheduled = Date.parse(String(input?.scheduledAt || ""));
    if (!COUNTRIES.has(countryId) || !officeTag || !Number.isFinite(scheduled))
      return { ok: false, error: "invalid_election" };

    const election = {
      electionId: randomUUID(),
      countryId,
      officeTag,
      status: "scheduled",
      scheduledAt: new Date(scheduled).toISOString(),
      winnerCandidateId: "",
      totalVotesRecorded: 0,
    };
    this.#elections.set(election.electionId, election);
    return { ok: true, election: { ...election } };
  }

  registerCandidate(electionId, input) {
    if (!this.#elections.has(electionId)) return { ok: false, error: "election_not_found" };
    const personEntityId = clean(input?.personEntityId, 120);
    const fictionalPartyId = clean(input?.fictionalPartyId, 120);
    if (!personEntityId || !fictionalPartyId)
      return { ok: false, error: "invalid_fictional_candidate" };

    const candidate = {
      candidateId: randomUUID(),
      electionId,
      personEntityId,
      fictionalPartyId,
      votes: 0,
    };
    this.#candidates.set(candidate.candidateId, candidate);
    return { ok: true, candidate: { ...candidate } };
  }

  recordElectionResult(electionId, results) {
    const election = this.#elections.get(electionId);
    if (!election) return { ok: false, error: "election_not_found" };
    if (!Array.isArray(results) || results.length === 0)
      return { ok: false, error: "invalid_election_results" };

    const candidates = results.map(result => {
      const candidate = this.#candidates.get(String(result?.candidateId || ""));
      if (!candidate || candidate.electionId !== electionId)
        return null;
      candidate.votes = Math.max(0, Math.trunc(Number(result?.votes) || 0));
      return candidate;
    });
    if (candidates.some(candidate => !candidate))
      return { ok: false, error: "invalid_election_candidate" };

    const sorted = [...candidates].sort((a, b) => b.votes - a.votes || a.candidateId.localeCompare(b.candidateId));
    election.totalVotesRecorded = sorted.reduce((sum, candidate) => sum + candidate.votes, 0);
    election.winnerCandidateId = sorted[0].candidateId;
    election.status = "completed";
    return {
      ok: true,
      election: { ...election },
      candidates: sorted.map(candidate => ({ ...candidate })),
    };
  }

  updateApproval(input) {
    const countryId = clean(input?.countryId, 32);
    const subjectId = clean(input?.subjectId, 120);
    if (!COUNTRIES.has(countryId) || !subjectId)
      return { ok: false, error: "invalid_public_approval_state" };

    const state = {
      countryId,
      subjectId,
      approval01: Math.max(0, Math.min(1, Number(input?.approval01) || 0)),
      updatedAt: new Date().toISOString(),
    };
    this.#approval.set(countryId + ":" + subjectId, state);
    return { ok: true, approval: { ...state } };
  }

  registerGovernmentService(input) {
    const countryId = clean(input?.countryId, 32);
    const serviceType = clean(input?.serviceType, 80);
    if (!COUNTRIES.has(countryId) || !serviceType)
      return { ok: false, error: "invalid_government_service" };

    const state = {
      serviceId: String(input?.serviceId || randomUUID()),
      countryId,
      serviceType,
      regionId: clean(input?.regionId, 80),
      capacity01: Math.max(0, Math.min(1, Number(input?.capacity01) || 1)),
      availability01: Math.max(0, Math.min(1, Number(input?.availability01) || 1)),
      open: input?.open !== false,
    };
    this.#services.set(state.serviceId, state);
    return { ok: true, service: { ...state } };
  }
}
