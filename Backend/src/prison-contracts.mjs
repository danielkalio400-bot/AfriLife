import { readFileSync } from "node:fs";

export const prisonRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/prison-runtime.json", import.meta.url), "utf8")
);
