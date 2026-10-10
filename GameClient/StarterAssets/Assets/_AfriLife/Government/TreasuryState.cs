using System;
using AfriLife.Economy.Money;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class TreasuryState
    {
        public string CountryId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long BalanceMinorUnits;
        public long CommittedMinorUnits;
        public long SpentMinorUnits;
    }
}
