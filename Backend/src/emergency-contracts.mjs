import { readFileSync } from "node:fs";

export const emergencyServicesRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/emergency-services-runtime.json", import.meta.url), "utf8")
);
