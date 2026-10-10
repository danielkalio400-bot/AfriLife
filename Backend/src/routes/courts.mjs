import { readJson, sendJson } from "../http/json.mjs";

export async function handleCourts(
  request,
  response,
  path,
  { courts, contract }
) {
  if (request.method === "GET" && path === "/v1/runtime/court-justice") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/courts/cases") {
    try {
      const result = courts.fileCase(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.case : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const base = path.match(/^\/v1\/dev\/courts\/cases\/([^/]+)$/);
  if (base && request.method === "GET") {
    const result = courts.getCase(decodeURIComponent(base[1]));
    sendJson(response, result ? 200 : 404, result || { error: "court_case_not_found" });
    return true;
  }

  const action = path.match(/^\/v1\/dev\/courts\/cases\/([^/]+)\/(participant|evidence|schedule|state|decision|appeal)$/);
  if (action && request.method === "POST") {
    const caseId = decodeURIComponent(action[1]);
    try {
      const body = await readJson(request);
      let result;
      if (action[2] === "participant") result = courts.addParticipant(caseId, body);
      else if (action[2] === "evidence") result = courts.attachEvidence(caseId, body?.evidenceId);
      else if (action[2] === "schedule") result = courts.schedule(caseId, body);
      else if (action[2] === "state") result = courts.setState(caseId, body?.state);
      else if (action[2] === "decision") result = courts.decide(caseId, body);
      else result = courts.appeal(caseId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const execution = path.match(/^\/v1\/dev\/courts\/sentence-executions\/([^/]+)$/);
  if (execution && request.method === "POST") {
    try {
      const result = courts.updateExecution(
        decodeURIComponent(execution[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.execution : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
