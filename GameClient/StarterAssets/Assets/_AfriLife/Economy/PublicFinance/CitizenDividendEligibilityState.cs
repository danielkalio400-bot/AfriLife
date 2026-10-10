using System;

namespace AfriLife.Economy.PublicFinance
{
    [Serializable]
    public sealed class CitizenDividendEligibilityState
    {
        public string EligibilityId = string.Empty;
        public string CountryId = string.Empty;
        public string PersonEntityId = string.Empty;
        public bool Eligible;
        public string ReasonTag = string.Empty;
        public long UpdatedAtUnixSeconds;
    }
}
