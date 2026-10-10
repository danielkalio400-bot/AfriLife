using System;
using AfriLife.Economy.Money;

namespace AfriLife.RealEstate
{
    [Serializable]
    public sealed class MortgageState
    {
        public string MortgageId = string.Empty;
        public string PropertyId = string.Empty;
        public string BorrowerEntityId = string.Empty;
        public string BankId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long PrincipalMinorUnits;
        public long OutstandingMinorUnits;
        public int TermMonths = 120;
        public int PaymentsMade;
        public float GameInterestRateAnnual01;
        public bool Active = true;

        public void Normalize()
        {
            PrincipalMinorUnits = Math.Max(0L, PrincipalMinorUnits);
            OutstandingMinorUnits = Math.Clamp(OutstandingMinorUnits, 0L, PrincipalMinorUnits);
            TermMonths = Math.Max(1, TermMonths);
            PaymentsMade = Math.Clamp(PaymentsMade, 0, TermMonths);
            GameInterestRateAnnual01 = Math.Clamp(GameInterestRateAnnual01, 0f, 1f);
        }
    }
}
