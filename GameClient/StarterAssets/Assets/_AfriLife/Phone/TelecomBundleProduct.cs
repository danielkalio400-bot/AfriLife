using System;
using AfriLife.Economy.Money;

namespace AfriLife.Phone
{
    [Serializable]
    public sealed class TelecomBundleProduct
    {
        public string ProductId = string.Empty;
        public string ProviderId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long PriceMinorUnits;
        public long DataMegabytes;
        public int ValidDays = 30;
    }
}
