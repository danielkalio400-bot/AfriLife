# AfriLife Bulk 41 — Walk-to-wait time progression

## Why it matters
Bulk 40 added fictional opening hours for clinic and market errands, but day one starts at 06:00 and the HUD offered no deliberate way to wait for those services to open without completing unrelated scripted actions. This bulk adds a player-initiated **Wait 1 hour** option at either the existing home bed or park activity spot.

The waiting service first verifies a real walkable player, a physically close authored rest prop **and** the matching home/park site marker. It refuses waiting after the sleep step, beyond four hourly sessions per saved game day, or at/after 20:00. A successful wait advances the common fictional world clock by exactly 3600 seconds, refreshes residents' schedules, and saves the same world via the existing two-slot checkpoint system. The counter is saved, restored and reset only when a verified next game day begins. It cannot credit or debit the wallet or skip mandatory daily-life steps.

Node reference tests validate physically gated waiting, an intact per-day quota through save/reload, availability of market and clinic after simulated waiting, and Unity source wiring. This is local scripted gameplay; Unity Editor Play Mode and device builds have **not** been run, and no real Nigerian/Ghanaian opening hours are implied.
