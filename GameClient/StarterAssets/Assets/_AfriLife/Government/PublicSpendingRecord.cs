using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class PublicSpendingRecord
    {
        public string SpendingId = string.Empty;
        public string CountryId = string.Empty;
        public string BudgetId = string.Empty;
        public string AgencyId = string.Empty;
        public string PurposeTag = string.Empty;
        public long AmountMinorUnits;
        public long RecordedAtUnixSeconds;
    }
}
