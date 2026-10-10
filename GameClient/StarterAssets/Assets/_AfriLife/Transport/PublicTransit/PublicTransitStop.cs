using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class PublicTransitStop
    {
        public string StopId = string.Empty;
        public string DisplayName = string.Empty;
        public string CityId = string.Empty;
        public string DistrictId = string.Empty;
        public bool Sheltered;
        public int PlatformCapacity = 30;
    }
}
