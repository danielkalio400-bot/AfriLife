using System;

namespace AfriLife.NPC
{
    [Serializable]
    public sealed class NpcProfile
    {
        public string Id = string.Empty;
        public string DisplayName = string.Empty;
        public string HomeId = string.Empty;
        public string EmployerId = string.Empty;
        public string CurrentCityId = string.Empty;
        public float Reputation;
        public float Health = 100f;
        public float Energy = 100f;
    }
}
