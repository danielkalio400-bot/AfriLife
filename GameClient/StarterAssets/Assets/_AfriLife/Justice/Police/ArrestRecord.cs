using System;

namespace AfriLife.Justice.Police
{
    [Serializable]
    public sealed class ArrestRecord
    {
        public string ArrestRecordId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CaseId = string.Empty;
        public string LegalAuthorityRef = string.Empty;
        public string Status = "recorded";
        public long RecordedAtUnixSeconds;
    }
}
