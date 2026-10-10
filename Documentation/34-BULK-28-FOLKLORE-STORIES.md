# Bulk 28 — Phase 40 Optional Fictional Folklore Stories

This extends the completed Phase 38 weather and Phase 39 news/media foundations without duplicating either. Source: unified master Part I §37 and expanded Phase 40. Nigeria and Ghana receive equal systems.

## Delivered
- Character-level content preference with opt-out as the default, ambiguous fiction, or clearly supernatural fiction.
- Curated original themes such as lamplit halls, harbor lights and distant footsteps; no representation of actual deities as threats.
- Stateful property-based narrative with strange-signs, investigation, and peaceful resolution.
- Deterministic options to observe, ask a neighbor, investigate, reassure, or leave; outcome depends on mode and choice.
- Owner-only developer API journal, country and region filtering, and request/decision idempotency.
- Opt-out immediately pauses active stories and hides the journal.
- Bounded household uncertainty and property reputation consequences.
- Express Unity DTOs, contracts, route tests and a prospective SQLite-compatible persistence migration.

## Safety and authenticity
The content is optional, non-graphic and explicitly fictional. It does not provide real-world ritual methods, claim beliefs to be harmful, portray real religions or ethnicities as monsters, or publish official alerts. The system must never generate character harm instructions or associate real geographic communities with fabricated dangers.

## Build quality and limitations
Run `cd Backend && npm test`. The present service is in-memory and the HTTP routes live under `/v1/dev/` without production authorization. The SQL schema does not imply a connected storage adapter. Unity DTOs are not scenes or assets. Production requires session ownership checks, durable persistence, opt-in UI, content review and device testing.
