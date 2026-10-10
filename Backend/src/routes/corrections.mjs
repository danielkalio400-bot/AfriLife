import { readJson, sendJson } from "../http/json.mjs";

export async function handleCorrections(
  request,
  response,
  path,
  { corrections, contract }
) {
  if (request.method === "GET" && path === "/v1/runtime/prison-system") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/corrections/facilities") {
    try {
      const result = corrections.registerFacility(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.facility : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/corrections/intake") {
    try {
      const result = corrections.intake(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.record : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const record = path.match(/^\/v1\/dev\/corrections\/records\/([^/]+)$/);
  if (record && request.method === "GET") {
    const result = corrections.get(decodeURIComponent(record[1]));
    sendJson(response, result ? 200 : 404, result || { error: "incarceration_record_not_found" });
    return true;
  }

  const action = path.match(/^\/v1\/dev\/corrections\/records\/([^/]+)\/(cell|program|visit|health-care|advance-time|parole-review|release)$/);
  if (action && request.method === "POST") {
    const recordId = decodeURIComponent(action[1]);
    try {
      const body = await readJson(request);
      let result;
      if (action[2] === "cell") result = corrections.assignCell(recordId, body);
      else if (action[2] === "program") result = corrections.enrollProgram(recordId, body);
      else if (action[2] === "visit") result = corrections.scheduleVisit(recordId, body);
      else if (action[2] === "health-care") result = corrections.requestHealthCare(recordId, body);
      else if (action[2] === "advance-time") result = corrections.advanceTime(recordId, body?.days);
      else if (action[2] === "parole-review") result = corrections.reviewParole(recordId, body);
      else result = corrections.release(recordId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const program = path.match(/^\/v1\/dev\/corrections\/programs\/([^/]+)\/advance$/);
  if (program && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = corrections.advanceProgram(decodeURIComponent(program[1]), body?.completedSessions);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.enrollment : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
