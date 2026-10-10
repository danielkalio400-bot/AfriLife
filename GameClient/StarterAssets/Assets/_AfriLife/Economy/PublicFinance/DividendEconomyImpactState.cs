using System;

namespace AfriLife.Economy.PublicFinance
{
    [Serializable]
    public sealed class DividendEconomyImpactState
    {
        public string CountryId = string.Empty;
        public string PeriodId = string.Empty;
        public long LiquidityInjectionMinorUnits;
        public int RecipientCount;
        public double DemandIndexDelta;
        public long UpdatedAtUnixSeconds;
    }
}
