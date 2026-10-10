using System;

namespace AfriLife.Economy.Macro
{
    [Serializable]
    public sealed class ExchangeRateState
    {
        public string BaseCurrency = string.Empty;
        public string QuoteCurrency = string.Empty;
        public double QuotePerBase;
        public long UpdatedAtUnixSeconds;
    }
}
