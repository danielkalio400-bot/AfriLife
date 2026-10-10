import { readFileSync } from "node:fs";

export const centralBankEconomyRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/central-bank-economy-runtime.json", import.meta.url), "utf8")
);
