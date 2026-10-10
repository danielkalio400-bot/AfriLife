using System;

namespace AfriLife.Economy.PublicFinance
{
    [Serializable]
    public sealed class CitizenDividendPaymentRecord
    {
        public string PaymentId = string.Empty;
        public string CountryId = string.Empty;
        public string PeriodId = string.Empty;
        public string PersonEntityId = string.Empty;
        public long AmountMinorUnits;
        public string CurrencyCode = string.Empty;
        public long PaidAtUnixSeconds;
    }
}
