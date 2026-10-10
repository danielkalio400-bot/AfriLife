import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const nigeriaReference = load("../../Shared/contracts/world-reference/nigeria.json");
export const ghanaReference = load("../../Shared/contracts/world-reference/ghana.json");
export const crossBorderReference = load("../../Shared/contracts/world-reference/cross-border.json");
export const researchSources = load("../../Shared/contracts/world-reference/research-sources.json");
