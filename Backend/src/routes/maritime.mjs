import { readJson, sendJson } from "../http/json.mjs";

export async function handleMaritime(request, response, path, { maritime, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/maritime") {
    sendJson(response, 200, contract);
    return true;
  }

  const createRoutes = new Map([
    ["/v1/dev/maritime/ports", body => maritime.registerPort(body)],
    ["/v1/dev/maritime/vessels", body => maritime.registerVessel(body)],
    ["/v1/dev/maritime/routes", body => maritime.createRoute(body)],
    ["/v1/dev/maritime/voyages", body => maritime.scheduleVoyage(body)],
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

  const voyageAction = path.match(/^\/v1\/dev\/maritime\/voyages\/([^/]+)\/(status|crew|weather|cargo|fee|trade)$/);
  if (voyageAction && request.method === "POST") {
    const voyageId = decodeURIComponent(voyageAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (voyageAction[2] === "status") result = maritime.setVoyageStatus(voyageId, body?.status);
      else if (voyageAction[2] === "crew") result = maritime.assignCrew(voyageId, body);
      else if (voyageAction[2] === "weather") result = maritime.linkWeatherToVoyage(voyageId, body?.weatherStateId);
      else if (voyageAction[2] === "cargo") result = maritime.addCargo(voyageId, body);
      else if (voyageAction[2] === "fee") result = maritime.createPortFee(voyageId, body);
      else result = maritime.recordTrade(voyageId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const vesselAction = path.match(/^\/v1\/dev\/maritime\/vessels\/([^/]+)\/(fuel|maintenance)$/);
  if (vesselAction && request.method === "POST") {
    const vesselId = decodeURIComponent(vesselAction[1]);
    try {
      const body = await readJson(request);
      const result = vesselAction[2] === "fuel"
        ? maritime.updateFuel(vesselId, body?.fuelLevel01)
        : maritime.scheduleMaintenance(vesselId, body);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const complete = path.match(/^\/v1\/dev\/maritime\/maintenance\/([^/]+)\/complete$/);
  if (complete && request.method === "POST") {
    const result = maritime.completeMaintenance(decodeURIComponent(complete[1]));
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.maintenance : { error: result.error });
    return true;
  }

  const routeWeather = path.match(/^\/v1\/dev\/maritime\/routes\/([^/]+)\/weather$/);
  if (routeWeather && request.method === "POST") {
    try {
      const result = maritime.updateWeather(
        decodeURIComponent(routeWeather[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.weather : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
