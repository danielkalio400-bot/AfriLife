using System;

namespace AfriLife.Justice.Investigation
{
    [Serializable]
    public sealed class StatementRecord
    {
        public string StatementId = string.Empty;
        public string CaseId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string StatementTag = string.Empty;
        public long RecordedAtUnixSeconds;
    }
}
