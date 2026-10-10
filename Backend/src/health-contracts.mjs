import { readFileSync } from "node:fs";

export const healthcareRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/healthcare-runtime.json", import.meta.url), "utf8")
);
