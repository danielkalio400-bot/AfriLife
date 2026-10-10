import test from "node:test";
import assert from "node:assert/strict";
import { GovernmentService } from "../src/services/government.mjs";
import { governmentRuntime } from "../src/government-contracts.mjs";

test("Phase 35 contract covers every government system in the master guide", () => {
  for (const system of [
    "president",
    "ministers",
    "governors",
    "legislature",
    "agencies",
    "budgets",
    "public-projects",
    "salaries",
    "treasury",
    "public-spending",
    "audits",
    "procurement",
    "elections",
    "public-approval",
    "government-services",
  ]) {
    assert.ok(governmentRuntime.systems.includes(system));
  }
});

test("budget caps public spending", () => {
  const government = new GovernmentService();
  const agency = government.registerAgency({
    countryId: "Nigeria",
    displayName: "Fictional Works Agency",
  });
  const budget = government.createBudget({
    countryId: "Nigeria",
    fiscalPeriod: "game-year-1",
    plannedSpendingMinorUnits: 100000,
  });
  government.approveBudget(budget.budget.budgetId, 100000);

  assert.equal(government.recordSpending({
    countryId: "Nigeria",
    budgetId: budget.budget.budgetId,
    agencyId: agency.agency.agencyId,
    amountMinorUnits: 75000,
    purposeTag: "public-project",
  }).ok, true);

  assert.equal(government.recordSpending({
    countryId: "Nigeria",
    budgetId: budget.budget.budgetId,
    agencyId: agency.agency.agencyId,
    amountMinorUnits: 50000,
  }).error, "public_spending_exceeds_budget");
});

test("fictional election records candidates and a neutral result", () => {
  const government = new GovernmentService();
  const election = government.createElection({
    countryId: "Ghana",
    officeTag: "fictional-national-office",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
  });
  const a = government.registerCandidate(election.election.electionId, {
    personEntityId: "npc-a",
    fictionalPartyId: "fictional-party-a",
  });
  const b = government.registerCandidate(election.election.electionId, {
    personEntityId: "npc-b",
    fictionalPartyId: "fictional-party-b",
  });

  const result = government.recordElectionResult(election.election.electionId, [
    { candidateId: a.candidate.candidateId, votes: 100 },
    { candidateId: b.candidate.candidateId, votes: 90 },
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.election.totalVotesRecorded, 190);
});

test("government runtime remains fictional and politically neutral", () => {
  assert.match(governmentRuntime.politicsRule, /fictional game people/i);
  assert.match(governmentRuntime.politicsRule, /do not endorse real candidates/i);
});

test("public projects enforce approved project budget", () => {
  const government = new GovernmentService();
  const project = government.createProject({
    countryId: "Ghana",
    regionId: "Accra",
    projectType: "public-transport",
    approvedBudgetMinorUnits: 10000,
  });
  assert.equal(project.ok, true);
  assert.equal(government.updateProject(project.project.projectId, {
    status: "active",
    progress01: 0.25,
    spentMinorUnits: 12000,
  }).error, "public_project_budget_exceeded");
});
