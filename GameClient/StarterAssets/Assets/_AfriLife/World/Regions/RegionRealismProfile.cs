using System;

namespace AfriLife.World.Regions
{
    [Serializable]
    public sealed class RegionRealismProfile
    {
        public string RegionId = string.Empty;
        public string CountryId = string.Empty;
        public ClimateArchetype Climate;
        public bool FloodSensitive;
        public bool Coastal;
        public bool HarmattanRelevant;
        public float BaselineTrafficIntensity01 = 0.5f;
        public float BaselinePedestrianIntensity01 = 0.5f;
        public string[] RoadEnvironmentTags = Array.Empty<string>();
        public string[] EconomyTags = Array.Empty<string>();
    }
}
