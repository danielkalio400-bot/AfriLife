import { sendJson } from "../http/json.mjs";

export function handleOperationsContracts(
  request,
  response,
  path,
  { roads, telecom, power, services }
) {
  if (request.method !== "GET") return false;

  if (path === "/v1/runtime/road-events") {
    sendJson(response, 200, roads);
    return true;
  }
  if (path === "/v1/runtime/telecom-operations") {
    sendJson(response, 200, telecom);
    return true;
  }
  if (path === "/v1/runtime/power-restoration") {
    sendJson(response, 200, power);
    return true;
  }
  if (path === "/v1/runtime/neighborhood-services") {
    sendJson(response, 200, services);
    return true;
  }
  return false;
}
