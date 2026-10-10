import { sendJson } from "../http/json.mjs";

export function handleWorldReference(
  request,
  response,
  path,
  { nigeria, ghana, crossBorder, sources }
) {
  if (request.method !== "GET") return false;

  if (path === "/v1/world-reference/nigeria") {
    sendJson(response, 200, nigeria);
    return true;
  }

  if (path === "/v1/world-reference/ghana") {
    sendJson(response, 200, ghana);
    return true;
  }

  if (path === "/v1/world-reference/cross-border") {
    sendJson(response, 200, crossBorder);
    return true;
  }

  if (path === "/v1/world-reference/sources") {
    sendJson(response, 200, sources);
    return true;
  }

  return false;
}
