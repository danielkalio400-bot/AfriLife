using System;
using System.Collections.Generic;

namespace AfriLife.Economy.Fuel
{
    [Serializable]
    public sealed class FuelStationRuntimeState
    {
        public string StationId = string.Empty;
        public string NeighborhoodId = string.Empty;
        public List<FuelInventoryState> Inventories = new();
        public bool Open = true;
        public float PowerAvailability01 = 1f;
        public int ActiveQueues;

        public void Normalize()
        {
            PowerAvailability01 = Math.Clamp(PowerAvailability01, 0f, 1f);
            ActiveQueues = Math.Max(0, ActiveQueues);
            foreach (var inventory in Inventories)
                inventory?.Normalize();
        }
    }
}
