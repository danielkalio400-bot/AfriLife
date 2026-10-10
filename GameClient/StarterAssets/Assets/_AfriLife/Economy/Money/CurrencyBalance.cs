using System;

namespace AfriLife.Economy.Money
{
    [Serializable]
    public sealed class CurrencyBalance
    {
        public CurrencyCode Currency;
        public long MinorUnits;
    }
}
