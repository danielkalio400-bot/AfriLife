using System;

namespace AfriLife.World.Neighborhood
{
    [Serializable]
    public sealed class NeighborhoodServicePoint
    {
        public string ServiceId = string.Empty;
        public NeighborhoodServiceType Type;
        public string DistrictId = string.Empty;
        public bool Open = true;
        public int Capacity = 10;
    }
}
