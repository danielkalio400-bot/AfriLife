import { readJson, sendJson } from "../http/json.mjs";

export async function handleGovernment(request, response, path, { government, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/government") {
    sendJson(response, 200, contract);
    return true;
  }

  const createRoutes = new Map([
    ["/v1/dev/government/appointments", body => government.appoint(body)],
    ["/v1/dev/government/agencies", body => government.registerAgency(body)],
    ["/v1/dev/government/legislature/measures", body => government.createLegislativeMeasure(body)],
    ["/v1/dev/government/budgets", body => government.createBudget(body)],
    ["/v1/dev/government/treasury", body => government.setTreasury(body)],
    ["/v1/dev/government/salaries", body => government.setSalarySchedule(body)],
    ["/v1/dev/government/projects", body => government.createProject(body)],
    ["/v1/dev/government/spending", body => government.recordSpending(body)],
    ["/v1/dev/government/audits", body => government.createAudit(body)],
    ["/v1/dev/government/procurements", body => government.createProcurement(body)],
    ["/v1/dev/government/elections", body => government.createElection(body)],
    ["/v1/dev/government/approval", body => government.updateApproval(body)],
    ["/v1/dev/government/services", body => government.registerGovernmentService(body)],
  ]);

  if (request.method === "POST" && createRoutes.has(path)) {
    try {
      const result = createRoutes.get(path)(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const measure = path.match(/^\/v1\/dev\/government\/legislature\/measures\/([^/]+)\/(vote|state)$/);
  if (measure && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = measure[2] === "vote"
        ? government.voteMeasure(decodeURIComponent(measure[1]), body)
        : government.setMeasureState(decodeURIComponent(measure[1]), body?.state);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.measure : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const budget = path.match(/^\/v1\/dev\/government\/budgets\/([^/]+)\/approve$/);
  if (budget && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = government.approveBudget(
        decodeURIComponent(budget[1]),
        body?.approvedSpendingMinorUnits
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.budget : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const project = path.match(/^\/v1\/dev\/government\/projects\/([^/]+)$/);
  if (project && request.method === "POST") {
    try {
      const result = government.updateProject(
        decodeURIComponent(project[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.project : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const audit = path.match(/^\/v1\/dev\/government\/audits\/([^/]+)\/complete$/);
  if (audit && request.method === "POST") {
    try {
      const result = government.completeAudit(
        decodeURIComponent(audit[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.audit : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const procurement = path.match(/^\/v1\/dev\/government\/procurements\/([^/]+)$/);
  if (procurement && request.method === "POST") {
    try {
      const result = government.updateProcurement(
        decodeURIComponent(procurement[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.procurement : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const candidate = path.match(/^\/v1\/dev\/government\/elections\/([^/]+)\/candidates$/);
  if (candidate && request.method === "POST") {
    try {
      const result = government.registerCandidate(
        decodeURIComponent(candidate[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.candidate : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const electionResult = path.match(/^\/v1\/dev\/government\/elections\/([^/]+)\/result$/);
  if (electionResult && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = government.recordElectionResult(
        decodeURIComponent(electionResult[1]),
        body?.results
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
