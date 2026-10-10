import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const roadEvents = load("../../Shared/contracts/road-events.json");
export const telecomOperations = load("../../Shared/contracts/telecom-operations.json");
export const powerRestoration = load("../../Shared/contracts/power-restoration.json");
export const neighborhoodServiceOperations = load("../../Shared/contracts/neighborhood-service-operations.json");
