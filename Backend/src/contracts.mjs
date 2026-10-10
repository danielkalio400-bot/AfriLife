import { readFileSync } from "node:fs";

function load(relativeUrl) {
  return JSON.parse(readFileSync(new URL(relativeUrl, import.meta.url), "utf8"));
}

export const cityCatalog = load("../../Shared/contracts/city-catalog.json");
export const systemRegistry = load("../../Shared/contracts/system-registry.json");
export const platformTargets = load("../../Shared/contracts/platform-targets.json");
export const dailyLifeLoop = load("../../Shared/contracts/daily-life-loop.json");
export const jobsCatalog = load("../../Shared/contracts/jobs-catalog.json");
export const shopCatalog = load("../../Shared/contracts/shop-catalog.json");
export const billTypes = load("../../Shared/contracts/bill-types.json");
