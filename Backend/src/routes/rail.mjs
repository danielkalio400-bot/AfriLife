import { readJson, sendJson } from "../http/json.mjs";

export async function handleRail(request, response, path, { rail, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/rail") {
    sendJson(response, 200, contract);
    return true;
  }

  const createRoutes = new Map([
    ["/v1/dev/rail/stations", body => rail.registerStation(body)],
    ["/v1/dev/rail/depots", body => rail.registerDepot(body)],
    ["/v1/dev/rail/trains", body => rail.registerTrain(body)],
    ["/v1/dev/rail/routes", body => rail.createRoute(body)],
    ["/v1/dev/rail/schedules", body => rail.scheduleService(body)],
    ["/v1/dev/rail/crossings", body => rail.registerCrossing(body)],
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

  const scheduleAction = path.match(/^\/v1\/dev\/rail\/schedules\/([^/]+)\/(status|ticket|crew|delay)$/);
  if (scheduleAction && request.method === "POST") {
    const scheduleId = decodeURIComponent(scheduleAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (scheduleAction[2] === "status") result = rail.setScheduleStatus(scheduleId, body?.status);
      else if (scheduleAction[2] === "ticket") result = rail.issueTicket(scheduleId, body);
      else if (scheduleAction[2] === "crew") result = rail.assignCrew(scheduleId, body);
      else result = rail.delay(scheduleId, body);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const ticketUse = path.match(/^\/v1\/dev\/rail\/tickets\/([^/]+)\/use$/);
  if (ticketUse && request.method === "POST") {
    const result = rail.useTicket(decodeURIComponent(ticketUse[1]));
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.ticket : { error: result.error });
    return true;
  }

  const repair = path.match(/^\/v1\/dev\/rail\/trains\/([^/]+)\/repair$/);
  if (repair && request.method === "POST") {
    try {
      const result = rail.scheduleRepair(
        decodeURIComponent(repair[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.repair : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const complete = path.match(/^\/v1\/dev\/rail\/repairs\/([^/]+)\/complete$/);
  if (complete && request.method === "POST") {
    const result = rail.completeRepair(decodeURIComponent(complete[1]));
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.repair : { error: result.error });
    return true;
  }

  const crossing = path.match(/^\/v1\/dev\/rail\/crossings\/([^/]+)$/);
  if (crossing && request.method === "POST") {
    try {
      const result = rail.setCrossingState(
        decodeURIComponent(crossing[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.crossing : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
