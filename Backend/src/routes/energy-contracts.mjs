import { sendJson } from "../http/json.mjs";

export function handleEnergyContracts(
  request,
  response,
  path,
  { backup, fuel, telecom, maintenance }
) {
  if (request.method !== "GET") return false;

  if (path === "/v1/runtime/backup-energy") {
    sendJson(response, 200, backup);
    return true;
  }
  if (path === "/v1/runtime/fuel-economy") {
    sendJson(response, 200, fuel);
    return true;
  }
  if (path === "/v1/runtime/telecom-billing") {
    sendJson(response, 200, telecom);
    return true;
  }
  if (path === "/v1/runtime/maintenance-businesses") {
    sendJson(response, 200, maintenance);
    return true;
  }
  return false;
}
