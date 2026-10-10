# AfriLife Bulk 45 — Selectable landmark guidance from the journal

The in-world **Places** journal page now lets the player select one of the seven existing, fictional Lagos blockout landmarks as an optional compass destination, or automatically choose the closest *undiscovered* authored marker. The HUD shows its live N/S/E/W/HERE cue and XZ straight-line distance while the walkable player moves. A clear-guide control removes the cue.

Route selection is ephemeral HUD state: it does **not** modify the saved daily-life action index, discovered landmarks, wallet, NPC state or errands. Physical site discovery still depends on approaching an actual scene marker, not on selecting the journal item. Missing markers produce an explicit unavailable message; the guide never fabricates missing geometry. No teleportation, NavMesh pathfinding, roads or traffic ETA is implied.

Node tests cover cardinal directions, planar distance, missing scene markers, visited-site exclusion, selection after discovery and Unity HUD integration. Unity Editor compilation and device performance remain unverified.
