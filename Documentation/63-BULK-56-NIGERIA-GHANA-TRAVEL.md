# AfriLife Bulk 56 — One Nigeria–Ghana World Directory and Scene Transfer

The user successfully generated the first two real Unity scenes locally on 2026-10-11. This bulk installs a unified admin-region directory and an in-game travel selector into those existing scenes without rebuilding, overwriting art, or discarding player progress.

- **Nigeria**: 36 states plus the Federal Capital Territory, with stable IDs.
- **Ghana**: 16 administrative regions, with stable IDs.
- **12 known city directory entries**; **only Lagos and Accra** have real Unity build-scene references. Remaining cities are explicitly marked planned and are not clickable.
- A runtime world-map selector lists countries, divisions and actual city availability. Its transfer action uses Unity \`SceneManager.LoadSceneAsync(..., LoadSceneMode.Single)\`, with Build Settings checks. This is an instant scene transfer, not a claimed simulated flight, road trip, visa or border crossing.
- Two SHA256-verified alternating **travel checkpoint** files under Unity \`Application.persistentDataPath\` remember each city position and last destination.
- **Separate from the existing Lagos-only WorldSaveData / NGN economy**: entering Accra does not overwrite the Lagos player wallet, identity, needs or FirstNeighborhoodPrototype ledger. Accra's incompatible Lagos daily-life HUD is disabled, with original assets and actors retained. Ghana-specific daily-life services and GHS gameplay are still required.
- The editor installer upgrades the **actual saved ProductionLagos.unity and ProductionAccra.unity files**; existing scene hierarchy is preserved and reruns are idempotent. This runs automatically when \`AfriLifeProductionCityBuilder.CreateAll()\` executes from the same Windows installer previously used.
- No claim of country geometry, open-world seamless streaming, natural-language citizen services, real border journey or verified performance. GitHub test runs check source contracts; only local Unity 6.6 Editor compilation and Play Mode validate execution.

To install: save/close Unity, download fresh \`Build-AfriLife-Cities.ps1\` from main and execute it. The existing local source hash system installs new scripts without replacing user-modified scripts, then authors navigation into both city scenes. Confirm **AFRILIFE_TRAVEL_BUILD_RESULT=SUCCESS** followed by **AFRILIFE CITY SCENES CREATED IN UNITY**. Reopen ProductionLagos, press Play and use the top-right **World Map** button. To visit Accra, select Ghana → Greater Accra → Accra.

Next: distinct Ghanaian economy/day loop, travel service modes and authenticated cross-city progression, expanded authored city scenes, accurate maps and platform optimization.
