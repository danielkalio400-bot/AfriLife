using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AirportState
    {
        public string AirportId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string DisplayName = string.Empty;
        public int TerminalCount;
        public int GateCount;
        public bool Open = true;
    }
}
