import { readFileSync } from "node:fs";

export const immigrationRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/immigration-runtime.json", import.meta.url), "utf8")
);
