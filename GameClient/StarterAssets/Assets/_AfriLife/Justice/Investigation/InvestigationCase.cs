using System;

namespace AfriLife.Justice.Investigation
{
    [Serializable]
    public sealed class InvestigationCase
    {
        public string CaseId = string.Empty;
        public InvestigationCaseType Type;
        public InvestigationCaseState State = InvestigationCaseState.Open;
        public string LeadAgencyId = string.Empty;
        public string RegionId = string.Empty;
        public int StatementCount;
        public int EvidenceCount;
        public long OpenedAtUnixSeconds;
        public long UpdatedAtUnixSeconds;
    }
}
