using System;
using AfriLife.Economy.Money;

namespace AfriLife.World.Countries
{
    [Serializable]
    public sealed class CountryRuntimeProfile
    {
        public CountryId Country;
        public string DisplayName = string.Empty;
        public CurrencyCode Currency;
        public TrafficSide TrafficSide = TrafficSide.Right;
        public string[] PriorityCityIds = Array.Empty<string>();
        public string[] ClimateArchetypes = Array.Empty<string>();
        public string[] PublicTransportArchetypes = Array.Empty<string>();
        public string[] UtilitySimulationTags = Array.Empty<string>();
        public string[] TelecomSimulationTags = Array.Empty<string>();
    }
}
