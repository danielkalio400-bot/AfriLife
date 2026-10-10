using System;
using AfriLife.Economy.Money;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class PublicBudgetState
    {
        public string BudgetId = string.Empty;
        public string CountryId = string.Empty;
        public string FiscalPeriod = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long PlannedRevenueMinorUnits;
        public long PlannedSpendingMinorUnits;
        public long ApprovedSpendingMinorUnits;
        public string Status = "draft";
    }
}
