using System;

namespace AfriLife.Infrastructure.Power
{
    public sealed class PowerSimulationService
    {
        public PowerEventType Evaluate(RegionalPowerState state)
        {
            if (state == null) return PowerEventType.MajorOutage;
            if (state.MajorFault) return PowerEventType.MajorOutage;
            if (state.LoadShedding || state.SupplyRatio < 0.85f)
                return PowerEventType.LoadShedding;
            if (state.DistributionCondition01 < 0.35f)
                return PowerEventType.LocalFault;
            return PowerEventType.Stable;
        }
    }
}
