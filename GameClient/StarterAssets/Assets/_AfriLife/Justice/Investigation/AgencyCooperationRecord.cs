using System;

namespace AfriLife.Justice.Investigation
{
    [Serializable]
    public sealed class AgencyCooperationRecord
    {
        public string CooperationId = string.Empty;
        public string CaseId = string.Empty;
        public string RequestingAgencyId = string.Empty;
        public string RespondingAgencyId = string.Empty;
        public string RequestTag = string.Empty;
        public string Status = "requested";
        public long RequestedAtUnixSeconds;
    }
}
