import { readJson, sendJson } from "../http/json.mjs";

export async function handleProperty(
  request,
  response,
  path,
  { realEstate, construction, contracts }
) {
  if (request.method === "GET" && path === "/v1/runtime/real-estate") {
    sendJson(response, 200, contracts.realEstate);
    return true;
  }
  if (request.method === "GET" && path === "/v1/runtime/construction") {
    sendJson(response, 200, contracts.construction);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/properties") {
    try {
      const result = realEstate.registerProperty(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.property : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const property = path.match(/^\/v1\/dev\/properties\/([^/]+)(?:\/(rental|mortgage|valuation))?$/);
  if (property) {
    const propertyId = decodeURIComponent(property[1]);

    if (request.method === "GET" && !property[2]) {
      const state = realEstate.get(propertyId);
      sendJson(response, state ? 200 : 404, state || { error: "property_not_found" });
      return true;
    }

    if (request.method === "POST") {
      try {
        const body = await readJson(request);
        let result;
        if (property[2] === "rental") result = realEstate.createRental({ ...body, propertyId });
        else if (property[2] === "mortgage") result = realEstate.createMortgage({ ...body, propertyId });
        else if (property[2] === "valuation") result = realEstate.value(propertyId, body);
        else return false;

        sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
        return true;
      } catch (error) {
        sendJson(response, 400, { error: error?.code || "invalid_request" });
        return true;
      }
    }
  }

  if (request.method === "POST" && path === "/v1/dev/construction-projects") {
    try {
      const result = construction.createProject(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.project : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const project = path.match(/^\/v1\/dev\/construction-projects\/([^/]+)\/(worker|material|advance)$/);
  if (request.method === "POST" && project) {
    try {
      const projectId = decodeURIComponent(project[1]);
      const body = await readJson(request);
      let result;
      if (project[2] === "worker") result = construction.assignWorker(projectId, body);
      else if (project[2] === "material") result = construction.addMaterial(projectId, body);
      else result = construction.advance(projectId, body?.gameHours);

      sendJson(response, result.ok ? 200 : 400, result.ok ? result.project : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  if (request.method === "POST" && path === "/v1/dev/house-design/proposals") {
    try {
      const result = construction.proposeHouseDesign(await readJson(request));
      sendJson(response, 201, result.proposal);
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  return false;
}
