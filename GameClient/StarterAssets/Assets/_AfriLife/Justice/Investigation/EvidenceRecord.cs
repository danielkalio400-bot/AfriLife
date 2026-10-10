using System;

namespace AfriLife.Justice.Investigation
{
    [Serializable]
    public sealed class EvidenceRecord
    {
        public string EvidenceId = string.Empty;
        public string CaseId = string.Empty;
        public string EvidenceType = string.Empty;
        public string DescriptionTag = string.Empty;
        public string CurrentCustodianId = string.Empty;
        public long CollectedAtUnixSeconds;
    }
}
