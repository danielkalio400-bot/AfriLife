#if UNITY_EDITOR
using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    /// <summary>
    /// Actual Unity 6 batchmode BuildPipeline for the walkable Lagos
    /// prototype. Uses real compiler/build modules; no placeholder binaries.
    /// </summary>
    public static class FirstNeighborhoodBatchBuild
    {
        private const string ScenePath=
            "Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";

        public static void Run()
        {
            try
            {
                string platform=RequiredArg("-afriPlatform").ToLowerInvariant();
                string output=Path.GetFullPath(RequiredArg("-afriOutput"));
                BuildTarget target;
                BuildTargetGroup group;
                if(platform=="android")
                {
                    target=BuildTarget.Android;
                    group=BuildTargetGroup.Android;
                    if(!output.EndsWith(".apk",StringComparison.OrdinalIgnoreCase))
                        throw new InvalidOperationException("Android demo output must be .apk");
                    EditorUserBuildSettings.buildAppBundle=false;
                }
                else if(platform=="windows")
                {
                    target=BuildTarget.StandaloneWindows64;
                    group=BuildTargetGroup.Standalone;
                    if(!output.EndsWith(".exe",StringComparison.OrdinalIgnoreCase))
                        throw new InvalidOperationException("Windows demo output must be .exe");
                }
                else if(platform=="ios")
                {
                    if(Application.platform!=RuntimePlatform.OSXEditor)
                        throw new InvalidOperationException("iOS Xcode export requires macOS Unity Editor");
                    target=BuildTarget.iOS;
                    group=BuildTargetGroup.iOS;
                }
                else throw new InvalidOperationException("Unsupported platform: "+platform);

                if(!BuildPipeline.IsBuildTargetSupported(group,target))
                    throw new InvalidOperationException("Install Unity Build Support for "+platform);
                if(EditorUserBuildSettings.activeBuildTarget!=target)
                    throw new InvalidOperationException("Run Unity with matching -buildTarget");

                FirstNeighborhoodPrototypeSceneBuilder.BuildUnattended();
                Scene scene=EditorSceneManager.OpenScene(ScenePath,OpenSceneMode.Single);
                if(!scene.IsValid() || !scene.isLoaded)
                    throw new InvalidOperationException("Prototype scene was not loaded");
                var issues=FirstNeighborhoodSceneValidator.Inspect();
                if(issues.Count>0)
                    throw new InvalidOperationException(
                        "Scene validation failed: "+string.Join("; ",issues));

                string folder=platform=="ios" ? output : Path.GetDirectoryName(output);
                if(string.IsNullOrWhiteSpace(folder))
                    throw new InvalidOperationException("Output path needs a parent directory");
                Directory.CreateDirectory(folder);
                BuildReport report=BuildPipeline.BuildPlayer(new BuildPlayerOptions{
                    scenes=new [] {ScenePath},
                    locationPathName=output,
                    target=target,
                    options=BuildOptions.Development
                });
                if(report==null || report.summary.result!=BuildResult.Succeeded)
                    throw new InvalidOperationException("Unity player build failed");
                Debug.Log("AfriLife neighborhood Unity build succeeded: "+output);
                EditorApplication.Exit(0);
            }
            catch(Exception e)
            {
                Debug.LogException(e);
                EditorApplication.Exit(1);
            }
        }
        private static string RequiredArg(string key)
        {
            var args=Environment.GetCommandLineArgs();
            for(int i=0;i<args.Length;i++)
                if(string.Equals(args[i],key,StringComparison.OrdinalIgnoreCase))
                {
                    if(i+1<args.Length&&!args[i+1].StartsWith("-")&&
                       !string.IsNullOrWhiteSpace(args[i+1]))
                        return args[i+1];
                    break;
                }
            throw new ArgumentException("Missing required Unity argument "+key);
        }
    }
}
#endif
