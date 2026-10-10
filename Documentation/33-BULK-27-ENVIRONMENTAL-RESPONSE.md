# Bulk 27 — Phase 38 environmental response integration

The GitHub main branch already contains Bulk 25 Phase 38 weather and Bulk 26 Phase 39 news/media. This batch deepens Phase 38 instead of introducing duplicate weather systems.

## Functional implementation
- Deterministic regional assessment sourced from existing weather state, country and region.
- Five named impact domains: road capacity, grid availability, aviation schedules, maritime schedules and agricultural supply.
- One active incident per country/region/domain, request ID idempotency, country partitioning and no impact without existing simulated weather.
- Work-order idempotency, partial recovery and completed restoration; severe-condition recovery is slower but remains possible.
- Fictional high-severity media alerts published through the existing media service; incident restoration resolves only its own alert.
- Read-only source-system multipliers: no unsafe cross-service writes or magically created stock/money.
- Development API routes, contract, tests, Unity DTO/presentation adapters and prospective SQL migration.

## Tests and verification
Run `cd Backend && npm test`. Backend tests cover Nigeria/Ghana isolation, severe-weather impact, duplicate requests, recovery, alert deduplication, negative cases and local API integration.

## Boundaries
All new services are in-memory development simulations. SQL schema is not connected. No real forecast ingestion, actual infrastructure, traffic simulation, plane control, financial operation, official disaster alerting, Unity scene integration or device performance certification is implied.
