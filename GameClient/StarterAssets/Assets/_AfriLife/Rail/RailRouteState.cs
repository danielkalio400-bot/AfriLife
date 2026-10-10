using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailRouteState
    {
        public string RouteId = string.Empty;
        public string OriginStationId = string.Empty;
        public string DestinationStationId = string.Empty;
        public double DistanceKilometers;
        public bool PassengerAllowed = true;
        public bool FreightAllowed = true;
    }
}
