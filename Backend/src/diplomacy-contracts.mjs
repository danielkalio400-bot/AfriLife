import { readFileSync } from "node:fs";
export const diplomacyPeaceContract=JSON.parse(
  readFileSync(new URL("../../Shared/contracts/diplomacy-peace-runtime.json",import.meta.url),"utf8")
);
