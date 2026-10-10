import { readJson, sendJson } from "../http/json.mjs";

export async function handleCentralBankEconomy(request, response, path, { economy, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/central-bank-economy") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/economy/macro") {
    try {
      const result = economy.setMacroState(await readJson(request));
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.economy : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/economy/monetary-policy") {
    try {
      const result = economy.monetaryPolicy(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/economy/exchange-rates") {
    try {
      const result = economy.setExchangeRate(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.exchangeRate : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/economy/trade") {
    try {
      const result = economy.recordTrade(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.trade : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/economy/banking-regulation") {
    try {
      const result = economy.setBankingRegulation(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.regulation : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const country = path.match(/^\/v1\/dev\/economy\/countries\/(Nigeria|Ghana)$/);
  if (country && request.method === "GET") {
    sendJson(response, 200, economy.getCountry(country[1]));
    return true;
  }

  const debt = path.match(/^\/v1\/dev\/economy\/countries\/(Nigeria|Ghana)\/debt$/);
  if (debt && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = economy.adjustDebt(debt[1], body?.deltaMinorUnits);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.economy : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const productivity = path.match(/^\/v1\/dev\/economy\/countries\/(Nigeria|Ghana)\/productivity$/);
  if (productivity && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = economy.setProductivity(productivity[1], body?.productivityIndex);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.economy : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const stability = path.match(/^\/v1\/dev\/economy\/countries\/(Nigeria|Ghana)\/currency-stability$/);
  if (stability && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = economy.setCurrencyStability(stability[1], body?.currencyStability01);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.economy : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const exchange = path.match(/^\/v1\/dev\/economy\/exchange-rates\/([A-Z]{3})\/([A-Z]{3})$/);
  if (exchange && request.method === "GET") {
    const state = economy.getExchangeRate(exchange[1], exchange[2]);
    sendJson(response, state ? 200 : 404, state || { error: "exchange_rate_not_found" });
    return true;
  }

  return false;
}
