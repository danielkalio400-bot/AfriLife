import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const BRANCHES = new Set(["army", "navy", "air-force", "civil-support"]);
const CATEGORIES = new Set(["base", "transport", "medical", "support-center"]);
const PURPOSES = new Set(["maintenance", "fuel", "medical-support", "civil-services", "logistics", "equipment-upkeep"]);
const STATES = new Set(["normal", "strained", "restricted", "recovering", "stabilized"]);
const STATE_NEXT = {
  normal: new Set(["strained"]),
  strained: new Set(["restricted", "recovering"]),
  restricted: new Set(["recovering"]),
  recovering: new Set(["stabilized", "strained"]),
  stabilized: new Set(["strained"])
};
const finite01 = v => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1;
const valid = (v, limit = 120) => typeof v === "string" && v.trim() === v &&
  v.length > 0 && v.length <= limit && [...v].every(ch => ch.charCodeAt(0) >= 32);
const positiveInt = n => Number.isSafeInteger(n) && n > 0;
const clone = value => structuredClone(value);
const fail = error => ({ ok: false, error });

/**
 * Fictional macro-simulation only: no operational logistics, targeting,
 * intelligence, force positioning, weapon specification or deployment.
 * Budgets are authorized through the existing GovernmentService, never a
 * second money authority. The in-memory adapter is a development prototype.
 */
export class DefenseCivilReadinessService {
  #government;
  #institutions = new Map();
  #allocations = new Map();
  #allocationRequests = new Map();
  #regional = new Map();
  #transitions = new Map();
  #clock;

  constructor({ government, clock = () => new Date().toISOString() }) {
    if (!government || typeof government.recordSpending !== "function" ||
        typeof government.getBudget !== "function" || typeof government.getAgency !== "function") {
      throw new Error("government_budget_authority_required");
    }
    this.#government = government;
    this.#clock = clock;
  }

