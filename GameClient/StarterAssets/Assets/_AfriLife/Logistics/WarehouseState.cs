using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class WarehouseState
    {
        public string WarehouseId = string.Empty;
        public string BusinessId = string.Empty;
        public string CityId = string.Empty;
        public int CapacityUnits;
        public int UsedUnits;
        public bool Open = true;

        public void Normalize()
        {
            CapacityUnits = Math.Max(0, CapacityUnits);
            UsedUnits = Math.Clamp(UsedUnits, 0, CapacityUnits);
        }

        public int AvailableUnits => Math.Max(0, CapacityUnits - UsedUnits);
    }
}
