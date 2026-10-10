using System;

namespace AfriLife.Transport.Vehicles
{
    public sealed class VehicleMaintenanceService
    {
        public void Service(VehicleOwnershipState vehicle, float restoration)
        {
            if (vehicle == null || restoration <= 0f) return;

            vehicle.Condition.Engine = Math.Min(100f, vehicle.Condition.Engine + restoration);
            vehicle.Condition.Brakes = Math.Min(100f, vehicle.Condition.Brakes + restoration);
            vehicle.Condition.Tires = Math.Min(100f, vehicle.Condition.Tires + restoration);
            vehicle.Condition.Suspension = Math.Min(100f, vehicle.Condition.Suspension + restoration);
            vehicle.Condition.Battery = Math.Min(100f, vehicle.Condition.Battery + restoration);
            vehicle.Condition.Normalize();
        }
    }
}
