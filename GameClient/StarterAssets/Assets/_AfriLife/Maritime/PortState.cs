using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class PortState
    {
        public string PortId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string DisplayName = string.Empty;
        public int BerthCapacity;
        public bool PassengerTerminal;
        public bool CargoTerminal;
        public bool Open = true;
    }
}
