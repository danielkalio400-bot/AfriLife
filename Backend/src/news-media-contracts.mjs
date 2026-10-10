import { readFileSync } from "node:fs";

export const newsMediaRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/news-media-runtime.json", import.meta.url), "utf8")
);
