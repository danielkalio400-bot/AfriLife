#!/usr/bin/env node
import {existsSync,statSync} from "node:fs";
import {inspectUnityArtifact} from "../src/services/unity-artifact-integrity.mjs";
import {resolve,join} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

export function parseOptions(args){
 const entries=new Map();
 for(let i=0;i<args.length;i++){
  const key=args[i];
  if(!["--unity","--project","--platform","--output","--dry-run"].includes(key))
    throw new Error("unknown_argument:"+key);
  if(entries.has(key))throw new Error("duplicate_argument:"+key);
  if(key==="--dry-run"){entries.set(key,true);continue;}
  if(!args[i+1]||args[i+1].startsWith("--"))
    throw new Error("missing_value:"+key);
  entries.set(key,args[++i]);
 }
 const platform=(entries.get("--platform")||"").toLowerCase();
 if(!["android","windows","ios"].includes(platform))
   throw new Error("platform_required_android_windows_ios");
 if(!entries.get("--unity")||!entries.get("--project")||!entries.get("--output"))
   throw new Error("unity_project_and_output_required");
 const output=resolve(entries.get("--output"));
 if(platform==="android"&&!output.toLowerCase().endsWith(".apk"))
   throw new Error("android_output_must_be_apk");
 if(platform==="windows"&&!output.toLowerCase().endsWith(".exe"))
   throw new Error("windows_output_must_be_exe");
 return {platform,output,unity:resolve(entries.get("--unity")),
   project:resolve(entries.get("--project")),dryRun:!!entries.get("--dry-run")};
}
export function buildArgs({platform,output,project}){
 return ["-batchmode","-nographics","-quit","-projectPath",project,
   "-buildTarget",{android:"Android",windows:"Win64",ios:"iOS"}[platform],
   "-executeMethod","AfriLife.Editor.FirstNeighborhoodBatchBuild.Run",
   "-afriPlatform",platform,"-afriOutput",output];
}
export function artifactReady(request){
 return inspectUnityArtifact(request).ok;
}

export function main(argv){
 const o=parseOptions(argv);
 if(!existsSync(join(o.project,"Assets"))||
    !existsSync(join(o.project,"ProjectSettings","ProjectVersion.txt")))
   throw new Error("real_unity_project_required");
 if(!existsSync(join(o.project,"Packages","manifest.json")))
   throw new Error("unity_packages_manifest_missing");
 for(const file of ["Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs","Editor/FirstNeighborhoodBatchBuild.cs"])
   if(!existsSync(join(o.project,"Assets","_AfriLife",...file.split("/"))))
     throw new Error("afrilife_unity_source_not_imported:"+file);
 if(existsSync(o.output))
   throw new Error("output_already_exists_use_new_output_path");
 if(o.platform==="ios"&&process.platform!=="darwin")
   throw new Error("ios_export_requires_macos");
 if(!existsSync(o.unity)||!statSync(o.unity).isFile())
   throw new Error("unity_editor_executable_not_found");
 const args=buildArgs(o);
 if(o.dryRun){
   console.log(JSON.stringify({mode:"dry-run",binary:o.unity,args,artifactVerified:false},null,2));
   return;
 }
  const result=spawnSync(o.unity,args,{stdio:"inherit",timeout:3600000});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error("unity_demo_build_failed_exit_"+result.status);
 const inspected=inspectUnityArtifact(o);
 if(!inspected.ok)
   throw new Error("unity_exited_without_verified_demo_artifact:"+inspected.error);
 console.log(JSON.stringify({platform:o.platform,output:o.output,
   artifactVerified:true,compiledWithUnity:true,
   verifiedStructure:inspected.kind,sizeBytes:inspected.sizeBytes??null,
   sha256:inspected.sha256??null}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{main(process.argv.slice(2));}
 catch(e){console.error("AfriLife build: "+e.message);process.exitCode=1;}
}
