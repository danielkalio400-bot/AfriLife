using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class WardState
    {
        public string WardId = string.Empty;
        public string FacilityId = string.Empty;
        public string WardType = "general";
        public int BedCapacity;
        public int OccupiedBeds;

        public void Normalize()
        {
            BedCapacity = Math.Max(0, BedCapacity);
            OccupiedBeds = Math.Clamp(OccupiedBeds, 0, BedCapacity);
        }
    }
}
