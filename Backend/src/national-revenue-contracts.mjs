import { readFileSync } from "node:fs";

export const nationalRevenueDividendRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/national-revenue-dividend-runtime.json", import.meta.url), "utf8")
);
