# Bulk 25 - Weather and environment foundation

This bulk implements Phase 38 of the AfriLife master specification.

## Added
- Rain, storm, heat, fog, flooding and wind state.
- Wet-road state.
- Seasonal weather state.
- Solar-output multiplier.
- Flight-disruption score.
- Ship-disruption score.
- Power-grid damage-risk score.
- Agricultural-yield multiplier.
- Weather-event lifecycle.
- Unity DTOs, backend routes/tests and persistence tables.

## Master-spec alignment
Phase 38 lists rain, storms, heat, fog, flooding, wet roads, wind, seasonal weather, solar-output changes, flight disruption, ship disruption, power-grid damage and agricultural impact.

## Simulation boundary
The values are normalized game-state variables. They are not real forecasts, disaster alerts, navigation advice or engineering calculations.

## Production boundary
The current implementation is a deterministic state/effect layer. A later Unity integration can drive sky, lighting, particles, water, road materials, vehicle grip, utilities, aviation, maritime systems and agriculture from these states.
