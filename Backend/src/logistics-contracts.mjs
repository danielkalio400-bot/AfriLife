import { readFileSync } from "node:fs";

export const logisticsRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/logistics-runtime.json", import.meta.url), "utf8")
);
