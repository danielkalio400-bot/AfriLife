using System;
using System.Collections.Generic;

namespace AfriLife.World.Neighborhood
{
    [Serializable]
    public sealed class NeighborhoodState
    {
        public string NeighborhoodId = string.Empty;
        public string CityId = string.Empty;
        public string DistrictId = string.Empty;
        public List<NeighborhoodServicePoint> Services = new();
        public int ResidentPopulation;
        public int ActivePedestrians;
        public int ActiveVehicles;
        public float SafetyIndex = 75f;
        public float CleanlinessIndex = 75f;

        public void Normalize()
        {
            ResidentPopulation = Math.Max(0, ResidentPopulation);
            ActivePedestrians = Math.Max(0, ActivePedestrians);
            ActiveVehicles = Math.Max(0, ActiveVehicles);
            SafetyIndex = Math.Clamp(SafetyIndex, 0f, 100f);
            CleanlinessIndex = Math.Clamp(CleanlinessIndex, 0f, 100f);
        }
    }
}
