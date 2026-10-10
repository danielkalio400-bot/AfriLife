import { randomUUID } from "node:crypto";

const COUNTRY_CURRENCY = new Map([
  ["Nigeria", "NGN"],
  ["Ghana", "GHS"],
]);

const FUND_TYPES = [
  "government-revenue",
  "sovereign-reserve",
  "citizen-dividend",
];

function clean(value, max = 120) {
  const result = String(value || "").trim();
  return result && result.length <= max ? result : "";
}

export class NationalRevenueDividendService {
  #accounts = new Map();
  #eligibility = new Map();
  #payments = new Map();
  #runs = new Map();
  #audit = [];
  #impacts = new Map();

  ensureCountry(countryId) {
    const country = clean(countryId, 32);
    const currency = COUNTRY_CURRENCY.get(country);
    if (!currency) return { ok: false, error: "invalid_public_finance_country" };

    const accounts = {};
    for (const fundType of FUND_TYPES) {
      const key = country + ":" + fundType;
      if (!this.#accounts.has(key)) {
        this.#accounts.set(key, {
          accountId: randomUUID(),
          countryId: country,
          fundType,
          currency,
          balanceMinorUnits: 0,
          protected: true,
          updatedAt: new Date().toISOString(),
        });
      }
      accounts[fundType] = { ...this.#accounts.get(key) };
    }
    return { ok: true, accounts };
  }

  depositRevenue(input) {
    const countryId = clean(input?.countryId, 32);
    const amount = Math.max(0, Math.trunc(Number(input?.amountMinorUnits) || 0));
    const sourceTag = clean(input?.sourceTag || "public-revenue", 80);
    if (amount <= 0) return { ok: false, error: "invalid_revenue_amount" };

    const country = this.ensureCountry(countryId);
    if (!country.ok) return country;
    const key = countryId + ":government-revenue";
    const account = this.#accounts.get(key);
    account.balanceMinorUnits += amount;
    account.updatedAt = new Date().toISOString();

    const event = this.#record("revenue-deposit", countryId, {
      amountMinorUnits: amount,
      sourceTag,
    });
    return { ok: true, account: { ...account }, auditEvent: event };
  }

  allocate(input) {
    const countryId = clean(input?.countryId, 32);
    const destinationFund = clean(input?.destinationFund, 40);
    const amount = Math.max(0, Math.trunc(Number(input?.amountMinorUnits) || 0));
    if (!["sovereign-reserve", "citizen-dividend"].includes(destinationFund) || amount <= 0)
      return { ok: false, error: "invalid_public_fund_allocation" };

    const country = this.ensureCountry(countryId);
    if (!country.ok) return country;

    const revenue = this.#accounts.get(countryId + ":government-revenue");
    const destination = this.#accounts.get(countryId + ":" + destinationFund);
    if (revenue.balanceMinorUnits < amount)
      return { ok: false, error: "insufficient_government_revenue" };

    revenue.balanceMinorUnits -= amount;
    destination.balanceMinorUnits += amount;
    const now = new Date().toISOString();
    revenue.updatedAt = now;
    destination.updatedAt = now;

    this.#record("protected-fund-allocation", countryId, {
      destinationFund,
      amountMinorUnits: amount,
    });
    return {
      ok: true,
      revenueAccount: { ...revenue },
      destinationAccount: { ...destination },
    };
  }

  setEligibility(input) {
    const countryId = clean(input?.countryId, 32);
    const personEntityId = clean(input?.personEntityId, 120);
    const eligible = input?.eligible === true;
    const reasonTag = clean(input?.reasonTag || (eligible ? "game-eligible" : "game-ineligible"), 80);
    if (!COUNTRY_CURRENCY.has(countryId) || !personEntityId)
      return { ok: false, error: "invalid_dividend_eligibility" };

    const key = countryId + ":" + personEntityId;
    const record = {
      eligibilityId: this.#eligibility.get(key)?.eligibilityId || randomUUID(),
      countryId,
      personEntityId,
      eligible,
      reasonTag,
      updatedAt: new Date().toISOString(),
    };
    this.#eligibility.set(key, record);
    this.#record("eligibility-updated", countryId, {
      eligibilityId: record.eligibilityId,
      eligible,
    });
    return { ok: true, eligibility: { ...record } };
  }

  runDistribution(input) {
    const countryId = clean(input?.countryId, 32);
    const periodId = clean(input?.periodId, 80);
    const amountPerRecipient = Math.max(0, Math.trunc(Number(input?.amountPerRecipientMinorUnits) || 0));
    if (!COUNTRY_CURRENCY.has(countryId) || !periodId || amountPerRecipient <= 0)
      return { ok: false, error: "invalid_dividend_distribution" };

    const runKey = countryId + ":" + periodId;
    if (this.#runs.has(runKey))
      return { ok: true, duplicate: true, run: structuredClone(this.#runs.get(runKey)) };

    this.ensureCountry(countryId);
    const eligible = [...this.#eligibility.values()]
      .filter(record => record.countryId === countryId && record.eligible)
      .sort((a, b) => a.personEntityId.localeCompare(b.personEntityId));

    if (eligible.length === 0)
      return { ok: false, error: "no_eligible_dividend_recipients" };

    const total = amountPerRecipient * eligible.length;
    const fund = this.#accounts.get(countryId + ":citizen-dividend");
    if (fund.balanceMinorUnits < total)
      return { ok: false, error: "insufficient_citizen_dividend_fund" };

    const paidAt = new Date().toISOString();
    const paymentIds = [];
    for (const recipient of eligible) {
      const payment = {
        paymentId: randomUUID(),
        countryId,
        periodId,
        personEntityId: recipient.personEntityId,
        amountMinorUnits: amountPerRecipient,
        currency: COUNTRY_CURRENCY.get(countryId),
        paidAt,
      };
      this.#payments.set(payment.paymentId, payment);
      paymentIds.push(payment.paymentId);
    }

    fund.balanceMinorUnits -= total;
    fund.updatedAt = paidAt;

    const run = {
      distributionId: randomUUID(),
      countryId,
      periodId,
      amountPerRecipientMinorUnits: amountPerRecipient,
      recipientCount: eligible.length,
      totalPaidMinorUnits: total,
      currency: COUNTRY_CURRENCY.get(countryId),
      paymentIds,
      paidAt,
    };
    this.#runs.set(runKey, run);

    const impact = {
      countryId,
      periodId,
      liquidityInjectionMinorUnits: total,
      recipientCount: eligible.length,
      demandIndexDelta: Math.min(0.25, total / 1000000000),
      updatedAt: paidAt,
    };
    this.#impacts.set(runKey, impact);

    this.#record("dividend-distribution", countryId, {
      distributionId: run.distributionId,
      periodId,
      recipientCount: eligible.length,
      totalPaidMinorUnits: total,
    });

    return {
      ok: true,
      duplicate: false,
      run: structuredClone(run),
      economyImpact: { ...impact },
      fund: { ...fund },
    };
  }

  transparency(countryId) {
    const country = this.ensureCountry(countryId);
    if (!country.ok) return country;

    const runs = [...this.#runs.values()].filter(run => run.countryId === countryId);
    const totalDividendPaidMinorUnits = runs.reduce((sum, run) => sum + run.totalPaidMinorUnits, 0);
    const dividendRecipientCount = runs.reduce((sum, run) => sum + run.recipientCount, 0);

    return {
      ok: true,
      snapshot: {
        snapshotId: randomUUID(),
        countryId,
        currency: COUNTRY_CURRENCY.get(countryId),
        governmentRevenueBalanceMinorUnits: country.accounts["government-revenue"].balanceMinorUnits,
        sovereignReserveBalanceMinorUnits: country.accounts["sovereign-reserve"].balanceMinorUnits,
        citizenDividendBalanceMinorUnits: country.accounts["citizen-dividend"].balanceMinorUnits,
        totalDividendPaidMinorUnits,
        dividendRecipientCount,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  audit(countryId = "", limit = 100) {
    const count = Math.min(500, Math.max(1, Math.trunc(Number(limit) || 100)));
    return this.#audit
      .filter(event => !countryId || event.countryId === countryId)
      .slice(-count)
      .map(event => structuredClone(event));
  }

  economyImpact(countryId, periodId) {
    const impact = this.#impacts.get(String(countryId || "") + ":" + String(periodId || ""));
    return impact ? { ...impact } : null;
  }

  #record(type, countryId, details) {
    const event = {
      eventId: randomUUID(),
      type,
      countryId,
      details: { ...details },
      recordedAt: new Date().toISOString(),
    };
    this.#audit.push(event);
    if (this.#audit.length > 5000) this.#audit.shift();
    return structuredClone(event);
  }
}
