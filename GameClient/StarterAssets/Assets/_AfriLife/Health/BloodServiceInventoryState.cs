using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class BloodServiceInventoryState
    {
        public string FacilityId = string.Empty;
        public int AvailableUnits;
        public int ReservedUnits;
        public int ReorderThreshold;

        public void Normalize()
        {
            AvailableUnits = Math.Max(0, AvailableUnits);
            ReservedUnits = Math.Clamp(ReservedUnits, 0, AvailableUnits);
            ReorderThreshold = Math.Max(0, ReorderThreshold);
        }
    }
}
