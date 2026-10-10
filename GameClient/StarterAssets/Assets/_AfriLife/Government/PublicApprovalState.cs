using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class PublicApprovalState
    {
        public string CountryId = string.Empty;
        public string SubjectId = string.Empty;
        public double Approval01 = 0.5d;
        public long UpdatedAtUnixSeconds;
    }
}
