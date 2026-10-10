using System;

namespace AfriLife.World.Streaming
{
    [Serializable]
    public sealed class DistrictSimulationState
    {
        public string DistrictId = string.Empty;
        public SimulationTier Tier = SimulationTier.StatisticalFarRegion;
        public double LastSimulatedWorldSeconds;
        public int ResidentPopulationEstimate;
        public int ActiveNpcCount;
        public int ActiveVehicleCount;
    }
}
