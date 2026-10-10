import { readFileSync } from "node:fs";
export const defenseCivilReadinessRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/defense-civil-readiness-runtime.json", import.meta.url), "utf8")
);
