import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const CHANNELS = new Set(["radio", "tv", "newspaper", "social-feed"]);
const TOPICS = new Set([
  "emergency-alert",
  "breaking-news",
  "government-announcement",
  "election-coverage",
  "fuel-shortage",
  "blackout",
  "accident",
  "crime",
  "conflict",
  "peace-talks",
  "currency",
]);

function clean(value, max = 180) {
  const result = String(value || "").trim();
  return result && result.length <= max ? result : "";
}

export class NewsMediaService {
  #outlets = new Map();
  #news = new Map();
  #alerts = new Map();
  #broadcasts = new Map();

  registerOutlet(input) {
    const countryId = clean(input?.countryId, 32);
    const channelType = clean(input?.channelType, 32);
    const displayName = clean(input?.displayName, 100);
    if (!COUNTRIES.has(countryId) || !CHANNELS.has(channelType) || !displayName)
      return { ok: false, error: "invalid_media_outlet" };

    const outlet = {
      outletId: String(input?.outletId || randomUUID()),
      countryId,
      displayName,
      channelType,
      fictional: true,
      active: input?.active !== false,
    };
    this.#outlets.set(outlet.outletId, outlet);
    return { ok: true, outlet: { ...outlet } };
  }

  publish(input) {
    const outletId = clean(input?.outletId, 120);
    const outlet = this.#outlets.get(outletId);
    const topic = clean(input?.topic, 64);
    const headlineTag = clean(input?.headlineTag, 140);
    const summaryTag = clean(input?.summaryTag, 320);
    if (!outlet || !outlet.active || !TOPICS.has(topic) || !headlineTag)
      return { ok: false, error: "invalid_news_item" };

    const news = {
      newsId: randomUUID(),
      outletId,
      countryId: outlet.countryId,
      topic,
      headlineTag,
      summaryTag,
      regionId: clean(input?.regionId, 80),
      sourceSystemTag: clean(input?.sourceSystemTag, 80),
      urgency: Math.max(0, Math.min(3, Math.trunc(Number(input?.urgency) || 0))),
      publishedAt: new Date().toISOString(),
    };
    this.#news.set(news.newsId, news);
    return { ok: true, news: { ...news } };
  }

  createEmergencyAlert(input) {
    const countryId = clean(input?.countryId, 32);
    const regionId = clean(input?.regionId, 80);
    const alertType = clean(input?.alertType, 80);
    const messageTag = clean(input?.messageTag, 240);
    const starts = input?.startsAt ? Date.parse(String(input.startsAt)) : Date.now();
    const ends = input?.endsAt ? Date.parse(String(input.endsAt)) : NaN;

    if (!COUNTRIES.has(countryId) || !regionId || !alertType || !messageTag ||
        !Number.isFinite(starts) || (Number.isFinite(ends) && ends <= starts))
      return { ok: false, error: "invalid_emergency_alert" };

    const alert = {
      alertId: randomUUID(),
      countryId,
      regionId,
      alertType,
      messageTag,
      severity: Math.max(1, Math.min(4, Math.trunc(Number(input?.severity) || 1))),
      active: true,
      startsAt: new Date(starts).toISOString(),
      endsAt: Number.isFinite(ends) ? new Date(ends).toISOString() : null,
      createdAt: new Date().toISOString(),
    };
    this.#alerts.set(alert.alertId, alert);
    return { ok: true, alert: { ...alert } };
  }

  resolveAlert(alertId) {
    const alert = this.#alerts.get(String(alertId || ""));
    if (!alert) return { ok: false, error: "emergency_alert_not_found" };
    alert.active = false;
    alert.resolvedAt = new Date().toISOString();
    return { ok: true, alert: { ...alert } };
  }

  scheduleBroadcast(input) {
    const outletId = clean(input?.outletId, 120);
    const newsId = clean(input?.newsId, 120);
    const outlet = this.#outlets.get(outletId);
    const news = this.#news.get(newsId);
    const starts = Date.parse(String(input?.startsAt || ""));
    if (!outlet || !news || news.outletId !== outletId || !Number.isFinite(starts))
      return { ok: false, error: "invalid_broadcast_schedule" };

    const schedule = {
      scheduleId: randomUUID(),
      outletId,
      newsId,
      startsAt: new Date(starts).toISOString(),
      durationMinutes: Math.min(240, Math.max(1, Math.trunc(Number(input?.durationMinutes) || 5))),
      status: "scheduled",
    };
    this.#broadcasts.set(schedule.scheduleId, schedule);
    return { ok: true, schedule: { ...schedule } };
  }

  feed(input = {}) {
    const countryId = clean(input?.countryId, 32);
    const topic = clean(input?.topic, 64);
    const limit = Math.min(100, Math.max(1, Math.trunc(Number(input?.limit) || 25)));

    return [...this.#news.values()]
      .filter(item => !countryId || item.countryId === countryId)
      .filter(item => !topic || item.topic === topic)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.urgency - a.urgency)
      .slice(0, limit)
      .map(item => ({ ...item }));
  }

  activeAlerts(countryId = "", regionId = "") {
    const now = Date.now();
    return [...this.#alerts.values()]
      .filter(alert => alert.active)
      .filter(alert => !countryId || alert.countryId === countryId)
      .filter(alert => !regionId || alert.regionId === regionId)
      .filter(alert => Date.parse(alert.startsAt) <= now)
      .filter(alert => !alert.endsAt || Date.parse(alert.endsAt) > now)
      .sort((a, b) => b.severity - a.severity || b.createdAt.localeCompare(a.createdAt))
      .map(alert => ({ ...alert }));
  }

  getNews(newsId) {
    const item = this.#news.get(String(newsId || ""));
    return item ? { ...item } : null;
  }
}
