import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const backupEnergyRuntime = load("../../Shared/contracts/backup-energy-runtime.json");
export const fuelEconomyRuntime = load("../../Shared/contracts/fuel-economy-runtime.json");
export const telecomBillingRuntime = load("../../Shared/contracts/telecom-billing-runtime.json");
export const maintenanceBusinessRuntime = load("../../Shared/contracts/maintenance-business-runtime.json");
