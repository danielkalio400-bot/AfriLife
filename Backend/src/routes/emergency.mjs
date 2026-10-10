import { readJson, sendJson } from "../http/json.mjs";

export async function handleEmergency(
  request,
  response,
  path,
  { emergency, contract }
) {
  if (request.method === "GET" && path === "/v1/runtime/emergency-services") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/emergency/units") {
    try {
      const result = emergency.registerUnit(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.unit : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/emergency/calls") {
    try {
      const result = emergency.receiveCall(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const dispatch = path.match(/^\/v1\/dev\/emergency\/incidents\/([^/]+)\/dispatch$/);
  if (dispatch && request.method === "POST") {
    const result = emergency.dispatch(decodeURIComponent(dispatch[1]));
    sendJson(response, result.ok ? 200 : 404, result.ok ? result : { error: result.error });
    return true;
  }

  const incident = path.match(/^\/v1\/dev\/emergency\/incidents\/([^/]+)$/);
  if (incident && request.method === "GET") {
    const state = emergency.getIncident(decodeURIComponent(incident[1]));
    sendJson(response, state ? 200 : 404, state || { error: "emergency_incident_not_found" });
    return true;
  }
  if (incident && request.method === "POST") {
    try {
      const result = emergency.updateIncident(
        decodeURIComponent(incident[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.incident : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const report = path.match(/^\/v1\/dev\/emergency\/incidents\/([^/]+)\/report$/);
  if (report && request.method === "POST") {
    try {
      const result = emergency.createReport(
        decodeURIComponent(report[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.report : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
