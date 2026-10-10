# Bulk 24 - National revenue and citizen-dividend foundation

This bulk implements Phase 37 of the AfriLife master specification as fictional public-finance simulation.

## Added
- Government revenue accounts.
- Sovereign reserve funds.
- Citizen dividend funds.
- Protected fund-account state.
- Revenue deposits and protected allocations.
- Fictional eligibility records.
- Idempotent daily/periodic distribution runs.
- Per-recipient payment records.
- Public-finance audit history.
- Aggregated public-transparency snapshots.
- Economy-impact state.
- Client DTOs, persistence, routes and tests.

## Master-spec alignment
Phase 37 lists the government revenue account, sovereign reserve fund, citizen dividend fund, protected accounts, automatic distribution, auditing, public transparency, eligibility, daily/periodic payments and economy impact.

## Policy boundary
Eligibility rules, account balances and payment formulas are fictional game mechanics. They are not descriptions of Nigerian or Ghanaian law, welfare programs, sovereign funds or entitlements.

## Privacy boundary
Public transparency exposes aggregate fund and payout totals. Individual recipient identifiers are not included in public transparency responses.

## Production boundary
The service is currently state-oriented and in-memory. A later simulation layer can connect revenue sources, macroeconomic variables, government budgets, taxation and household spending using explicitly tested game-balance rules.
