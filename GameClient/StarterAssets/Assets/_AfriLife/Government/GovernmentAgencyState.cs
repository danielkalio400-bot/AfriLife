using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class GovernmentAgencyState
    {
        public string AgencyId = string.Empty;
        public string CountryId = string.Empty;
        public string DisplayName = string.Empty;
        public string MandateTag = string.Empty;
        public long AnnualBudgetMinorUnits;
        public bool Active = true;
    }
}
