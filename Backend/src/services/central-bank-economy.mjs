import { randomUUID } from "node:crypto";

const COUNTRY_CURRENCY = new Map([
  ["Nigeria", "NGN"],
  ["Ghana", "GHS"],
]);

const REFERENCE_CURRENCIES = new Set(["NGN", "GHS", "USD", "EUR", "GBP"]);

function clean(value, max = 100) {
  const result = String(value || "").trim();
  return result && result.length <= max ? result : "";
}

export class CentralBankEconomyService {
  #macro = new Map();
  #exchangeRates = new Map();
  #trade = new Map();
  #regulations = new Map();
  #decisions = new Map();

  getCountry(countryId) {
    const country = clean(countryId, 32);
    if (!COUNTRY_CURRENCY.has(country)) return null;
    if (!this.#macro.has(country)) {
      this.#macro.set(country, {
        countryId: country,
        currencyCode: COUNTRY_CURRENCY.get(country),
        currencySupplyMinorUnits: 0,
        policyInterestRateBasisPoints: 0,
        inflationBasisPoints: 0,
        foreignReservesReferenceUnits: 0,
        nationalDebtMinorUnits: 0,
        productivityIndex: 1,
        currencyStability01: 0.5,
        updatedAt: new Date().toISOString(),
      });
    }
    return { ...this.#macro.get(country) };
  }

  setMacroState(input) {
    const countryId = clean(input?.countryId, 32);
    if (!COUNTRY_CURRENCY.has(countryId))
      return { ok: false, error: "invalid_macro_country" };

    const current = this.getCountry(countryId);
    const next = {
      ...current,
      currencySupplyMinorUnits: Math.max(0, Math.trunc(Number(input?.currencySupplyMinorUnits ?? current.currencySupplyMinorUnits) || 0)),
      policyInterestRateBasisPoints: Math.max(0, Math.trunc(Number(input?.policyInterestRateBasisPoints ?? current.policyInterestRateBasisPoints) || 0)),
      inflationBasisPoints: Math.trunc(Number(input?.inflationBasisPoints ?? current.inflationBasisPoints) || 0),
      foreignReservesReferenceUnits: Math.max(0, Math.trunc(Number(input?.foreignReservesReferenceUnits ?? current.foreignReservesReferenceUnits) || 0)),
      nationalDebtMinorUnits: Math.max(0, Math.trunc(Number(input?.nationalDebtMinorUnits ?? current.nationalDebtMinorUnits) || 0)),
      productivityIndex: Math.max(0, Number(input?.productivityIndex ?? current.productivityIndex) || 0),
      currencyStability01: Math.max(0, Math.min(1, Number(input?.currencyStability01 ?? current.currencyStability01) || 0)),
      updatedAt: new Date().toISOString(),
    };
    this.#macro.set(countryId, next);
    return { ok: true, economy: { ...next } };
  }

  monetaryPolicy(input) {
    const countryId = clean(input?.countryId, 32);
    const state = this.getCountry(countryId);
    if (!state) return { ok: false, error: "invalid_macro_country" };

    const rate = Math.max(0, Math.trunc(Number(input?.policyInterestRateBasisPoints) || 0));
    const supplyDelta = Math.trunc(Number(input?.currencySupplyDeltaMinorUnits) || 0);
    const nextSupply = state.currencySupplyMinorUnits + supplyDelta;
    if (nextSupply < 0) return { ok: false, error: "currency_supply_cannot_be_negative" };

    state.policyInterestRateBasisPoints = rate;
    state.currencySupplyMinorUnits = nextSupply;
    state.updatedAt = new Date().toISOString();
    this.#macro.set(countryId, state);

    const decision = {
      decisionId: randomUUID(),
      countryId,
      policyInterestRateBasisPoints: rate,
      currencySupplyDeltaMinorUnits: supplyDelta,
      reasonTag: clean(input?.reasonTag || "game-policy", 100),
      recordedAt: new Date().toISOString(),
    };
    this.#decisions.set(decision.decisionId, decision);
    return { ok: true, decision: { ...decision }, economy: { ...state } };
  }

  setExchangeRate(input) {
    const baseCurrency = clean(input?.baseCurrency, 8);
    const quoteCurrency = clean(input?.quoteCurrency, 8);
    const quotePerBase = Number(input?.quotePerBase);
    if (!REFERENCE_CURRENCIES.has(baseCurrency) || !REFERENCE_CURRENCIES.has(quoteCurrency) ||
        baseCurrency === quoteCurrency || !Number.isFinite(quotePerBase) || quotePerBase <= 0)
      return { ok: false, error: "invalid_exchange_rate" };

    const state = {
      baseCurrency,
      quoteCurrency,
      quotePerBase,
      updatedAt: new Date().toISOString(),
    };
    this.#exchangeRates.set(baseCurrency + ":" + quoteCurrency, state);
    return { ok: true, exchangeRate: { ...state } };
  }

  getExchangeRate(baseCurrency, quoteCurrency) {
    const state = this.#exchangeRates.get(String(baseCurrency || "") + ":" + String(quoteCurrency || ""));
    return state ? { ...state } : null;
  }

  recordTrade(input) {
    const countryId = clean(input?.countryId, 32);
    const fiscalPeriod = clean(input?.fiscalPeriod, 40);
    if (!COUNTRY_CURRENCY.has(countryId) || !fiscalPeriod)
      return { ok: false, error: "invalid_trade_record" };

    const importsMinorUnits = Math.max(0, Math.trunc(Number(input?.importsMinorUnits) || 0));
    const exportsMinorUnits = Math.max(0, Math.trunc(Number(input?.exportsMinorUnits) || 0));
    const record = {
      tradeRecordId: randomUUID(),
      countryId,
      fiscalPeriod,
      importsMinorUnits,
      exportsMinorUnits,
      tradeBalanceMinorUnits: exportsMinorUnits - importsMinorUnits,
      recordedAt: new Date().toISOString(),
    };
    this.#trade.set(countryId + ":" + fiscalPeriod, record);
    return { ok: true, trade: { ...record } };
  }

  setBankingRegulation(input) {
    const countryId = clean(input?.countryId, 32);
    const policyTag = clean(input?.policyTag, 100);
    if (!COUNTRY_CURRENCY.has(countryId) || !policyTag)
      return { ok: false, error: "invalid_banking_regulation" };

    const state = {
      regulationId: randomUUID(),
      countryId,
      policyTag,
      capitalRequirement01: Math.max(0, Math.min(1, Number(input?.capitalRequirement01) || 0)),
      liquidityRequirement01: Math.max(0, Math.min(1, Number(input?.liquidityRequirement01) || 0)),
      active: input?.active !== false,
      updatedAt: new Date().toISOString(),
    };
    this.#regulations.set(state.regulationId, state);
    return { ok: true, regulation: { ...state } };
  }

  adjustDebt(countryId, deltaMinorUnits) {
    const state = this.getCountry(countryId);
    if (!state) return { ok: false, error: "invalid_macro_country" };
    const next = state.nationalDebtMinorUnits + Math.trunc(Number(deltaMinorUnits) || 0);
    if (next < 0) return { ok: false, error: "national_debt_cannot_be_negative" };
    state.nationalDebtMinorUnits = next;
    state.updatedAt = new Date().toISOString();
    this.#macro.set(countryId, state);
    return { ok: true, economy: { ...state } };
  }

  setProductivity(countryId, productivityIndex) {
    const state = this.getCountry(countryId);
    if (!state) return { ok: false, error: "invalid_macro_country" };
    const value = Number(productivityIndex);
    if (!Number.isFinite(value) || value < 0)
      return { ok: false, error: "invalid_productivity_index" };
    state.productivityIndex = value;
    state.updatedAt = new Date().toISOString();
    this.#macro.set(countryId, state);
    return { ok: true, economy: { ...state } };
  }

  setCurrencyStability(countryId, stability01) {
    const state = this.getCountry(countryId);
    if (!state) return { ok: false, error: "invalid_macro_country" };
    const value = Number(stability01);
    if (!Number.isFinite(value) || value < 0 || value > 1)
      return { ok: false, error: "invalid_currency_stability" };
    state.currencyStability01 = value;
    state.updatedAt = new Date().toISOString();
    this.#macro.set(countryId, state);
    return { ok: true, economy: { ...state } };
  }
}
