import test from "node:test";
import assert from "node:assert/strict";
import { DefenseCivilReadinessService } from "../src/services/defense-civil-readiness.mjs";
import { GovernmentService } from "../src/services/government.mjs";
import { defenseCivilReadinessRuntime } from "../src/defense-contracts.mjs";
import { makeServer } from "../src/server.mjs";

function scenario(countryId = "Nigeria") {
  const government = new GovernmentService();
  const defense = new DefenseCivilReadinessService({ government });
  const institution = defense.registerInstitution({
    institutionId: countryId + "-institution", countryId, regionId: "FictionalCoastalDistrict",
    branch: "civil-support", category: "support-center", maintenance01: 0.8,
    fuelAvailability01: 0.7, medicalSupport01: 0.9, serviceCapacity01: 0.8
  });
  const agency = government.registerAgency({ countryId, displayName: "Fictional Services" });
  const budget = government.createBudget({
    countryId, fiscalPeriod: "game-year-one", plannedSpendingMinorUnits: 10000
  });
  government.approveBudget(budget.budget.budgetId, 10000);
  return { government, defense, institution: institution.institution,
    agencyId: agency.agency.agencyId, budgetId: budget.budget.budgetId };
}

test("Phase 41 contract is high level, fictional and covers both countries", () => {
  assert.deepEqual(defenseCivilReadinessRuntime.countries, ["Nigeria", "Ghana"]);
  assert.match(defenseCivilReadinessRuntime.deterrence, /abstract narrative/i);
  assert.ok(defenseCivilReadinessRuntime.guardrails.includes("no tactical operations"));
});

test("readiness updates are bounded, revision-idempotent, and isolated by institution", () => {
  const { defense, institution } = scenario();
  const input = { institutionId: institution.institutionId, revisionId: "v1", maintenance01: 0.4 };
  assert.equal(defense.updateReadiness(input).ok, true);
  assert.equal(defense.updateReadiness(input).replay, true);
  assert.equal(defense.updateReadiness({ ...input, maintenance01: 0.1 }).error, "revision_conflict");
  assert.equal(defense.updateReadiness({ ...input, revisionId: "v2", fuelAvailability01: 2 }).error, "invalid_readiness_update");
  assert.equal(defense.listInstitutions("Ghana").length, 0);
});

test("approved existing-government budget enforces spending caps and idempotency", () => {
  const { defense, institution, agencyId, budgetId } = scenario("Ghana");
  const input = { institutionId: institution.institutionId, agencyId, budgetId,
    purpose: "medical-support", amountMinorUnits: 6500, requestId: "request-1" };
  const first = defense.recordAllocation(input);
  assert.equal(first.ok, true);
  assert.equal(first.allocation.currency, "GHS");
  assert.equal(defense.recordAllocation(input).replay, true);
  assert.equal(defense.recordAllocation({ ...input, amountMinorUnits: 1 }).error, "allocation_request_conflict");
  assert.equal(defense.recordAllocation({ ...input, requestId: "request-2", amountMinorUnits: 5000 }).error, "public_spending_exceeds_budget");
  assert.equal(defense.allocations("Ghana").length, 1);
  assert.equal(defense.countrySummary("Ghana").recordedAllocationMinorUnits, 6500);
});

test("invalid national authority and unsafe fiscal numbers rejected", () => {
  const ng = scenario("Nigeria");
  const gh = scenario("Ghana");
  assert.equal(ng.defense.recordAllocation({
    institutionId: ng.institution.institutionId, budgetId: gh.budgetId, agencyId: ng.agencyId,
    amountMinorUnits: 200, purpose: "civil-services", requestId: "x"
  }).error, "budget_or_agency_not_approved_for_country");
  assert.equal(ng.defense.recordAllocation({
    institutionId: ng.institution.institutionId, budgetId: ng.budgetId, agencyId: ng.agencyId,
    amountMinorUnits: 0, purpose: "civil-services", requestId: "x"
  }).error, "invalid_allocation");
  assert.equal(ng.defense.registerInstitution({
    countryId: "Other", branch: "army", category: "base", regionId: "R"
  }).error, "invalid_institution");
});

test("regional civilian service state allows recovery and prevents out-of-order escalation", () => {
  const { defense } = scenario();
  const base = { countryId: "Nigeria", regionId: "FictionalDistrict", eventId: "a", pressure01: 0.8 };
  const first = defense.setCivilianCondition({ ...base, state: "strained" });
  assert.equal(first.ok, true);
  assert.ok(first.condition.hospitalAvailability01 < 1);
  assert.equal(defense.setCivilianCondition({ ...base, state: "strained" }).replay, true);
  assert.equal(defense.setCivilianCondition({ ...base, state: "restricted" }).error, "civilian_event_conflict");
  assert.equal(defense.setCivilianCondition({ ...base, eventId: "b", state: "stabilized" }).error, "invalid_civilian_transition");
  assert.equal(defense.setCivilianCondition({ ...base, eventId: "c", state: "restricted" }).ok, true);
  assert.equal(defense.setCivilianCondition({ ...base, eventId: "d", state: "recovering", pressure01: 0.3 }).ok, true);
  const last = defense.setCivilianCondition({ ...base, eventId: "e", state: "stabilized", pressure01: 0 });
  assert.equal(last.ok, true);
  assert.equal(last.condition.supplyReliability01, 1);
  assert.equal(defense.civilConditions("Ghana").length, 0);
});

test("local HTTP service shares government budget authority", async t => {
  const server = makeServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const base = "http://127.0.0.1:" + server.address().port;
  const request = async (path, input) => {
    const response = await fetch(base + path, { method: "POST",
      headers: { "content-type":"application/json" }, body: JSON.stringify(input) });
    return { status: response.status, body: await response.json() };
  };
  const agency = await request("/v1/dev/government/agencies", {
    countryId: "Nigeria", displayName: "Fictional Civil Support"
  });
  const budget = await request("/v1/dev/government/budgets", {
    countryId:"Nigeria", fiscalPeriod:"y1", plannedSpendingMinorUnits:1500
  });
  await request("/v1/dev/government/budgets/" + budget.body.budget.budgetId + "/approve", {
    approvedSpendingMinorUnits: 1500
  });
  const inst = await request("/v1/dev/defense/institutions", {
    countryId:"Nigeria", regionId:"FictionalDistrict", branch:"civil-support",
    category:"medical", maintenance01:1, fuelAvailability01:1, medicalSupport01:1,
    serviceCapacity01:1
  });
  assert.equal(inst.status, 200);
  const allocation = await request("/v1/dev/defense/allocations", {
    institutionId: inst.body.institution.institutionId, budgetId:budget.body.budget.budgetId,
    agencyId:agency.body.agency.agencyId, requestId:"api-1",
    purpose:"medical-support", amountMinorUnits:750
  });
  assert.equal(allocation.status, 200);
  const summary = await fetch(base + "/v1/dev/defense/summary?countryId=Nigeria");
  assert.equal((await summary.json()).recordedAllocationMinorUnits, 750);
});
