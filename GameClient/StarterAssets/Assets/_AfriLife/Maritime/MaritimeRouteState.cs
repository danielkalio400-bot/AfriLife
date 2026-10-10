using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class MaritimeRouteState
    {
        public string RouteId = string.Empty;
        public string OriginPortId = string.Empty;
        public string DestinationPortId = string.Empty;
        public double DistanceKilometers;
        public bool PassengerAllowed = true;
        public bool CargoAllowed = true;
    }
}
