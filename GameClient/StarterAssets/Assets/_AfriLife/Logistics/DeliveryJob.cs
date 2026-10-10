using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class DeliveryJob
    {
        public string DeliveryId = string.Empty;
        public string OrderId = string.Empty;
        public string OriginWarehouseId = string.Empty;
        public string DestinationId = string.Empty;
        public string DriverNpcId = string.Empty;
        public string VehicleId = string.Empty;
        public DeliveryState State = DeliveryState.Pending;
        public double DistanceKm;
        public double ProgressKm;

        public float Progress01 =>
            DistanceKm <= 0d ? (State == DeliveryState.Delivered ? 1f : 0f) :
            (float)Math.Clamp(ProgressKm / DistanceKm, 0d, 1d);
    }
}
