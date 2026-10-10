import { readJson, sendJson } from "../http/json.mjs";

// In-memory development routes only, never public production auth endpoints.
// An authoritative identity/scope boundary is required before deployment.
export async function handleFolkloreStories(req, res, path, { stories, contract }) {
  if (req.method === "GET" && path === "/v1/runtime/folklore")
    { sendJson(res, 200, contract); return true; }

  const actions = {
    "/v1/dev/folklore/preferences": body => stories.setPreference(body),
    "/v1/dev/folklore/stories": body => stories.startStory(body),
    "/v1/dev/folklore/decisions": body => stories.choose(body),
  };
  if (req.method === "POST" && Object.hasOwn(actions, path)) {
    try {
      const result = actions[path](await readJson(req));
      sendJson(res, result.ok ? 200 : 400, result.ok ? result : { error: result.error });
    } catch(error) {
      sendJson(res, 400, { error: error?.code || "invalid_request" });
    }
    return true;
  }

  if (req.method === "GET" && path === "/v1/dev/folklore/journal") {
    const url = new URL(req.url || "/", "http://localhost");
    sendJson(res, 200, { stories: stories.journal(url.searchParams.get("characterId"), {
      countryId: url.searchParams.get("countryId") || "",
      regionId: url.searchParams.get("regionId") || ""
    }) });
    return true;
  }
  if (req.method === "GET" && path === "/v1/dev/folklore/preferences") {
    const url = new URL(req.url || "/", "http://localhost");
    const pref = stories.preference(url.searchParams.get("characterId"));
    sendJson(res, pref ? 200 : 400, pref || { error: "invalid_character_id" });
    return true;
  }
  return false;
}
