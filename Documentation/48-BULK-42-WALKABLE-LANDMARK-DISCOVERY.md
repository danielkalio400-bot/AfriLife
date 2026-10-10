# AfriLife Bulk 42 — Persistent walkable landmark discovery

The first Lagos neighborhood prototype now records seven **original blockout** landmarks when a walkable player reaches their authored site markers: home, market, workplace, bank, park, neighbor gathering spot, and clinic. The system checks character proximity using the same Unity `FirstNeighborhoodInteractionPoint.Contains` used elsewhere in the walkable scene.

Each landmark can be discovered once, and `DiscoveredSiteIds` is saved into the existing world checkpoint alongside money, NPCs, day progression and waiting quota. The mobile-oriented HUD shows how many landmarks have been visited and which remain undiscovered. Site discovery is triggered by physical approach, not by pressing a remote HUD button, and it **never** changes wallet balance or awards gameplay rank.

The semantic save validator rejects unknown site IDs, duplicated entries or impossible totals. Node reference tests verify all seven landmarks, distance gating, unchanged wallets, persistent discovery across days, and Unity source integration. This remains a fictional single-neighborhood prototype and requires Unity Editor, Play Mode and Android/iOS/Windows device validation.
