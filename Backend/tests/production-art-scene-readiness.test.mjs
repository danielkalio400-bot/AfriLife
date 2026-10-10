import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const editor = readFileSync(new URL("../../GameClient/StarterAssets/Assets/_AfriLife/Editor/AfriLifeProductionArtInstaller.cs", import.meta.url), "utf8");

test("AfriLife audits prefab identity, rig controllers and physical world", () => {
  assert.match(editor, /PrefabUtility\.GetCorrespondingObjectFromSource/);
  assert.match(editor, /source != expected/);
  assert.match(editor, /private static void VerifyInstalled/);
  assert.match(editor, /renderer\.enabled/);
  assert.match(editor, /collider\.enabled/);
  assert.match(editor, /!collider\.isTrigger/);
  assert.match(editor, /animator\.avatar\.isHuman/);
  assert.match(editor, /animator\.runtimeAnimatorController != null/);
  for (const name of ["AdaPrefab", "BolaPrefab", "KwamePrefab", "PlayerPrefab", "NeighborhoodPrefab"])
    assert.match(editor, new RegExp(name));
  assert.doesNotMatch(editor, /SaveScene\(/);
});

test("AfriLife hides only legacy mesh and collider, retaining authored descendants", () => {
  const hide = editor.slice(editor.indexOf("private static void HideLegacyObject"));
  assert.match(hide, /obj\.GetComponent<Renderer>\(\)/);
  assert.match(hide, /obj\.GetComponent<Collider>\(\)/);
  assert.match(hide, /renderer\.enabled = false/);
  assert.match(hide, /collider\.enabled = false/);
  assert.doesNotMatch(hide, /obj\.SetActive\(false\)/);
});
