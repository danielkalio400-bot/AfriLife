using System;

namespace AfriLife.Justice.Investigation
{
    [Serializable]
    public sealed class EvidenceChainEntry
    {
        public string ChainEntryId = string.Empty;
        public string EvidenceId = string.Empty;
        public string FromCustodianId = string.Empty;
        public string ToCustodianId = string.Empty;
        public string ActionTag = string.Empty;
        public long RecordedAtUnixSeconds;
    }
}
