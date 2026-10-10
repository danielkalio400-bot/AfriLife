import { sendJson } from "../http/json.mjs";

export function handleSimulationContracts(
  request,
  response,
  path,
  { traffic, utilities, transit, businesses }
) {
  if (request.method !== "GET") return false;

  if (path === "/v1/runtime/traffic-agents") {
    sendJson(response, 200, traffic);
    return true;
  }
  if (path === "/v1/runtime/utility-billing") {
    sendJson(response, 200, utilities);
    return true;
  }
  if (path === "/v1/runtime/transit-passengers") {
    sendJson(response, 200, transit);
    return true;
  }
  if (path === "/v1/runtime/businesses") {
    sendJson(response, 200, businesses);
    return true;
  }
  return false;
}
