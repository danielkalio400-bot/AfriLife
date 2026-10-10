import { readFileSync } from "node:fs";

export const environmentalResponseRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/environmental-response-runtime.json", import.meta.url), "utf8")
);
