using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class DiplomaticMissionState
    {
        public string MissionId = string.Empty;
        public string RepresentedCountryId = string.Empty;
        public string HostCountryId = string.Empty;
        public string CityId = string.Empty;
        public string MissionType = "embassy";
        public bool AcceptingApplications = true;
    }
}
