using System;

namespace AfriLife.Economy.Fuel
{
    public sealed class FuelFlowService
    {
        public bool Transfer(FuelInventoryState source, FuelInventoryState destination, double liters)
        {
            if (source == null || destination == null || source.Type != destination.Type || liters <= 0d)
                return false;

            source.Normalize();
            destination.Normalize();

            double amount = Math.Min(liters, Math.Min(
                source.UnreservedLiters,
                Math.Max(0d, destination.CapacityLiters - destination.AvailableLiters)));

            if (amount <= 0d) return false;
            source.AvailableLiters -= amount;
            destination.AvailableLiters += amount;
            return true;
        }

        public double ReleaseReserve(StrategicFuelReserveState reserve, FuelInventoryState destination, double requestedLiters)
        {
            if (reserve == null || destination == null || requestedLiters <= 0d)
                return 0d;
            reserve.Normalize();
            destination.Normalize();
            if ((int)reserve.Fuel != (int)destination.Type) return 0d;

            double releasable = Math.Max(0d, reserve.StoredLiters - reserve.MinimumTargetLiters);
            double capacity = Math.Max(0d, destination.CapacityLiters - destination.AvailableLiters);
            double amount = Math.Min(requestedLiters, Math.Min(releasable, capacity));
            reserve.StoredLiters -= amount;
            destination.AvailableLiters += amount;
            return amount;
        }
    }
}
