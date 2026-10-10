using System;
using AfriLife.Economy.Money;

namespace AfriLife.RealEstate
{
    [Serializable]
    public sealed class RentalAgreementState
    {
        public string AgreementId = string.Empty;
        public string PropertyId = string.Empty;
        public string LandlordEntityId = string.Empty;
        public string TenantEntityId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long RentPerPeriodMinorUnits;
        public int PeriodDays = 30;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;
        public bool Active = true;

        public void Normalize()
        {
            RentPerPeriodMinorUnits = Math.Max(0L, RentPerPeriodMinorUnits);
            PeriodDays = Math.Max(1, PeriodDays);
        }
    }
}
