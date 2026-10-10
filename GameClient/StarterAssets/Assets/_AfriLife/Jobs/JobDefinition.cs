using System;
using AfriLife.Economy.Money;

namespace AfriLife.Jobs
{
    [Serializable]
    public sealed class JobDefinition
    {
        public string JobId = string.Empty;
        public string EmployerId = string.Empty;
        public string DisplayName = string.Empty;
        public JobType Type;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long PayPerShiftMinorUnits;
        public double ShiftDurationGameHours = 8d;
    }
}
