import { readFileSync } from "node:fs";

export const maritimeRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/maritime-runtime.json", import.meta.url), "utf8")
);
