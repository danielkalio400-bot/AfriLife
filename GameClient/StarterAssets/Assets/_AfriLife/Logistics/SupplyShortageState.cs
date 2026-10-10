using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class SupplyShortageState
    {
        public string ShortageId = string.Empty;
        public string RegionId = string.Empty;
        public string ItemId = string.Empty;
        public double Severity01;
        public string CauseTag = string.Empty;
        public bool Resolved;
    }
}
