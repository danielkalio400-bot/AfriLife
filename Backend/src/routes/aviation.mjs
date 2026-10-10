import { readJson, sendJson } from "../http/json.mjs";

export async function handleAviation(request, response, path, { aviation, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/aviation") {
    sendJson(response, 200, contract);
    return true;
  }

  const creationRoutes = new Map([
    ["/v1/dev/aviation/airports", body => aviation.registerAirport(body)],
    ["/v1/dev/aviation/aircraft", body => aviation.registerAircraft(body)],
    ["/v1/dev/aviation/flights", body => aviation.scheduleFlight(body)],
    ["/v1/dev/aviation/check-in", body => aviation.checkIn(body)],
    ["/v1/dev/aviation/hangars", body => aviation.registerHangar(body)],
  ]);

  if (request.method === "POST" && creationRoutes.has(path)) {
    try {
      const result = creationRoutes.get(path)(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const checkInAction = path.match(/^\/v1\/dev\/aviation\/check-in\/([^/]+)\/(baggage|security|immigration|board)$/);
  if (checkInAction && request.method === "POST") {
    const checkInId = decodeURIComponent(checkInAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (checkInAction[2] === "baggage") result = aviation.addBaggage(checkInId, body);
      else if (checkInAction[2] === "security") result = aviation.recordSecurityScreening(checkInId, body);
      else if (checkInAction[2] === "immigration") result = aviation.recordImmigrationCheckpoint(checkInId, body?.completed);
      else result = aviation.board(checkInId, body?.gateId);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const flightAction = path.match(/^\/v1\/dev\/aviation\/flights\/([^/]+)\/(status|crew|cargo|disruption)$/);
  if (flightAction && request.method === "POST") {
    const flightId = decodeURIComponent(flightAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (flightAction[2] === "status") result = aviation.setFlightStatus(flightId, body?.status);
      else if (flightAction[2] === "crew") result = aviation.assignCrew(flightId, body);
      else if (flightAction[2] === "cargo") result = aviation.addCargo(flightId, body);
      else result = aviation.disruptFlight(flightId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const maintenance = path.match(/^\/v1\/dev\/aviation\/aircraft\/([^/]+)\/maintenance$/);
  if (maintenance && request.method === "POST") {
    try {
      const result = aviation.scheduleMaintenance(
        decodeURIComponent(maintenance[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.maintenance : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const complete = path.match(/^\/v1\/dev\/aviation\/maintenance\/([^/]+)\/complete$/);
  if (complete && request.method === "POST") {
    const result = aviation.completeMaintenance(decodeURIComponent(complete[1]));
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.maintenance : { error: result.error });
    return true;
  }

  return false;
}
