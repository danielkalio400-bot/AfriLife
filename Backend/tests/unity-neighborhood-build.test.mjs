import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,mkdirSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {parseOptions,buildArgs,artifactReady,main}
 from "../scripts/unity-neighborhood-build.mjs";

test("Unity batch commands target a real scene and supported mobile/desktop platforms",()=>{
 for(const [platform,suffix,target] of [
  ["android",".apk","Android"],["windows",".exe","Win64"],
  ["ios","-project","iOS"]]){
  const o=parseOptions(["--unity","/no/unity","--project","/demo/unity",
    "--platform",platform,"--output","/demo/build"+suffix]);
  const a=buildArgs(o);
  assert.equal(a[a.indexOf("-buildTarget")+1],target);
  assert.equal(a[a.indexOf("-executeMethod")+1],
    "AfriLife.Editor.FirstNeighborhoodBatchBuild.Run");
  assert.equal(a[a.indexOf("-afriOutput")+1],o.output);
  assert.ok(a.includes("-batchmode"));
 }
 assert.throws(()=>parseOptions(["--platform","android"]),/unity_project_and_output_required/);
 assert.throws(()=>parseOptions(["--unity","u","--project","p",
  "--platform","windows","--output","not.exe.apk"]),/windows_output_must_be_exe/);
});
test("artifact checks require real generated path, not just a claimed successful exit",()=>{
 const dir=mkdtempSync(join(tmpdir(),"afri47-"));
 try{
  const android=join(dir,"game.apk");
  assert.equal(artifactReady({platform:"android",output:android}),false);
  writeFileSync(android,"");
  assert.equal(artifactReady({platform:"android",output:android}),false);
  writeFileSync(android,"unit-test-fixture");
  assert.equal(artifactReady({platform:"android",output:android}),true);
  const windows=join(dir,"game.exe");
  writeFileSync(windows,"unit-test-fixture");
  assert.equal(artifactReady({platform:"windows",output:windows}),false);
  mkdirSync(join(dir,"game_Data"));
  assert.equal(artifactReady({platform:"windows",output:windows}),true);
  const ios=join(dir,"xcode");mkdirSync(ios);
  assert.equal(artifactReady({platform:"ios",output:ios}),false);
  mkdirSync(join(ios,"Unity-iPhone.xcodeproj"));
  assert.equal(artifactReady({platform:"ios",output:ios}),true);
 }finally{rmSync(dir,{force:true,recursive:true});}
});
test("missing real Unity projects fail before invoking the compiler",()=>{
 const dir=mkdtempSync(join(tmpdir(),"afri-empty-"));
 try{
  assert.throws(()=>main(["--unity",join(dir,"Unity"),"--project",dir,
    "--platform","android","--output",join(dir,"new.apk")]),
    /real_unity_project_required/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test("Unity generation runs unattended, validates authored physical sites then builds player",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=p=>readFileSync(new URL(p,root),"utf8");
 const generated=read("Editor/FirstNeighborhoodPrototypeSceneBuilder.cs");
 const batch=read("Editor/FirstNeighborhoodBatchBuild.cs");
 const inspect=read("Editor/FirstNeighborhoodSceneValidator.cs");
 assert.match(generated,/public static void BuildUnattended\(\)/);
 assert.match(generated,/if\(System.IO.File.Exists\(path\)\)return/);
 assert.match(generated,/FirstNeighborhoodWalkLayerBuilder.AddToScene\(scene\)/);
 assert.match(batch,/FirstNeighborhoodPrototypeSceneBuilder.BuildUnattended\(\)/);
 assert.match(batch,/FirstNeighborhoodSceneValidator.Inspect\(\)/);
 assert.match(batch,/BuildPipeline.BuildPlayer/);
 assert.match(batch,/EditorApplication.Exit\(1\)/);
 assert.match(batch,/BuildTarget.Android/);
 assert.match(batch,/BuildTarget.iOS/);
 assert.match(batch,/BuildTarget.StandaloneWindows64/);
 assert.match(inspect,/Expected one activity prop for/);
});
