import { readJson, sendJson } from "../http/json.mjs";

export async function handleImmigration(request, response, path, { immigration, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/immigration") {
    sendJson(response, 200, contract);
    return true;
  }

  const simpleRoutes = new Map([
    ["/v1/dev/immigration/offices", body => immigration.registerOffice(body)],
    ["/v1/dev/immigration/missions", body => immigration.registerMission(body)],
    ["/v1/dev/immigration/citizenship", body => immigration.setCitizenship(body)],
    ["/v1/dev/immigration/passports", body => immigration.createPassportApplication(body)],
    ["/v1/dev/immigration/visa-applications", body => immigration.createVisaApplication(body)],
    ["/v1/dev/immigration/border-officers", body => immigration.assignBorderOfficer(body)],
    ["/v1/dev/immigration/entry-exit", body => immigration.recordEntryExit(body)],
  ]);

  if (request.method === "POST" && simpleRoutes.has(path)) {
    try {
      const result = simpleRoutes.get(path)(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const passportIssue = path.match(/^\/v1\/dev\/immigration\/passports\/([^/]+)\/issue$/);
  if (passportIssue && request.method === "POST") {
    try {
      const result = immigration.issuePassport(
        decodeURIComponent(passportIssue[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.passport : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const visaAction = path.match(/^\/v1\/dev\/immigration\/visa-applications\/([^/]+)\/(document|submit|biometrics|interview|decision|permit)$/);
  if (visaAction && request.method === "POST") {
    const applicationId = decodeURIComponent(visaAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (visaAction[2] === "document") result = immigration.attachDocument(applicationId, body);
      else if (visaAction[2] === "submit") result = immigration.submit(applicationId);
      else if (visaAction[2] === "biometrics") result = immigration.scheduleBiometrics(applicationId, body);
      else if (visaAction[2] === "interview") result = immigration.scheduleInterview(applicationId, body);
      else if (visaAction[2] === "decision") result = immigration.decide(applicationId, body?.decision);
      else result = immigration.issuePermit(applicationId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
