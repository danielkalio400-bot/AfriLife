import { readJson, sendJson } from "../http/json.mjs";

export async function handleJusticeInvestigations(
  request,
  response,
  path,
  { justice, contract }
) {
  if (request.method === "GET" && path === "/v1/runtime/police-investigation-financial-crime") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/investigations") {
    try {
      const result = justice.createCase(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.case : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const caseAction = path.match(/^\/v1\/dev\/investigations\/([^/]+)\/(statement|evidence|freeze-order|operation|cooperation|arrest)$/);
  if (caseAction && request.method === "POST") {
    const caseId = decodeURIComponent(caseAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (caseAction[2] === "statement") result = justice.addStatement(caseId, body);
      else if (caseAction[2] === "evidence") result = justice.addEvidence(caseId, body);
      else if (caseAction[2] === "freeze-order") result = justice.createFreezeOrder(caseId, body);
      else if (caseAction[2] === "operation") result = justice.createAuthorizedOperation(caseId, body);
      else if (caseAction[2] === "cooperation") result = justice.requestAgencyCooperation(caseId, body);
      else result = justice.recordArrest(caseId, body);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const evidenceTransfer = path.match(/^\/v1\/dev\/evidence\/([^/]+)\/transfer$/);
  if (evidenceTransfer && request.method === "POST") {
    try {
      const result = justice.transferEvidence(
        decodeURIComponent(evidenceTransfer[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/financial-crime/suspicious-transactions") {
    try {
      const result = justice.flagSuspiciousTransaction(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.record : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/police/patrols") {
    try {
      const result = justice.registerPatrol(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.patrol : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/police/traffic-enforcement") {
    try {
      const result = justice.recordTrafficEnforcement(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.record : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
