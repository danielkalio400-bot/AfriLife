import { randomUUID } from "node:crypto";

// Entirely fictional entertainment content. Real faiths, ethnic communities,
// deities and traditional practitioners are never assigned villain roles.
const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const MODES = new Set(["off", "ambiguous", "supernatural"]);
const THEMES = new Set([
  "lamplit-hall", "harbor-lights", "quiet-courtyard",
  "night-market-echo", "old-library", "distant-footsteps"
]);
const CHOICES = new Set(["observe", "ask-neighbor", "investigate", "reassure", "leave"]);
const clean = (value, max = 90) => typeof value === "string" && value.trim() === value &&
  value.length > 0 && value.length <= max && !Array.from(value).some(ch => ch.charCodeAt(0) < 32);
const clone = value => value == null ? null : structuredClone(value);
const clamp = value => Math.max(0, Math.min(1, value));

export class FolkloreStoriesService {
  #preferences = new Map();
  #stories = new Map();
  #active = new Map();
  #startRequests = new Map();
  #choices = new Map();
  #clock;

  constructor({ clock = () => new Date().toISOString() } = {}) {
    this.#clock = clock;
  }

  preference(characterId) {
    if (!clean(characterId, 120)) return null;
    return clone(this.#preferences.get(characterId) || {
      characterId, mode: "off", contentWarningsEnabled: true, updatedAt: null
    });
  }

  setPreference(input) {
    if (!clean(input?.characterId, 120) || !MODES.has(input?.mode) ||
        (input?.contentWarningsEnabled !== undefined &&
        typeof input.contentWarningsEnabled !== "boolean"))
      return { ok: false, error: "invalid_folklore_preference" };
    const before = this.preference(input.characterId);
    const profile = {
      characterId: input.characterId,
      mode: input.mode,
      contentWarningsEnabled: input.contentWarningsEnabled === undefined
        ? before.contentWarningsEnabled : input.contentWarningsEnabled,
      updatedAt: this.#clock()
    };
    this.#preferences.set(input.characterId, profile);
    // Turning the optional feature off resolves active content without
    // continuing to show supernatural events or generating any notifications.
    if (input.mode === "off") {
      for (const story of this.#stories.values()) {
        if (story.characterId !== input.characterId || story.status !== "active") continue;
        story.status = "paused-opt-out";
        story.updatedAt = this.#clock();
        this.#active.delete(story.characterId + "|" + story.propertyId);
      }
    }
    return { ok: true, preference: clone(profile) };
  }

  startStory(input) {
    const { characterId, countryId, regionId, propertyId, theme, requestId } = input || {};
    if (!clean(characterId, 120) || !COUNTRIES.has(countryId) ||
        !clean(regionId) || !clean(propertyId, 120) ||
        !THEMES.has(theme) || !clean(requestId, 120))
      return { ok: false, error: "invalid_folklore_story" };
    if (this.preference(characterId).mode === "off")
      return { ok: false, error: "folklore_opt_in_required" };
    const requestKey = characterId + "|" + requestId;
    const former = this.#startRequests.get(requestKey);
    if (former) {
      if (former.countryId !== countryId || former.regionId !== regionId ||
          former.propertyId !== propertyId || former.theme !== theme)
        return { ok: false, error: "request_id_conflict" };
      const story = this.#stories.get(former.storyId);
      return { ok: true, story: clone(story), replay: true };
    }
    const activeKey = characterId + "|" + propertyId;
    const already = this.#stories.get(this.#active.get(activeKey));
    if (already && already.status === "active")
      return { ok: false, error: "property_story_already_active" };

    const mode = this.preference(characterId).mode;
    const now = this.#clock();
    const story = {
      storyId: randomUUID(), characterId, countryId, regionId, propertyId, theme,
      mode, status: "active", stage: "strange-signs", isFictional: true,
      eventTag: "fictional-folklore-" + theme, outcomeTag: null,
      propertyReputation01: 0.5, householdUncertainty01: 0.1,
      choices: [], createdAt: now, updatedAt: now
    };
    this.#stories.set(story.storyId, story);
    this.#startRequests.set(requestKey, { storyId: story.storyId, countryId, regionId, propertyId, theme });
    this.#active.set(activeKey, story.storyId);
    return { ok: true, story: clone(story), replay: false };
  }

  choose(input) {
    const { characterId, storyId, choice, decisionId } = input || {};
    if (!clean(characterId, 120) || !clean(storyId, 120) ||
        !clean(decisionId, 120) || !CHOICES.has(choice))
      return { ok: false, error: "invalid_folklore_choice" };
    const story = this.#stories.get(storyId);
    // Owner-only reads and writes, even in the developer-only HTTP prototype.
    if (!story || story.characterId !== characterId)
      return { ok: false, error: "story_not_found" };
    if (this.preference(characterId).mode === "off")
      return { ok: false, error: "folklore_opt_in_required" };
    const requestKey = storyId + "|" + decisionId;
    const old = this.#choices.get(requestKey);
    if (old) {
      if (old.choice !== choice) return { ok: false, error: "decision_id_conflict" };
      return { ok: true, story: clone(story), replay: true };
    }
    if (story.status !== "active") return { ok: false, error: "story_not_active" };
    const now = this.#clock();
    story.choices.push({ decisionId, choice, at: now });
    story.updatedAt = now;
    this.#choices.set(requestKey, { choice });
    // Calm observation, social reassurance and leaving are valid solutions.
    story.householdUncertainty01 = clamp(story.householdUncertainty01 +
      (choice === "reassure" ? -0.12 : choice === "leave" ? -0.1 : 0.08));
    story.propertyReputation01 = clamp(story.propertyReputation01 +
      (choice === "ask-neighbor" ? -0.04 : choice === "reassure" ? 0.05 : 0));
    if (story.choices.length >= 2 || choice === "leave") {
      story.stage = "resolved";
      story.status = "resolved";
      story.outcomeTag = choice === "leave" ? "resident-chose-to-leave" :
        story.mode === "ambiguous" ? "unexplained-but-peaceful" :
        "fictional-presence-settled";
      this.#active.delete(story.characterId + "|" + story.propertyId);
    } else story.stage = "investigating";
    return { ok: true, story: clone(story), replay: false };
  }

  getStory(characterId, storyId) {
    if (!clean(characterId, 120) || this.preference(characterId).mode === "off") return null;
    const story = this.#stories.get(storyId);
    return story?.characterId === characterId ? clone(story) : null;
  }

  journal(characterId, { countryId = "", regionId = "" } = {}) {
    if (!clean(characterId, 120) || this.preference(characterId).mode === "off") return [];
    return [...this.#stories.values()].filter(story =>
      story.characterId === characterId &&
      (!countryId || story.countryId === countryId) &&
      (!regionId || story.regionId === regionId)
    ).sort((a,b) => b.createdAt.localeCompare(a.createdAt) ||
      a.storyId.localeCompare(b.storyId)).map(clone);
  }
}
