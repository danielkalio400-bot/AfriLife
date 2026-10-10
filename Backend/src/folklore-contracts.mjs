import { readFileSync } from "node:fs";
export const folkloreRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/folklore-stories-runtime.json", import.meta.url), "utf8")
);
