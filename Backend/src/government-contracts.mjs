import { readFileSync } from "node:fs";

export const governmentRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/government-runtime.json", import.meta.url), "utf8")
);
