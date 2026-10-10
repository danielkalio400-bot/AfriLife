using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class PublicTransitVehicleState
    {
        public string VehicleId = string.Empty;
        public string RouteId = string.Empty;
        public string CurrentStopId = string.Empty;
        public int Capacity = 20;
        public int Passengers;
        public int DelayMinutes;
        public bool InService = true;

        public void Normalize()
        {
            Capacity = Math.Max(1, Capacity);
            Passengers = Math.Clamp(Passengers, 0, Capacity);
            DelayMinutes = Math.Max(0, DelayMinutes);
        }
    }
}
