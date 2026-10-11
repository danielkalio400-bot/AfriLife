import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const src = readFileSync(
  new URL("../../GameClient/StarterAssets/Assets/_AfriLife/Editor/FirstNeighborhoodBatchBuild.cs", import.meta.url),
  "utf8"
);

test("Unity Editor C# command line resolves the System.Environment type rather than AfriLife.Environment namespace", () => {
  assert.match(src, /global::System\.Environment\.GetCommandLineArgs\(\)/);
  assert.doesNotMatch(src, /(?<!\.)\bEnvironment\.GetCommandLineArgs\(\)/);
  assert.match(src, /private static string RequiredArg\(string key\)/);
});
