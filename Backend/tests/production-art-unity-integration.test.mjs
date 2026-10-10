import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const root = new URL("../../GameClient/StarterAssets/Assets/_AfriLife/", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");

test("AfriLife production art integration is prefab-based and preserves game actors", () => {
  const profile = read("Presentation/AfriLifeProductionArtProfile.cs");
  const editor = read("Editor/AfriLifeProductionArtInstaller.cs");
  assert.match(profile, /CreateAssetMenu/);
  for (const name of ["PlayerPrefab", "AdaPrefab", "BolaPrefab", "KwamePrefab", "NeighborhoodPrefab"])
    assert.match(profile, new RegExp(name));
  assert.match(editor, /PrefabUtility\.IsPartOfPrefabAsset/);
  assert.match(editor, /avatar\.isHuman/);
  assert.match(editor, /GetComponentsInChildren<Collider>\(true\)/);
  assert.match(editor, /PrefabUtility\.InstantiatePrefab/);
  assert.match(editor, /Undo\.RegisterCreatedObjectUndo/);
  assert.match(editor, /EditorSceneManager\.MarkSceneDirty/);
  assert.doesNotMatch(editor, /SaveScene\(/);
  assert.match(editor, /GetComponent<FirstNeighborhoodWalkController>/);
  assert.match(editor, /GetComponent<FirstNeighborhoodResidentAgent>/);
  assert.match(editor, /renderer\.enabled = false/);
  assert.match(editor, /HideLegacyObject/);
});

test("realistic avatars are driven by authored Animator parameters, not fabricated animations", () => {
  const motion = read("Presentation/AfriLifeCharacterMotionBridge.cs");
  assert.match(motion, /GetComponentsInChildren<Animator>\(true\)/);
  assert.match(motion, /animator\.runtimeAnimatorController/);
  assert.match(motion, /AnimatorControllerParameterType\.Float/);
  assert.match(motion, /AnimatorControllerParameterType\.Bool/);
  assert.match(motion, /animator\.SetFloat/);
  assert.match(motion, /animator\.SetBool/);
});
