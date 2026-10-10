using System;

namespace AfriLife.Economy.Fuel
{
    [Serializable]
    public sealed class StrategicFuelReserveState
    {
        public string ReserveId = string.Empty;
        public string CountryId = string.Empty;
        public FuelType Fuel;
        public double StoredLiters;
        public double CapacityLiters;
        public double MinimumTargetLiters;

        public void Normalize()
        {
            CapacityLiters = Math.Max(0d, CapacityLiters);
            StoredLiters = Math.Clamp(StoredLiters, 0d, CapacityLiters);
            MinimumTargetLiters = Math.Clamp(MinimumTargetLiters, 0d, CapacityLiters);
        }
    }
}
