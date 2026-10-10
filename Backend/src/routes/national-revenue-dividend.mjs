import { readJson, sendJson } from "../http/json.mjs";

export async function handleNationalRevenueDividend(request, response, path, { finance, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/national-revenue-dividend") {
    sendJson(response, 200, contract);
    return true;
  }

  const createRoutes = new Map([
    ["/v1/dev/public-finance/revenue", body => finance.depositRevenue(body)],
    ["/v1/dev/public-finance/allocate", body => finance.allocate(body)],
    ["/v1/dev/public-finance/eligibility", body => finance.setEligibility(body)],
    ["/v1/dev/public-finance/distributions", body => finance.runDistribution(body)],
  ]);

  if (request.method === "POST" && createRoutes.has(path)) {
    try {
      const result = createRoutes.get(path)(await readJson(request));
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const transparency = path.match(/^\/v1\/public-finance\/(Nigeria|Ghana)\/transparency$/);
  if (transparency && request.method === "GET") {
    const result = finance.transparency(transparency[1]);
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.snapshot : { error: result.error });
    return true;
  }

  const audit = path.match(/^\/v1\/dev\/public-finance\/(Nigeria|Ghana)\/audit$/);
  if (audit && request.method === "GET") {
    const url = new URL(request.url || "/", "http://localhost");
    sendJson(response, 200, {
      events: finance.audit(audit[1], url.searchParams.get("limit")),
    });
    return true;
  }

  const impact = path.match(/^\/v1\/dev\/public-finance\/(Nigeria|Ghana)\/impact\/([^/]+)$/);
  if (impact && request.method === "GET") {
    const state = finance.economyImpact(impact[1], decodeURIComponent(impact[2]));
    sendJson(response, state ? 200 : 404, state || { error: "economy_impact_not_found" });
    return true;
  }

  return false;
}
