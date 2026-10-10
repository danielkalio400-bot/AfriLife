using System;

namespace AfriLife.Justice.Courts
{
    [Serializable]
    public sealed class CourtDecisionRecord
    {
        public string DecisionId = string.Empty;
        public string CaseId = string.Empty;
        public CourtDecisionType DecisionType;
        public long FineMinorUnits;
        public long RestitutionMinorUnits;
        public int CommunityServiceHours;
        public int CustodialDays;
        public string DecisionTag = string.Empty;
        public long DecidedAtUnixSeconds;
    }
}
