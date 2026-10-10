using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AircraftInteriorZone
    {
        public string ZoneId = string.Empty;
        public string AircraftId = string.Empty;
        public string ZoneType = "cabin";
        public int SeatCount;
    }
}
