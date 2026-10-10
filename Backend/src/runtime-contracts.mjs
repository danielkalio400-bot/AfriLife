import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const cityRuntimeProfiles = load("../../Shared/contracts/city-runtime-profiles.json");
export const neighborhoodRuntime = load("../../Shared/contracts/first-neighborhood-runtime.json");
export const publicTransitRuntime = load("../../Shared/contracts/public-transit-runtime.json");
