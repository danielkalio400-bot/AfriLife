using System;

namespace AfriLife.Economy.Macro
{
    [Serializable]
    public sealed class TradeBalanceState
    {
        public string CountryId = string.Empty;
        public string FiscalPeriod = string.Empty;
        public long ImportsMinorUnits;
        public long ExportsMinorUnits;
        public long TradeBalanceMinorUnits;
    }
}
