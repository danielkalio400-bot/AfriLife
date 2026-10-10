using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class PublicProcurementState
    {
        public string ProcurementId = string.Empty;
        public string CountryId = string.Empty;
        public string AgencyId = string.Empty;
        public string RequirementTag = string.Empty;
        public long BudgetCeilingMinorUnits;
        public string Status = "open";
        public string SelectedSupplierId = string.Empty;
    }
}
