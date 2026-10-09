# AfriLife

AfriLife is the standalone Nigeria-Ghana living-world simulator project.

## Product direction
- Engine: Unity 6 + URP
- Platforms: Android, iOS, Windows PC
- Architecture: layered world simulation, persistent IDs, event-driven systems, scalable rendering
- Scope: life simulation, housing, NPCs, economy, banking, utilities, transport, health, justice, immigration, government, cross-border trade, weather, folklore, and long-term world history
- Development rule: prove one dense neighborhood and a complete daily-life loop before national expansion

## Repository status
This repository is a production-oriented project scaffold and architecture baseline. It does not yet contain a finished playable game.

## Unity setup
1. Install Unity Hub and a supported Unity 6 LTS editor.
2. Create a **Universal 3D / URP** project at `GameClient/AfriLife-Unity`.
3. Keep Unity-generated caches and local builds out of Git.
4. Import the starter source under `GameClient/StarterAssets/Assets/_AfriLife` into the Unity project.

## Clean repository policy
No backup folders, old copies, generated build output, ZIP snapshots, Unity caches, node_modules, or local databases are committed. Git history is the backup.
