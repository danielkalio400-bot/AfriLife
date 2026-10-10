import test from "node:test";
import assert from "node:assert/strict";
import { NationalRevenueDividendService } from "../src/services/national-revenue-dividend.mjs";
import { nationalRevenueDividendRuntime } from "../src/national-revenue-contracts.mjs";

test("Phase 37 contract includes every revenue and dividend system", () => {
  for (const system of [
    "government-revenue-account",
    "sovereign-reserve-fund",
    "citizen-dividend-fund",
    "protected-accounts",
    "automatic-distribution",
    "auditing",
    "public-transparency",
    "eligibility",
    "daily-periodic-payments",
    "economy-impact",
  ]) {
    assert.ok(nationalRevenueDividendRuntime.systems.includes(system));
  }
});

test("revenue can be allocated only when sufficient funds exist", () => {
  const service = new NationalRevenueDividendService();
  service.depositRevenue({
    countryId: "Nigeria",
    amountMinorUnits: 100000,
    sourceTag: "game-revenue",
  });

  const allocation = service.allocate({
    countryId: "Nigeria",
    destinationFund: "citizen-dividend",
    amountMinorUnits: 60000,
  });
  assert.equal(allocation.ok, true);
  assert.equal(allocation.destinationAccount.balanceMinorUnits, 60000);

  assert.equal(service.allocate({
    countryId: "Nigeria",
    destinationFund: "sovereign-reserve",
    amountMinorUnits: 50000,
  }).error, "insufficient_government_revenue");
});

test("periodic dividend distribution is idempotent and produces impact state", () => {
  const service = new NationalRevenueDividendService();
  service.depositRevenue({ countryId: "Ghana", amountMinorUnits: 100000 });
  service.allocate({
    countryId: "Ghana",
    destinationFund: "citizen-dividend",
    amountMinorUnits: 80000,
  });
  service.setEligibility({
    countryId: "Ghana",
    personEntityId: "npc-1",
    eligible: true,
  });
  service.setEligibility({
    countryId: "Ghana",
    personEntityId: "npc-2",
    eligible: true,
  });

  const first = service.runDistribution({
    countryId: "Ghana",
    periodId: "game-day-1",
    amountPerRecipientMinorUnits: 10000,
  });
  assert.equal(first.ok, true);
  assert.equal(first.run.recipientCount, 2);
  assert.equal(first.run.totalPaidMinorUnits, 20000);
  assert.equal(first.economyImpact.liquidityInjectionMinorUnits, 20000);

  const second = service.runDistribution({
    countryId: "Ghana",
    periodId: "game-day-1",
    amountPerRecipientMinorUnits: 10000,
  });
  assert.equal(second.duplicate, true);
});

test("public transparency excludes recipient identifiers", () => {
  const service = new NationalRevenueDividendService();
  service.depositRevenue({ countryId: "Nigeria", amountMinorUnits: 50000 });
  const snapshot = service.transparency("Nigeria").snapshot;
  assert.equal("personEntityId" in snapshot, false);
  assert.equal(snapshot.countryId, "Nigeria");
});

test("contract marks all policy and balances as fictional game mechanics", () => {
  assert.match(nationalRevenueDividendRuntime.designRule, /fictional game-economy mechanics/i);
  assert.match(nationalRevenueDividendRuntime.privacyRule, /aggregated/i);
});
