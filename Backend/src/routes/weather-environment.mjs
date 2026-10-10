import { readJson, sendJson } from "../http/json.mjs";

export async function handleWeatherEnvironment(request, response, path, { weather, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/weather-environment") {
    sendJson(response, 200, contract);
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/weather/regions") {
    try {
      const result = weather.setRegionalWeather(await readJson(request));
      sendJson(response, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const region = path.match(/^\/v1\/weather\/(Nigeria|Ghana)\/([^/]+)$/);
  if (region && request.method === "GET") {
    const state = weather.getRegionalWeather(region[1], decodeURIComponent(region[2]));
    sendJson(response, state ? 200 : 404, state || { error: "weather_state_not_found" });
    return true;
  }

  if (request.method === "POST" && path === "/v1/dev/weather/events") {
    try {
      const result = weather.createEvent(await readJson(request));
      sendJson(response, result.ok ? 201 : 400, result.ok ? result.event : { error: result.error });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error?.code || "invalid_request" });
      return true;
    }
  }

  const end = path.match(/^\/v1\/dev\/weather\/events\/([^/]+)\/end$/);
  if (end && request.method === "POST") {
    const result = weather.endEvent(decodeURIComponent(end[1]));
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.event : { error: result.error });
    return true;
  }

  if (request.method === "GET" && path === "/v1/dev/weather/events") {
    const url = new URL(request.url || "/", "http://localhost");
    sendJson(response, 200, {
      events: weather.activeEvents(
        url.searchParams.get("countryId") || "",
        url.searchParams.get("regionId") || ""
      ),
    });
    return true;
  }

  return false;
}
