using System;

namespace AfriLife.Economy.PublicFinance
{
    [Serializable]
    public sealed class NationalFundAccountState
    {
        public string AccountId = string.Empty;
        public string CountryId = string.Empty;
        public NationalFundType FundType;
        public string CurrencyCode = string.Empty;
        public long BalanceMinorUnits;
        public bool Protected;
        public long UpdatedAtUnixSeconds;
    }
}
