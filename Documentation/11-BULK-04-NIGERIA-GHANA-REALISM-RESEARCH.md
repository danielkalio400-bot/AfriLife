# Bulk 04 - Nigeria and Ghana realism research foundation

This bulk converts the master specification's Nigeria/Ghana direction into versioned game-reference data and reusable infrastructure simulation types.

## Added
- Country runtime profiles with NGN/GHS and right-hand road traffic.
- Regional climate archetypes.
- Road condition/congestion state.
- Public transport archetypes.
- Regional telecom coverage/congestion/power coupling.
- Regional power supply/fault state.
- Weather hazard state and cross-system impact events.
- Nigeria, Ghana and cross-border reference contracts.
- Source registry naming the official institutions used for research.
- Backend world-reference endpoints and automated tests.
- Persistence tables for regional power, telecom and road state.

## Research anchors
Nigeria realism should be refreshed against NiMet for rainfall, temperature and flood/harmattan conditions; NERC for metering/distribution/state-market changes; and NCC for mobile coverage and network-performance data.

Ghana realism should be refreshed against Ghana Statistical Service for population/economic context, NCA for mobile-data/coverage/5G evolution, Energy Commission for power/renewables/electric mobility, and official transport/highway authorities for public transport and road rules.

## Game-design interpretation
The runtime contracts intentionally encode durable simulation concepts instead of volatile real-world numbers. Current subscriber counts, tariffs, inflation, fuel prices and other fast-changing values belong in a separately versioned balancing dataset, not hard-coded gameplay code.

Nigeria and Ghana remain equally first-class playable countries. Regional differences should emerge from infrastructure, weather, transport, economy and city systems rather than stereotypes.
