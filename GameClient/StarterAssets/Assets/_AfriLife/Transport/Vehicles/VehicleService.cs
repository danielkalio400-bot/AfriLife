using System;

namespace AfriLife.Transport.Vehicles
{
    public sealed class VehicleService
    {
        public bool ConsumeFuel(VehicleOwnershipState vehicle, double liters)
        {
            if (vehicle == null || liters <= 0d || vehicle.FuelLiters < liters)
                return false;

            vehicle.FuelLiters -= liters;
            return true;
        }

        public bool Refuel(VehicleOwnershipState vehicle, double liters)
        {
            if (vehicle == null || liters <= 0d) return false;

            double capacity = Math.Max(0d, vehicle.FuelCapacityLiters);
            if (capacity <= 0d) return false;

            vehicle.FuelLiters = Math.Min(capacity, vehicle.FuelLiters + liters);
            return true;
        }

        public void AddMileage(VehicleOwnershipState vehicle, double distanceKm)
        {
            if (vehicle == null || distanceKm <= 0d) return;
            vehicle.MileageKm += distanceKm;
            float wear = (float)Math.Min(1.5d, distanceKm * 0.005d);
            vehicle.Condition.Engine -= wear * 0.5f;
            vehicle.Condition.Tires -= wear;
            vehicle.Condition.Brakes -= wear * 0.4f;
            vehicle.Condition.Suspension -= wear * 0.35f;
            vehicle.Condition.Normalize();
        }
    }
}
