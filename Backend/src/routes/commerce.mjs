import { readJson, sendJson } from "../http/json.mjs";

export async function handleCommerce(
  request,
  response,
  path,
  { marketplace, businesses, contracts }
) {
  if (request.method === "GET" && path === "/v1/runtime/marketplace") {
    sendJson(response, 200, contracts.marketplace);
    return true;
  }
  if (request.method === "GET" && path === "/v1/runtime/business-ownership") {
    sendJson(response, 200, contracts.businesses);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/marketplace/sellers") {
    try {
      const result = marketplace.registerSeller(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.seller : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/marketplace/listings") {
    try {
      const result = marketplace.createListing(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.listing : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "GET" && path === "/v1/dev/marketplace/search") {
    const url = new URL(request.url || "/", "http://localhost");
    sendJson(response, 200, { listings: marketplace.search(url.searchParams.get("q") || "") });
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/marketplace/checkout") {
    try {
      const result = marketplace.checkout(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.order : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const orderState = path.match(/^\/v1\/dev\/marketplace\/orders\/([^/]+)\/state$/);
  if (request.method === "POST" && orderState) {
    try {
      const body = await readJson(request);
      const result = marketplace.updateOrder(decodeURIComponent(orderState[1]), body?.state);
      sendJson(response, result.ok ? 200 : 400, result.ok ? result.order : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/marketplace/disputes") {
    try {
      const result = marketplace.openDispute(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.dispute : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/businesses") {
    try {
      const result = businesses.register(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.business : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const businessAction = path.match(/^\/v1\/dev\/businesses\/([^/]+)\/(employees|suppliers|period)$/);
  if (request.method === "POST" && businessAction) {
    const businessId = decodeURIComponent(businessAction[1]);
    try {
      const body = await readJson(request);
      let result;
      if (businessAction[2] === "employees") result = businesses.hire(businessId, body);
      else if (businessAction[2] === "suppliers") result = businesses.addSupplier(businessId, body);
      else result = businesses.applyPeriod(businessId, body);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
