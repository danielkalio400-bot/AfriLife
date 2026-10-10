import { readJson, sendJson } from "../http/json.mjs";

export async function handleEnvironmentalResponse(request, response, path, { responseService, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/environmental-response") {
    sendJson(response, 200, contract);
    return true;
  }
  if (request.method === "GET" && path === "/v1/environment/assess") {
    const url = new URL(request.url, "http://localhost");
    const assessment = responseService.assess(
      url.searchParams.get("countryId"), url.searchParams.get("regionId")
    );
    sendJson(response, assessment ? 200 : 404, assessment || { error: "weather_state_not_found" });
    return true;
  }
  if (request.method === "GET" && path === "/v1/environment/disruptions") {
    const url = new URL(request.url, "http://localhost");
    sendJson(response, 200, { incidents: responseService.list({
      countryId: url.searchParams.get("countryId") || "",
      regionId: url.searchParams.get("regionId") || "",
      status: url.searchParams.get("status") || "",
    }) });
    return true;
  }
  if (request.method === "POST" && (path === "/v1/dev/environment/disruptions" ||
      path === "/v1/dev/environment/recovery")) {
    try {
      const input = await readJson(request);
      const result = path.endsWith("/recovery") ? responseService.advance(input) : responseService.open(input);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
    }
    return true;
  }
  return false;
}
