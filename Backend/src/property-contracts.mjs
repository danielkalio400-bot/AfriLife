import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const realEstateRuntime = load("../../Shared/contracts/real-estate-runtime.json");
export const constructionRuntime = load("../../Shared/contracts/construction-runtime.json");
