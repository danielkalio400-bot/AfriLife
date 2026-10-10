using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailDepotState
    {
        public string DepotId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public int Capacity;
        public int Occupied;
        public bool RepairFacility;
    }
}
