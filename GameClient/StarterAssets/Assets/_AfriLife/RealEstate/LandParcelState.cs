using System;

namespace AfriLife.RealEstate
{
    [Serializable]
    public sealed class LandParcelState
    {
        public string ParcelId = string.Empty;
        public string NeighborhoodId = string.Empty;
        public double AreaSquareMeters;
        public string ZoningTag = string.Empty;
        public bool ServicedByRoad;
        public bool GridConnectionAvailable;
        public bool WaterConnectionAvailable;
        public bool Buildable = true;

        public void Normalize()
        {
            AreaSquareMeters = Math.Max(0d, AreaSquareMeters);
        }
    }
}
