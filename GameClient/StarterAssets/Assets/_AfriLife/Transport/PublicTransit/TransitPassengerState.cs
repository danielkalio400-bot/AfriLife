using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class TransitPassengerState
    {
        public string PassengerId = string.Empty;
        public string OriginStopId = string.Empty;
        public string DestinationStopId = string.Empty;
        public string CurrentVehicleId = string.Empty;
        public int MaximumWaitMinutes = 30;
        public int WaitedMinutes;
        public bool Boarded;
        public bool CompletedTrip;
    }
}
