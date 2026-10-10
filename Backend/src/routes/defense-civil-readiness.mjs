import { readJson, sendJson } from "../http/json.mjs";

export async function handleDefenseCivilReadiness(req, res, path, { defense, contract }) {
  if (req.method === "GET" && path === "/v1/runtime/defense-civil-readiness") {
    sendJson(res, 200, contract); return true;
  }
  const commands = {
    "/v1/dev/defense/institutions": input => defense.registerInstitution(input),
    "/v1/dev/defense/readiness": input => defense.updateReadiness(input),
    "/v1/dev/defense/allocations": input => defense.recordAllocation(input),
    "/v1/dev/defense/civilian-conditions": input => defense.setCivilianCondition(input)
  };
  if (req.method === "POST" && Object.hasOwn(commands, path)) {
    try {
      const result = commands[path](await readJson(req));
      sendJson(res, result.ok ? 200 : 400, result);
    } catch (error) { sendJson(res, 400, { error: error?.code || "invalid_request" }); }
    return true;
  }
  if (req.method === "GET" && path.startsWith("/v1/dev/defense/")) {
    const url = new URL(req.url || "/", "http://localhost");
    const countryId = url.searchParams.get("countryId") || "";
    const regionId = url.searchParams.get("regionId") || "";
    if (path === "/v1/dev/defense/institutions") {
      sendJson(res, 200, { institutions: defense.listInstitutions(countryId, regionId) }); return true;
    }
    if (path === "/v1/dev/defense/allocations") {
      sendJson(res, 200, { allocations: defense.allocations(countryId) }); return true;
    }
    if (path === "/v1/dev/defense/civilian-conditions") {
      sendJson(res, 200, { conditions: defense.civilConditions(countryId, regionId) }); return true;
    }
    if (path === "/v1/dev/defense/summary") {
      const summary = defense.countrySummary(countryId);
      sendJson(res, summary ? 200 : 400, summary || { error: "invalid_country" }); return true;
    }
  }
  return false;
}
