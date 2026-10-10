using System;
using AfriLife.World.Regions;

namespace AfriLife.World.Cities
{
    [Serializable]
    public sealed class CityRuntimeProfile
    {
        public CityId City;
        public string DisplayName = string.Empty;
        public string CountryId = string.Empty;
        public ClimateArchetype Climate;
        public float BaselineTrafficIntensity01 = 0.5f;
        public float BaselinePedestrianIntensity01 = 0.5f;
        public bool Coastal;
        public bool FloodSensitive;
        public bool HarmattanRelevant;
        public string[] PriorityDistrictIds = Array.Empty<string>();
        public string[] PublicTransportTags = Array.Empty<string>();
        public string[] EconomyTags = Array.Empty<string>();

        public void Normalize()
        {
            BaselineTrafficIntensity01 = Math.Clamp(BaselineTrafficIntensity01, 0f, 1f);
            BaselinePedestrianIntensity01 = Math.Clamp(BaselinePedestrianIntensity01, 0f, 1f);
        }
    }
}
