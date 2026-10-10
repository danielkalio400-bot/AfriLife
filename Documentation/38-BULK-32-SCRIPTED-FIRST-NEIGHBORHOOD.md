# AfriLife Bulk 32 — Scripted first-neighborhood interactive vertical slice

This batch moves from catalogs to Unity scene-generation and a serialized day-one local playable interaction prototype. It follows the master specification's build-order gate: actual first-neighborhood interactions and persistence precede nationwide map construction.

## Implementation
- Unity Editor menu **AfriLife > Build First Neighborhood Prototype Scene** creates an original scene with six named blockout locations using primitives, and never overwrites a locally authored existing scene.
- A safe-area-aware demo HUD drives all 17 steps from the original `daily-life-loop.json`, explicitly preventing out-of-order actions.
- The Unity loop reuses `DefaultInteractionRegistry` for Shower, Eat, Sleep; the shared `WalletState` for NGN costs and earnings; `PlayerInventory`, `NeedsState`, `MobilePhoneState`, `EmploymentState`, and `BillState`.
- First-neighborhood state saves within the existing `WorldSaveData`. The final step only completes when local save reload confirms its world identity and step index.
- Node reference tests exercise sequence, economy debits and income, reload, and Unity integration/source checks.

## Honest limitations
The world is **scripted** and static: no free-walking, real vehicles, NPC conversations, AI, street traffic, telecom networks, open-world trading, or real procedural 3D city. It is not a finished daily-life game and **does not** certify the Phase 43 expansion readiness gate. The Unity Editor has not compiled these files here; manual Play Mode and Android/iOS/Windows validation are required.

## Setup
Create Unity 6 URP project following `GameClient/README-UNITY-SETUP.md`, copy `_AfriLife` source, open Unity menu `AfriLife > Build First Neighborhood Prototype Scene`, open the generated scene and press Play. The local demo uses `Application.persistentDataPath`. Never edit PlayerPrefs to falsify completion.

## Verification
`cd Backend && npm test`. CI runs Node simulation tests and Unity-source static assertions, not Unity compilation.
