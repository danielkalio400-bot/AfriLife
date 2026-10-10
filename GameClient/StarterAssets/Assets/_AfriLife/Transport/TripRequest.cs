using System;

namespace AfriLife.Transport
{
    [Serializable]
    public sealed class TripRequest
    {
        public string TripId = string.Empty;
        public string OriginId = string.Empty;
        public string DestinationId = string.Empty;
        public TravelMode Mode;
        public double EstimatedGameMinutes;
        public double DistanceKm;
    }
}
