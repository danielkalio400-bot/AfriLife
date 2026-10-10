import { readJson, sendJson } from "../http/json.mjs";

export async function handleLogistics(request, response, path, { logistics, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/logistics") {
    sendJson(response, 200, contract);
    return true;
  }

  const createRoutes = new Map([
    ["/v1/dev/logistics/warehouses", body => logistics.registerWarehouse(body)],
    ["/v1/dev/logistics/distribution-centers", body => logistics.registerDistributionCenter(body)],
    ["/v1/dev/logistics/trucks", body => logistics.registerTruck(body)],
    ["/v1/dev/logistics/couriers", body => logistics.registerCourier(body)],
    ["/v1/dev/logistics/suppliers", body => logistics.registerSupplier(body)],
    ["/v1/dev/logistics/movements", body => logistics.createMovement(body)],
    ["/v1/dev/logistics/shortages", body => logistics.recordShortage(body)],
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

  const movement = path.match(/^\/v1\/dev\/logistics\/movements\/([^/]+)$/);
  if (movement && request.method === "POST") {
    try {
      const result = logistics.updateMovement(
        decodeURIComponent(movement[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const tracking = path.match(/^\/v1\/dev\/logistics\/tracking\/([^/]+)$/);
  if (tracking && request.method === "GET") {
    const state = logistics.getTracking(decodeURIComponent(tracking[1]));
    sendJson(response, state ? 200 : 404, state || { error: "delivery_tracking_not_found" });
    return true;
  }

  if (request.method === "GET" && path === "/v1/dev/logistics/alternative-suppliers") {
    const url = new URL(request.url || "/", "http://localhost");
    sendJson(response, 200, {
      suppliers: logistics.alternativeSuppliers(
        url.searchParams.get("itemId") || "",
        url.searchParams.get("excludeCountryId") || ""
      ),
    });
    return true;
  }

  const customsCreate = path.match(/^\/v1\/dev\/logistics\/movements\/([^/]+)\/customs$/);
  if (customsCreate && request.method === "POST") {
    try {
      const result = logistics.createCustomsClearance(
        decodeURIComponent(customsCreate[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.clearance : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const customsDecision = path.match(/^\/v1\/dev\/logistics\/customs\/([^/]+)$/);
  if (customsDecision && request.method === "POST") {
    try {
      const result = logistics.decideCustomsClearance(
        decodeURIComponent(customsDecision[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.clearance : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const fuel = path.match(/^\/v1\/dev\/logistics\/fuel-dependency\/([^/]+)$/);
  if (fuel && request.method === "POST") {
    try {
      const result = logistics.updateFuelDependency(
        decodeURIComponent(fuel[1]),
        await readJson(request)
      );
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.fuelDependency : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
