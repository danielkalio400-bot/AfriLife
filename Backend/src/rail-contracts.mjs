import { readFileSync } from "node:fs";

export const railRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/rail-runtime.json", import.meta.url), "utf8")
);
