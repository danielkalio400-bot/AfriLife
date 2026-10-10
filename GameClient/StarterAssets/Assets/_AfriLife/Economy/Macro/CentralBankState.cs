using System;

namespace AfriLife.Economy.Macro
{
    [Serializable]
    public sealed class CentralBankState
    {
        public string CountryId = string.Empty;
        public string CurrencyCode = string.Empty;
        public long CurrencySupplyMinorUnits;
        public int PolicyInterestRateBasisPoints;
        public int InflationBasisPoints;
        public long ForeignReservesReferenceUnits;
        public long NationalDebtMinorUnits;
        public double ProductivityIndex = 1d;
        public double CurrencyStability01 = 0.5d;
    }
}
