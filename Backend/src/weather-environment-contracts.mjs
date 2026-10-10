import { readFileSync } from "node:fs";

export const weatherEnvironmentRuntime = JSON.parse(
  readFileSync(new URL("../../Shared/contracts/weather-environment-runtime.json", import.meta.url), "utf8")
);
