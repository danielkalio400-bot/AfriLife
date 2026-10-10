using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class WarehouseState
    {
        public string WarehouseId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string DisplayName = string.Empty;
        public double CapacityUnits;
        public double OccupiedUnits;
        public bool Open = true;
    }
}
