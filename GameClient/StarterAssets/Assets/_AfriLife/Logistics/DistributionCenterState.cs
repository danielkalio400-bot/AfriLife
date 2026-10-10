using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class DistributionCenterState
    {
        public string DistributionCenterId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public double ThroughputUnitsPerDay;
        public bool Open = true;
    }
}
