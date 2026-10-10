# Bulk 14 - Police, CID and financial-crime foundation

This bulk implements Phase 27 as administrative, investigative and lawful-process game state.

## Added
- Police patrol state.
- Traffic-enforcement records.
- Arrest records requiring legal authority references.
- Statements and evidence records.
- Evidence chain-of-custody metadata.
- General/property/CID-style investigation cases.
- Cybercrime investigation as high-level case classification only.
- Financial-fraud and fictional financial-crime-agency case support.
- Suspicious-transaction review records.
- Asset-freeze orders requiring legal-process references.
- Authorized search/arrest operation records without tactical procedure.
- Agency-cooperation records.
- Backend routes/tests and persistence tables.

## Master-spec alignment
Phase 27 lists police patrol, traffic enforcement, arrest, statements, evidence, CID investigations, cybercrime investigation, financial-fraud investigation, an EFCC-style financial-crime agency, suspicious transactions, asset freezing through legal process, search/arrest operations, evidence chain and agency cooperation.

## Safety boundary
No hacking techniques, operational raid tactics, evasion guidance, security bypass, weapon procedure or instructions for committing financial crime are implemented. Cybercrime and financial-crime features are investigation/consequence records only.

## Production boundary
Agency names are fictional/generic, and the system does not model real police databases, real banking surveillance, real warrants, or real asset freezing.
