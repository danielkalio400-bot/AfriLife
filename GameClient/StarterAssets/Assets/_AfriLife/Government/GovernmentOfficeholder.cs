using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class GovernmentOfficeholder
    {
        public string AppointmentId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public GovernmentOfficeType OfficeType;
        public string PortfolioTag = string.Empty;
        public long TermStartsUnixSeconds;
        public long TermEndsUnixSeconds;
        public bool Active = true;
    }
}
