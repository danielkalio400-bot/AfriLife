using System;

namespace AfriLife.Infrastructure.Power
{
    public sealed class LoadManagementService
    {
        public void Evaluate(RegionalPowerState state)
        {
            if (state == null) return;
            state.DistributionCondition01 = Math.Clamp(state.DistributionCondition01, 0f, 1f);

            if (state.MajorFault)
            {
                state.LoadShedding = true;
                return;
            }

            state.LoadShedding = state.DemandMw > 0f && state.SupplyRatio < 0.9f;
        }
    }
}
