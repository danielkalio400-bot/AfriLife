# Bulk 17 - Immigration, passport and visa foundation

This bulk implements Phase 30 from the AfriLife master specification as fictional administrative game state.

## Added
- Citizenship/residency records.
- Passport application and issuance state.
- Visa applications and application-form state.
- Immigration offices.
- Embassies and consulates.
- Supporting-document records.
- High-level biometric appointment state without biometric-data storage.
- Interview scheduling.
- Processing queues.
- Approval/refusal states.
- Residence, work and student permits.
- Entry/exit records.
- Border-officer assignments.
- Backend services/routes/tests and persistence tables.

## Master-spec alignment
Phase 30 lists citizenship, passports, visa applications, immigration offices, embassies/consulates, application forms, supporting documents, biometrics, interviews, processing queues, approval/refusal, residence permits, work permits, student permits, entry/exit records and border officers.

## Safety and legal boundary
The system does not provide real immigration eligibility rules, legal advice, document-forgery guidance or border-evasion methods. It is fictional simulation state only.

## Production boundary
No real government systems, passport databases, biometric stores, embassy APIs or border-control systems are integrated.
