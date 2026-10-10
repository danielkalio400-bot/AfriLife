using System;
using AfriLife.Economy.Money;

namespace AfriLife.Justice.FinancialCrime
{
    [Serializable]
    public sealed class SuspiciousTransactionRecord
    {
        public string RecordId = string.Empty;
        public string AccountId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long AmountMinorUnits;
        public string ReasonTag = string.Empty;
        public string ReviewStatus = "flagged";
        public long FlaggedAtUnixSeconds;
    }
}