  registerInstitution(input) {
    const { institutionId, countryId, regionId, branch, category } = input || {};
    if (!COUNTRIES.has(countryId) || !valid(regionId) ||
        !BRANCHES.has(branch) || !CATEGORIES.has(category) ||
        (institutionId !== undefined && !valid(institutionId))) return fail("invalid_institution");
    const measures = ["maintenance01", "fuelAvailability01", "medicalSupport01", "serviceCapacity01"];
    if (measures.some(name => !finite01(input[name]))) return fail("invalid_readiness_values");
    const id = institutionId || randomUUID();
    if (this.#institutions.has(id)) return fail("institution_already_exists");
    const institution = {
      institutionId: id, countryId, regionId, branch, category,
      maintenance01: input.maintenance01,
      fuelAvailability01: input.fuelAvailability01,
      medicalSupport01: input.medicalSupport01,
      serviceCapacity01: input.serviceCapacity01,
      readinessIndex01: this.#index(input),
      fictional: true,
      updatedAt: this.#clock()
    };
    this.#institutions.set(id, institution);
    return { ok: true, institution: clone(institution) };
  }

  listInstitutions(countryId = "", regionId = "") {
    return [...this.#institutions.values()]
      .filter(entry => (!countryId || entry.countryId === countryId) &&
        (!regionId || entry.regionId === regionId))
      .sort((a, b) => a.institutionId.localeCompare(b.institutionId)).map(clone);
  }

  updateReadiness(input) {
    const record = this.#institutions.get(input?.institutionId);
    if (!record) return fail("institution_not_found");
    const names = ["maintenance01", "fuelAvailability01", "medicalSupport01", "serviceCapacity01"];
    if (!valid(input?.revisionId) || names.some(name => input[name] !== undefined && !finite01(input[name])))
      return fail("invalid_readiness_update");
    const requestKey = "readiness|" + record.institutionId + "|" + input.revisionId;
    const previous = this.#transitions.get(requestKey);
    if (previous) return previous.fingerprint === JSON.stringify(names.map(n => input[n] ?? null))
      ? { ok: true, institution: clone(record), replay: true } : fail("revision_conflict");
    for (const name of names) if (input[name] !== undefined) record[name] = input[name];
    record.readinessIndex01 = this.#index(record);
    record.updatedAt = this.#clock();
    this.#transitions.set(requestKey, { fingerprint: JSON.stringify(names.map(n => input[n] ?? null)) });
    return { ok: true, institution: clone(record), replay: false };
  }

  recordAllocation(input) {
    const { institutionId, budgetId, agencyId, amountMinorUnits, purpose, requestId } = input || {};
    const institution = this.#institutions.get(institutionId);
    if (!institution) return fail("institution_not_found");
    if (!valid(budgetId) || !valid(agencyId) || !valid(requestId) ||
        !PURPOSES.has(purpose) || !positiveInt(amountMinorUnits))
      return fail("invalid_allocation");
    const key = institution.countryId + "|" + requestId;
    const fingerprint = JSON.stringify([institutionId, budgetId, agencyId, amountMinorUnits, purpose]);
    const previous = this.#allocationRequests.get(key);
    if (previous) return previous.fingerprint === fingerprint
      ? { ok: true, allocation: clone(this.#allocations.get(previous.allocationId)), replay: true }
      : fail("allocation_request_conflict");

    const budget = this.#government.getBudget(budgetId);
    const agency = this.#government.getAgency(agencyId);
    if (!budget || !agency || budget.countryId !== institution.countryId ||
        agency.countryId !== institution.countryId || budget.status !== "approved")
      return fail("budget_or_agency_not_approved_for_country");

    const spending = this.#government.recordSpending({
      countryId: institution.countryId,
      budgetId, agencyId, amountMinorUnits,
      purposeTag: "fictional-defense-" + purpose
    });
    if (!spending.ok) return fail(spending.error);
    const allocation = {
      allocationId: randomUUID(), requestId, institutionId,
      countryId: institution.countryId, budgetId, agencyId,
      purpose, amountMinorUnits, currency: budget.currency,
      governmentSpendingId: spending.spending.spendingId,
      recordedAt: this.#clock()
    };
    this.#allocations.set(allocation.allocationId, allocation);
    this.#allocationRequests.set(key, { allocationId: allocation.allocationId, fingerprint });
    return { ok: true, allocation: clone(allocation), replay: false };
  }

  allocations(countryId = "") {
    return [...this.#allocations.values()].filter(e => !countryId || e.countryId === countryId)
      .sort((a, b) => a.allocationId.localeCompare(b.allocationId)).map(clone);
  }

  setCivilianCondition(input) {
    const { countryId, regionId, state, pressure01, eventId } = input || {};
    if (!COUNTRIES.has(countryId) || !valid(regionId) || !STATES.has(state) ||
        !finite01(pressure01) || !valid(eventId)) return fail("invalid_civilian_condition");
    const key = countryId + "|" + regionId;
    const existing = this.#regional.get(key);
    const requestKey = "civil|" + key + "|" + eventId;
    const fingerprint = JSON.stringify([state, pressure01]);
    const replay = this.#transitions.get(requestKey);
    if (replay) return replay.fingerprint === fingerprint
      ? { ok: true, condition: clone(this.#regional.get(key)), replay: true } : fail("civilian_event_conflict");
    const before = existing?.state || "normal";
    if (!STATE_NEXT[before].has(state)) return fail("invalid_civilian_transition");
    const updatedAt = this.#clock();
    const condition = {
      countryId, regionId, state, pressure01, updateTag: "fictional-service-impact",
      transportReliability01: Math.max(0.15, 1 - pressure01 * 0.65),
      hospitalAvailability01: Math.max(0.25, 1 - pressure01 * 0.55),
      supplyReliability01: Math.max(0.2, 1 - pressure01 * 0.6),
      assistanceDemand01: pressure01,
      updatedAt
    };
    this.#regional.set(key, condition);
    this.#transitions.set(requestKey, { fingerprint });
    return { ok: true, condition: clone(condition), replay: false };
  }

  civilConditions(countryId = "", regionId = "") {
    return [...this.#regional.values()].filter(v =>
      (!countryId || v.countryId === countryId) &&
      (!regionId || v.regionId === regionId))
      .sort((a, b) => a.countryId.localeCompare(b.countryId) ||
        a.regionId.localeCompare(b.regionId)).map(clone);
  }

  countrySummary(countryId) {
    if (!COUNTRIES.has(countryId)) return null;
    const institutions = this.listInstitutions(countryId);
    const money = this.allocations(countryId);
    return {
      countryId, fictional: true, institutionCount: institutions.length,
      branchCounts: Object.fromEntries([...BRANCHES].map(branch =>
        [branch, institutions.filter(item => item.branch === branch).length])),
      averageReadiness01: institutions.length
        ? institutions.reduce((sum, item) => sum + item.readinessIndex01, 0) / institutions.length : null,
      recordedAllocationMinorUnits: money.reduce((sum, item) => sum + item.amountMinorUnits, 0),
      budgetAuthority: "existing-government-service",
      affectedRegions: this.civilConditions(countryId).length
    };
  }

  #index(value) {
    return (value.maintenance01 + value.fuelAvailability01 +
      value.medicalSupport01 + value.serviceCapacity01) / 4;
  }
}
