# AfriLife Bulk 55 — Authored Nigeria/Ghana city foundations

This work adds a Unity 6 Editor pipeline that materializes **two distinct saved city scene files**, separate from the old prototype scene: ProductionLagos.unity and ProductionAccra.unity. These are built locally through the Unity Editor, not committed as fake Unity YAML.

- Retain original walkable player, persistent named residents Ada/Bola/Kwame, site interaction targets, activity objects and save-game loop.
- Create connected urban street/grid geometry, walkable ground, marketplace with stalls and awnings, home, clinic, bank and workplace architecture, residential buildings, physical sidewalks, crossbars/power poles and drainage.
- Generate deterministic original 256x256 URP-lit mipmapped/compressed surface textures as actual Unity project assets.
- Preserve any already-built Nigeria/Ghana scene on rerun; source FirstNeighborhoodPrototype.unity is never overwritten.
- Scene metadata distinguishes Lagos (NG) and Accra (GH); **the current first-day economy/HUD is NGN-based, even in the Ghana scene**. Ghana currency, taxation, dialogue and economy localization remain a future production requirement and the metadata explicitly marks Ghana economy as not localized.
- Existing resident/player capsules are NOT falsely presented as finished realistic humans. Distinct legally acquired rigged human FBX/prefabs, clip controllers, authored buildings, real PBR asset packages, bake/stream systems and custom world content remain essential.
- GitHub CI tests source shape only. It does not execute Unity, construct actual scenes or certify visual quality.

Unity menu: **AfriLife > Cities > Create Lagos and Accra** or batch entry **AfriLife.Editor.AfriLifeProductionCityBuilder.Batch**. Unity project setup from Unity Hub / URP required, plus importing the real StarterAssets _AfriLife scripts.

No ZIP backups, backup folders, Library or Temp artifacts in the repository. Git commit history is the only repository history.
