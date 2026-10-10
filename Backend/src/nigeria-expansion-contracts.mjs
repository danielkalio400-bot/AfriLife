import { readFileSync } from "node:fs";
const load = path => JSON.parse(readFileSync(new URL(path, import.meta.url),"utf8"));
export const nigeriaExpansionContract = load("../../Shared/contracts/nigeria-expansion-planning.json");
export const nigeriaCityCatalog = load("../../Shared/contracts/city-catalog.json");
export const nigeriaFirstNeighborhood = load("../../Shared/contracts/first-neighborhood-runtime.json");
export const nigeriaDailyLife = load("../../Shared/contracts/daily-life-loop.json");
export const nigeriaWorldReference = load("../../Shared/contracts/world-reference/nigeria.json");
