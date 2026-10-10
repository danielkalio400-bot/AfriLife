# AfriLife Bulk 40 — Persistent local day clock and neighborhood business hours

The first playable neighborhood day previously ended after scripted work, commute and sleep while leaving the saved world clock at approximately 18:40. Clicking **Begin next demo day** reset the action order but did not advance time; resident NPC routines therefore drifted away from the intended morning schedule.

This bulk adds a deterministic simulated local clock starting at **06:00**, persisted through the existing `ElapsedWorldSeconds` field. Once an entire day has completed and its checkpoint has been verified, `BeginNextDay` advances the clock strictly forward to the following 06:00 and refreshes the same canonical resident schedules. Old save files with elapsed seconds remain compatible; the state is not reset to zero.

Four optional errands now have fictional opening-hour windows; the simulator blocks closed services **before** debiting the wallet or changing needs, inventory, or NPC state. The mobile-friendly HUD shows local world time and each errand's opening hours and availability. Node reference tests cover day rollover, schedule boundaries, opening hours, and Unity source wiring.

This is fictional single-neighborhood scripted gameplay, not actual Nigerian business hours, an online scheduler, a national map, or a Unity/device-tested game. Continued real-world economic and transport modeling requires separate validation.
