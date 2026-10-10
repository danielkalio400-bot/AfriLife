using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class FuelDependencyState
    {
        public string NetworkId = string.Empty;
        public double FuelAvailability01 = 1d;
        public double RoadCapacityMultiplier = 1d;
        public double CourierCapacityMultiplier = 1d;
        public long UpdatedAtUnixSeconds;
    }
}
