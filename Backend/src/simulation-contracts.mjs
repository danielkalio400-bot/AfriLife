import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const trafficAgents = load("../../Shared/contracts/traffic-agent-runtime.json");
export const utilityBilling = load("../../Shared/contracts/utility-billing-runtime.json");
export const transitPassengers = load("../../Shared/contracts/transit-passenger-runtime.json");
export const businessRuntime = load("../../Shared/contracts/business-runtime.json");
