using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailStationState
    {
        public string StationId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string DisplayName = string.Empty;
        public int PlatformCount;
        public bool PassengerService = true;
        public bool FreightService;
        public bool Open = true;
    }
}
