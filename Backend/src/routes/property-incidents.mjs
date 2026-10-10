import { readJson, sendJson } from "../http/json.mjs";

export async function handlePropertyIncidents(
  request,
  response,
  path,
  { incidents, contract }
) {
  if (request.method === "GET" && path === "/v1/runtime/property-theft-recovery") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/property-incidents") {
    try {
      const result = incidents.report(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const incident = path.match(/^\/v1\/dev\/property-incidents\/([^/]+)$/);
  if (incident && request.method === "GET") {
    const state = incidents.getIncident(decodeURIComponent(incident[1]));
    sendJson(response, state ? 200 : 404, state || { error: "property_incident_not_found" });
    return true;
  }

  const action = path.match(/^\/v1\/dev\/property-incidents\/([^/]+)\/(cctv|witness|police-report|investigation|recovery|insurance-claim)$/);
  if (action && request.method === "POST") {
    const incidentId = decodeURIComponent(action[1]);
    try {
      const body = await readJson(request);
      let result;
      if (action[2] === "cctv") result = incidents.addCctvObservation(incidentId, body);
      else if (action[2] === "witness") result = incidents.addWitness(incidentId, body);
      else if (action[2] === "police-report") result = incidents.filePoliceReport(incidentId, body);
      else if (action[2] === "investigation") result = incidents.openInvestigation(incidentId);
      else if (action[2] === "recovery") result = incidents.recover(incidentId, body);
      else result = incidents.createInsuranceClaim(incidentId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const claim = path.match(/^\/v1\/dev\/insurance-claims\/([^/]+)\/state$/);
  if (claim && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = incidents.updateClaim(decodeURIComponent(claim[1]), body?.state);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.claim : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
