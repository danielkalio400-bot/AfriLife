import { readFileSync } from "node:fs";

export const courtJusticeRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/court-justice-runtime.json", import.meta.url), "utf8")
);
