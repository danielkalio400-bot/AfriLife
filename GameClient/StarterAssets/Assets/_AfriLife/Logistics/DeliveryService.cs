using System;

namespace AfriLife.Logistics
{
    public sealed class DeliveryService
    {
        public bool Assign(DeliveryJob job, string driverNpcId, string vehicleId)
        {
            if (job == null || job.State != DeliveryState.Pending ||
                string.IsNullOrWhiteSpace(driverNpcId) || string.IsNullOrWhiteSpace(vehicleId))
                return false;

            job.DriverNpcId = driverNpcId;
            job.VehicleId = vehicleId;
            job.State = DeliveryState.Assigned;
            return true;
        }

        public void Advance(DeliveryJob job, double distanceKm)
        {
            if (job == null || distanceKm <= 0d) return;
            if (job.State != DeliveryState.InTransit && job.State != DeliveryState.PickedUp)
                return;

            job.State = DeliveryState.InTransit;
            job.ProgressKm = Math.Min(Math.Max(0d, job.DistanceKm), job.ProgressKm + distanceKm);
            if (job.DistanceKm <= 0d || job.ProgressKm >= job.DistanceKm)
                job.State = DeliveryState.Delivered;
        }
    }
}
