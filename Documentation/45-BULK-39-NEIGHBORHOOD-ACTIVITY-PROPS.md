# AfriLife Bulk 39 — Physical activity props and fail-closed first-day progression

The first-day demo already had a walking capsule and site markers, but the required-action HUD permitted the step to complete without walking when its player controller was missing. It also checked only the site marker, not an actual authored activity object.

This bulk requires **all** 17 sequential gameplay actions to pass a new `FirstNeighborhoodPhysicalActionGate`: a controllable character must exist, the correct site marker must be within range, and a step-specific original scene prop must be within range. The existing economy, resident checks and ordered step controller remain the sole sources of progression, money and NPC state.

The Unity scene builder adds 11 original primitive activity props (bed/rest, wash basin, wardrobe, breakfast, phone, doorway, workplace desk, market counter, park, neighbor circle, bank window) and the Editor validator checks exactly one compatible prop per step. Props have disabled physical colliders to avoid trapping players in the external blockout. Running the scene upgrade repeatedly preserves existing objects.

Node reference tests cover all authored steps, physical distance failure, missing controls, missing props and source wiring. Real first-person animation, interior architecture, locomotion QA, Unity compilation, Android/iOS/Windows testing and the full Nigeria–Ghana world remain outstanding.
