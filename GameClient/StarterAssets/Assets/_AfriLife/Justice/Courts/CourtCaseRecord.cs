using System;
using System.Collections.Generic;

namespace AfriLife.Justice.Courts
{
    [Serializable]
    public sealed class CourtCaseRecord
    {
        public string CaseId = string.Empty;
        public CourtType CourtType;
        public CourtCaseState State = CourtCaseState.Filed;
        public string FilingPartyEntityId = string.Empty;
        public string RespondingPartyEntityId = string.Empty;
        public string SubjectTag = string.Empty;
        public string AssignedJudgeEntityId = string.Empty;
        public long FiledAtUnixSeconds;
        public long UpdatedAtUnixSeconds;
        public List<string> EvidenceIds = new();
        public List<string> WitnessEntityIds = new();
    }
}
