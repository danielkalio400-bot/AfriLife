# Bulk 01 - Daily-life and world foundation

This bulk starts the first serious AfriLife gameplay loop while preserving the large-world architecture.

## Added
- Shared service registry.
- Runtime needs state, rates and simulation.
- Player inventory.
- Currency-safe wallet state.
- Interaction context/result/handler/executor foundation.
- Home utility/runtime state.
- District simulation state and distance-based simulation-tier policy.
- World streaming coordinator.
- NPC simulation policy by world tier.
- Structured local world-save data and atomic save store.
- Android/iOS/Windows platform contract.
- Daily-life milestone contract.
- Backend read-only contract endpoints and tests.
- Reference save-slot and district-state database schema.

## Production boundary
This is a foundation, not the finished living world. It does not yet contain the final character controller, complete interiors, jobs, transport, businesses, banking services, traffic, full NPC schedules, telecom purchasing, utility outages, government simulation or production cloud persistence.

Local save storage is for development/offline use. Online persistence must be server-authoritative and versioned before release.
