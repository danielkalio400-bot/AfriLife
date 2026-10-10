using System;

namespace AfriLife.Infrastructure.Energy
{
    [Serializable]
    public sealed class EnergyMaintenanceState
    {
        public string AssetId = string.Empty;
        public string AssetType = string.Empty;
        public double ServiceIntervalHours = 100d;
        public double HoursSinceService;
        public bool ServiceDue => ServiceIntervalHours > 0d && HoursSinceService >= ServiceIntervalHours;
    }
}
