import { readFileSync } from "node:fs";

export const propertyTheftRecoveryRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/property-theft-recovery-runtime.json", import.meta.url), "utf8")
);
