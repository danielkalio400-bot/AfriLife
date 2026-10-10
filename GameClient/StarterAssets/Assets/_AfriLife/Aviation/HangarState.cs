using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class HangarState
    {
        public string HangarId = string.Empty;
        public string AirportId = string.Empty;
        public int Capacity;
        public int Occupied;
    }
}
