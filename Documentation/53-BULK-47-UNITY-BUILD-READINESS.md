# AfriLife Bulk 47 — Unattended Unity prototype builds and artifact verification

## New build path
The existing AfriLife source tree is **not a complete Unity project**: no serialized `.unity` scene or `ProjectSettings` are checked in. Bulk 47 adds a batch-mode path through the real Unity 6 Editor:

- `FirstNeighborhoodPrototypeSceneBuilder.BuildUnattended()` creates the original primitive blockout **only if the scene does not already exist**, without a modal dialog.
- `AfriLife.Editor.FirstNeighborhoodBatchBuild.Run()` verifies the real serialized scene contains a player, HUD, camera, seven site markers, valid activity props for the complete daily-life sequence, and all three existing resident identities, before asking Unity to compile the real player.
- `Backend/scripts/unity-neighborhood-build.mjs` accepts an installed Unity path and existing project path, verifies target requirements, invokes `BuildPipeline.BuildPlayer`, and fails if Unity does not return a successful build with a matching actual output.

## Prerequisites
1. Create a genuine **Unity 6 URP project** in Unity Hub, then copy `GameClient/StarterAssets/Assets/_AfriLife` into its `Assets/_AfriLife` path.
2. Install Android and/or Windows Build Support on the machine running Unity. For iOS, use macOS with the Unity iOS module, then compile/sign using Xcode.
3. Call from the AfriLife repo root. Output paths must be new rather than previously built artifacts.

Android:
```sh
node Backend/scripts/unity-neighborhood-build.mjs --unity "/path/to/Unity" --project "/path/to/UnityProject" --platform android --output "/path/to/new/AfriLife-neighborhood.apk"
```

Windows:
```sh
node Backend/scripts/unity-neighborhood-build.mjs --unity "/path/to/Unity" --project "/path/to/UnityProject" --platform windows --output "/path/to/new/AfriLife-neighborhood.exe"
```

iOS Xcode export on macOS:
```sh
node Backend/scripts/unity-neighborhood-build.mjs --unity "/Applications/Unity/Hub/Editor/6.x/Unity.app/Contents/MacOS/Unity" --project "/path/to/UnityProject" --platform ios --output "/path/to/new/AfriLife-iOS-Xcode"
```

`--dry-run` performs prerequisite validation and prints the arguments without building. Android output is an APK; Windows requires an EXE plus its `_Data` folder; iOS output is an Xcode project **not** a signed IPA. Automated Node tests exercise command planning, missing prerequisites and file checks. Only the Unity Editor can validate C# compilation, mobile input behavior, screen layout and actual device performance; CI passing does not imply a working app or any particular package size.
