import { readJson, sendJson } from "../http/json.mjs";

export async function handleHealthcare(
  request,
  response,
  path,
  { healthcare, contract }
) {
  if (request.method === "GET" && path === "/v1/runtime/healthcare") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/healthcare/facilities") {
    try {
      const result = healthcare.registerFacility(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.facility : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const facility = path.match(/^\/v1\/dev\/healthcare\/facilities\/([^/]+)(?:\/operations)?$/);
  if (facility && request.method === "GET") {
    const state = healthcare.getFacility(decodeURIComponent(facility[1]));
    sendJson(response, state ? 200 : 404, state || { error: "healthcare_facility_not_found" });
    return true;
  }
  if (facility && request.method === "POST") {
    try {
      const result = healthcare.updateOperations(
        decodeURIComponent(facility[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 404, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/healthcare/visits") {
    try {
      const result = healthcare.createVisit(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.visit : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const visit = path.match(/^\/v1\/dev\/healthcare\/visits\/([^/]+)\/status$/);
  if (visit && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = healthcare.updateVisit(decodeURIComponent(visit[1]), body?.status);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.visit : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/healthcare/ambulances") {
    try {
      const result = healthcare.registerAmbulance(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.ambulance : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const dispatch = path.match(/^\/v1\/dev\/healthcare\/ambulances\/([^/]+)\/dispatch$/);
  if (dispatch && request.method === "POST") {
    try {
      const body = await readJson(request);
      const result = healthcare.dispatchAmbulance(decodeURIComponent(dispatch[1]), body?.visitId);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.ambulance : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/healthcare/supply-shipments") {
    try {
      const result = healthcare.createSupplyShipment(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.shipment : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
