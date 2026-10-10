using System;

namespace AfriLife.Justice.Courts
{
    [Serializable]
    public sealed class SentenceExecutionState
    {
        public string ExecutionId = string.Empty;
        public string DecisionId = string.Empty;
        public long FineOutstandingMinorUnits;
        public long RestitutionOutstandingMinorUnits;
        public int CommunityServiceHoursRemaining;
        public int CustodialDaysRemaining;
        public string Status = "pending";
    }
}
