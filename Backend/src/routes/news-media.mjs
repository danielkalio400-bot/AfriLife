import { readJson, sendJson } from "../http/json.mjs";

export async function handleNewsMedia(request, response, path, { media, contract }) {
  if (request.method === "GET" && path === "/v1/runtime/news-media") {
    sendJson(response, 200, contract);
    return true;
  }

  const createRoutes = new Map([
    ["/v1/dev/media/outlets", body => media.registerOutlet(body)],
    ["/v1/dev/media/news", body => media.publish(body)],
    ["/v1/dev/media/emergency-alerts", body => media.createEmergencyAlert(body)],
    ["/v1/dev/media/broadcasts", body => media.scheduleBroadcast(body)],
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

  if (request.method === "GET" && path === "/v1/media/feed") {
    const url = new URL(request.url || "/", "http://localhost");
    sendJson(response, 200, {
      items: media.feed({
        countryId: url.searchParams.get("countryId") || "",
        topic: url.searchParams.get("topic") || "",
        limit: url.searchParams.get("limit"),
      }),
    });
    return true;
  }

  if (request.method === "GET" && path === "/v1/media/emergency-alerts") {
    const url = new URL(request.url || "/", "http://localhost");
    sendJson(response, 200, {
      alerts: media.activeAlerts(
        url.searchParams.get("countryId") || "",
        url.searchParams.get("regionId") || ""
      ),
    });
    return true;
  }

  const alert = path.match(/^\/v1\/dev\/media\/emergency-alerts\/([^/]+)\/resolve$/);
  if (alert && request.method === "POST") {
    const result = media.resolveAlert(decodeURIComponent(alert[1]));
    sendJson(response, result.ok ? 200 : 400, result.ok ? result.alert : { error: result.error });
    return true;
  }

  const news = path.match(/^\/v1\/media\/news\/([^/]+)$/);
  if (news && request.method === "GET") {
    const item = media.getNews(decodeURIComponent(news[1]));
    sendJson(response, item ? 200 : 404, item || { error: "news_item_not_found" });
    return true;
  }

  return false;
}
