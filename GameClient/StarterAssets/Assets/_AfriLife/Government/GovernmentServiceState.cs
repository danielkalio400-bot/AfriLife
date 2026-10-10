using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class GovernmentServiceState
    {
        public string ServiceId = string.Empty;
        public string CountryId = string.Empty;
        public string ServiceType = string.Empty;
        public string RegionId = string.Empty;
        public double Capacity01 = 1d;
        public double Availability01 = 1d;
        public bool Open = true;
    }
}
