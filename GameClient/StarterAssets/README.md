# AfriLife Unity 6 URP importable neighborhood prototype

**This folder is a collection of Unity C# source assets.** The repository does not yet ship an initialized Unity project, compiled app, serialized scene or finished open-world environment.

Create a new Unity 6 URP project in Unity Hub. Copy `Assets/_AfriLife` into its `Assets/_AfriLife` folder, allowing Unity to generate its own `.meta` records. In the Unity Editor, select **AfriLife > Build First Neighborhood Prototype Scene** to generate the blockout once, then **AfriLife > Validate First Neighborhood Prototype Scene** to check the seven interaction sites, 11 activity props, three resident objects, player and camera. The scene generator will not overwrite an existing user-created scene.

For unattended builds, install the matching Android, Windows or iOS support module, and run the Node launcher documented at `Documentation/53-BULK-47-UNITY-BUILD-READINESS.md`. The launcher requires a real Editor and ProjectSettings; CI alone cannot compile Unity C# or produce application binaries. On macOS, iOS produces an Xcode project requiring Xcode and signing, not a pre-signed IPA.

This is an authored fictional Lagos test neighborhood, not the full intended Nigeria–Ghana simulator.
