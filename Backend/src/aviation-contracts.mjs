import { readFileSync } from "node:fs";

export const aviationRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/aviation-runtime.json", import.meta.url), "utf8")
);
