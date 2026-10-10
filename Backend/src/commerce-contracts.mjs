import { readFileSync } from "node:fs";

function load(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

export const marketplaceRuntime = load("../../Shared/contracts/marketplace-runtime.json");
export const businessOwnershipRuntime = load("../../Shared/contracts/business-ownership-runtime.json");
