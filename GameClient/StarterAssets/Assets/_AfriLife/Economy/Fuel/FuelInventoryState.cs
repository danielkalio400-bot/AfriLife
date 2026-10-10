using System;

namespace AfriLife.Economy.Fuel
{
    [Serializable]
    public sealed class FuelInventoryState
    {
        public FuelType Type;
        public double AvailableLiters;
        public double ReservedLiters;
        public double CapacityLiters;

        public void Normalize()
        {
            CapacityLiters = Math.Max(0d, CapacityLiters);
            AvailableLiters = Math.Clamp(AvailableLiters, 0d, CapacityLiters);
            ReservedLiters = Math.Clamp(ReservedLiters, 0d, AvailableLiters);
        }

        public double UnreservedLiters => Math.Max(0d, AvailableLiters - ReservedLiters);
    }
}
