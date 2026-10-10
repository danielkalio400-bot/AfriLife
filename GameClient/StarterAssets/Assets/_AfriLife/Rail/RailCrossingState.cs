using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailCrossingState
    {
        public string CrossingId = string.Empty;
        public string RouteId = string.Empty;
        public string LocationTag = string.Empty;
        public bool OpenToRoadTraffic = true;
        public string Status = "normal";
    }
}
