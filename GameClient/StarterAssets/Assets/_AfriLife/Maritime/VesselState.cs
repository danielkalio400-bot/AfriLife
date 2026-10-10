using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class VesselState
    {
        public string VesselId = string.Empty;
        public string DisplayName = string.Empty;
        public VesselType Type;
        public int PassengerCapacity;
        public double CargoCapacityKg;
        public double FuelLevel01 = 1d;
        public double Condition01 = 1d;
        public string HomePortId = string.Empty;
        public bool InService = true;
    }
}
