import test from "node:test";
import assert from "node:assert/strict";
import { CentralBankEconomyService } from "../src/services/central-bank-economy.mjs";
import { centralBankEconomyRuntime } from "../src/central-bank-contracts.mjs";

test("Phase 36 contract includes every central-bank and national-economy system", () => {
  for (const system of [
    "currency-supply",
    "interest-rates",
    "inflation",
    "foreign-reserves",
    "exchange-rates",
    "debt",
    "imports",
    "exports",
    "trade-balance",
    "productivity",
    "banking-regulation",
    "currency-stability",
  ]) {
    assert.ok(centralBankEconomyRuntime.systems.includes(system));
  }
});

test("Nigeria and Ghana use their game currency codes", () => {
  const service = new CentralBankEconomyService();
  assert.equal(service.getCountry("Nigeria").currencyCode, "NGN");
  assert.equal(service.getCountry("Ghana").currencyCode, "GHS");
});

test("trade balance is exports minus imports", () => {
  const service = new CentralBankEconomyService();
  const result = service.recordTrade({
    countryId: "Ghana",
    fiscalPeriod: "game-year-1",
    importsMinorUnits: 7000,
    exportsMinorUnits: 9000,
  });
  assert.equal(result.ok, true);
  assert.equal(result.trade.tradeBalanceMinorUnits, 2000);
});

test("monetary policy cannot make currency supply negative", () => {
  const service = new CentralBankEconomyService();
  service.setMacroState({
    countryId: "Nigeria",
    currencySupplyMinorUnits: 1000,
  });
  const rejected = service.monetaryPolicy({
    countryId: "Nigeria",
    policyInterestRateBasisPoints: 1000,
    currencySupplyDeltaMinorUnits: -2000,
  });
  assert.equal(rejected.error, "currency_supply_cannot_be_negative");
});

test("exchange rates and stability are fictional game state", () => {
  const service = new CentralBankEconomyService();
  assert.equal(service.setExchangeRate({
    baseCurrency: "NGN",
    quoteCurrency: "GHS",
    quotePerBase: 0.1,
  }).ok, true);
  assert.equal(service.setCurrencyStability("Nigeria", 0.7).ok, true);
  assert.match(centralBankEconomyRuntime.designRule, /fictional game-state variables/i);
  assert.match(centralBankEconomyRuntime.designRule, /not current economic data/i);
});
