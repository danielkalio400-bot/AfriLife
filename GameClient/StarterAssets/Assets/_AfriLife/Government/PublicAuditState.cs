using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class PublicAuditState
    {
        public string AuditId = string.Empty;
        public string CountryId = string.Empty;
        public string SubjectType = string.Empty;
        public string SubjectId = string.Empty;
        public string Outcome = "pending";
        public int FindingCount;
        public long CompletedAtUnixSeconds;
    }
}
