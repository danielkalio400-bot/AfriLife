using System;

namespace AfriLife.World.Cities
{
    // Planning data only. The Unity scenes do not exist or stream yet.
    [Serializable]
    public sealed class NigeriaExpansionCityPlan
    {
        public string cityId = string.Empty;
        public string countryId = "Nigeria";
        public string climate = string.Empty;
        public string currency = "NGN";
        public string[] transportTags = Array.Empty<string>();
        public string[] economyTags = Array.Empty<string>();
        public string[] districtArchetypes = Array.Empty<string>();
        public string[] weatherTags = Array.Empty<string>();
        public bool actualUnitySceneValidated;
        public bool activeWorldCity;

        public bool CanShowAsPlayable()
        {
            return actualUnitySceneValidated && activeWorldCity;
        }
    }
}
