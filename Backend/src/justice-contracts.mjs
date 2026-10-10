import { readFileSync } from "node:fs";

export const policeInvestigationFinancialCrimeRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/police-investigation-financial-crime-runtime.json", import.meta.url), "utf8")
);
