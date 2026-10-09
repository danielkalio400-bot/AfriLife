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
