using System;

namespace AfriLife.Infrastructure.Power
{
    [Serializable]
    public sealed class RegionalPowerState
    {
        public string RegionId = string.Empty;
        public float AvailableGenerationMw;
        public float DemandMw;
        public float DistributionCondition01 = 1f;
        public bool LoadShedding;
        public bool MajorFault;

        public float SupplyRatio
        {
            get
            {
                if (DemandMw <= 0f) return 1f;
                return Math.Clamp(AvailableGenerationMw / DemandMw, 0f, 1.2f);
            }
        }
    }
}
