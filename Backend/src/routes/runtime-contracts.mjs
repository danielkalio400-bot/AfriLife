import { sendJson } from "../http/json.mjs";

export function handleRuntimeContracts(
  request,
  response,
  path,
  { cities, neighborhood, transit }
) {
  if (request.method !== "GET") return false;

  if (path === "/v1/runtime/cities") {
    sendJson(response, 200, cities);
    return true;
  }

  if (path === "/v1/runtime/first-neighborhood") {
    sendJson(response, 200, neighborhood);
    return true;
  }

  if (path === "/v1/runtime/public-transit") {
    sendJson(response, 200, transit);
    return true;
  }

  return false;
}
