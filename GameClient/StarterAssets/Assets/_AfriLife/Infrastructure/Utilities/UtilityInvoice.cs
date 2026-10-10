using System;
using AfriLife.Economy.Money;

namespace AfriLife.Infrastructure.Utilities
{
    [Serializable]
    public sealed class UtilityInvoice
    {
        public string InvoiceId = string.Empty;
        public string AccountId = string.Empty;
        public UtilityDependencyType Utility;
        public CurrencyCode Currency;
        public long AmountMinorUnits;
        public long IssuedAtUnixSeconds;
        public long DueAtUnixSeconds;
        public bool Paid;
    }
}
