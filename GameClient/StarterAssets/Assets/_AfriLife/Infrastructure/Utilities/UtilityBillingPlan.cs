using System;
using AfriLife.Economy.Money;

namespace AfriLife.Infrastructure.Utilities
{
    [Serializable]
    public sealed class UtilityBillingPlan
    {
        public string PlanId = string.Empty;
        public UtilityDependencyType Utility;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long FixedChargeMinorUnits;
        public long UnitRateMinorUnits;
        public double IncludedUnits;
    }
}
