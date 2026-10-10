# AfriLife Bulk 54 — Realistic Neighborhood Save-Position Restoration

## Code changes

- Local saved player X/Z coordinates are no longer forcibly clamped to **-16..+16 meters** when the author-installed **AfriLife Production Neighborhood** root is active. The original 34-meter test scene still uses its existing bounds for compatibility.
- The runtime reads *only roots in the player's own loaded Unity scene*, avoiding falsely detecting production worlds loaded additively in unrelated scenes.
- For a real imported neighborhood, the saved horizontal position is projected onto a nearby **baked walkable NavMesh surface**; its vertical coordinate comes from actual navigation geometry rather than assuming zero elevation. Saved points with no reachable nearby ground or a large horizontal offset are not teleported to an arbitrary street.
- A failed production restoration leaves the existing player position and persisted coordinates intact, with a warning about missing walkable geometry. The existing CharacterController enabled state is preserved around a successful teleport.
- The local persistence format and economy/service authority are unchanged. It still stores only X/Z; a future save-format upgrade may be needed for multiple walkable floors at identical X/Z.

## Local Unity acceptance (not performed remotely)

Import original/licensed realistic Nigerian/Ghanaian neighborhood geometry, rigged characters and any authored school areas into the local Unity 6 URP project. Bake a NavMesh that covers playable streets and saved waypoints. Walk beyond the old +/-16 m square, save using the normal neighborhood controls, exit and reload. Verify the same X/Z is restored on walkable ground and that a missing/invalid NavMesh does not teleport the character or erase the saved position. Test with Unity Editor, Android, iOS and Windows; profile materials, collision, performance and accessibility.

This commit does not add production FBX models, Unity .unity scenes, textures or binary builds. Passing source-level CI is not Unity compilation or actual gameplay verification.
