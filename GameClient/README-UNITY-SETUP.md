# AfriLife Unity Setup

Create the real Unity project through Unity Hub using Unity 6 LTS and the Universal 3D / URP template.

Location:
`GameClient/AfriLife-Unity`

The repository intentionally does not fabricate Unity ProjectSettings, Packages, renderer assets, .meta files, or version-locked package manifests. Unity Hub should create those files for the installed editor version.

After project creation, copy or import:
`GameClient/StarterAssets/Assets/_AfriLife`
into:
`GameClient/AfriLife-Unity/Assets/_AfriLife`

Target platforms are Android, iOS and Windows PC. Mobile scalability is mandatory; PC remains a committed target.

## Realistic residents and environment (Bulk 50)

Use **Assets > Create > AfriLife > Production Art Profile** to assign imported original/licensed, rigged Humanoid prefabs for the player/Ada/Bola/Kwame plus a realistic neighborhood prefab with colliders. Open the saved neighborhood and select **AfriLife > Production Art > Apply Imported Prefabs**. This replaces visible blockout art while preserving the gameplay anchors, physical character controls and interactions. The tool does not save automatically, and no production 3D assets are bundled. See `Documentation/56-BULK-50-REALISTIC-ASSET-INTEGRATION.md` for prerequisites and test coverage.
