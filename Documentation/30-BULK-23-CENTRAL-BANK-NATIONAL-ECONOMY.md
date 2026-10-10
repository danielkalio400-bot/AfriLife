# Bulk 23 - Central bank and national economy foundation

This bulk implements Phase 36 of the AfriLife master specification as fictional macroeconomic simulation.

## Added
- Currency-supply state.
- Policy interest-rate state.
- Inflation state.
- Foreign-reserve state.
- Exchange-rate state.
- National debt state.
- Imports and exports.
- Calculated trade balance.
- Productivity index.
- Banking-regulation state.
- Currency-stability state.
- Monetary-policy decision records.
- Backend routes/tests and persistence tables.

## Master-spec alignment
Phase 36 lists currency supply, interest rates, inflation, foreign reserves, exchange rates, debt, imports, exports, trade balance, productivity, banking regulation and currency stability.

## Economic-data boundary
All values are fictional in-world values. No current Central Bank of Nigeria, Bank of Ghana, government or market data is embedded, and the simulation should not be interpreted as financial advice or a forecast.

## Production boundary
The current implementation is state-oriented. A later simulation layer can connect these variables to prices, employment, lending, business behavior, trade and public finance using explicitly tested game-balance formulas.
