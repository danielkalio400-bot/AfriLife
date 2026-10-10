using System;

namespace AfriLife.Player.Character
{
    [Serializable]
    public sealed class PlayerCharacterState
    {
        public string CharacterId = string.Empty;
        public string DisplayName = string.Empty;
        public string CurrentHomeId = string.Empty;
        public string CurrentEmployerId = string.Empty;
        public string CurrentCityId = string.Empty;
        public string CurrentDistrictId = string.Empty;
        public bool IsSleeping;
        public bool IsAtWork;
        public bool IsInVehicle;
    }
}
