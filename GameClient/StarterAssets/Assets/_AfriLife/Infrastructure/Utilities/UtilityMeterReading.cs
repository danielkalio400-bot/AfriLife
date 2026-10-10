using System;

namespace AfriLife.Infrastructure.Utilities
{
    [Serializable]
    public sealed class UtilityMeterReading
    {
        public string MeterId = string.Empty;
        public UtilityDependencyType Utility;
        public double PreviousReading;
        public double CurrentReading;
        public long CapturedAtUnixSeconds;

        public double Consumption => Math.Max(0d, CurrentReading - PreviousReading);
    }
}
