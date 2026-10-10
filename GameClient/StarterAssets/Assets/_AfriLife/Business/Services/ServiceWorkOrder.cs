using System;

namespace AfriLife.Business.Services
{
    [Serializable]
    public sealed class ServiceWorkOrder
    {
        public string WorkOrderId = string.Empty;
        public string BusinessId = string.Empty;
        public string CustomerEntityId = string.Empty;
        public string AssetId = string.Empty;
        public MaintenanceServiceType Type;
        public float Progress01;
        public int AssignedWorkers;
        public long PriceMinorUnits;
        public bool Completed;

        public void Normalize()
        {
            Progress01 = Math.Clamp(Progress01, 0f, 1f);
            AssignedWorkers = Math.Max(0, AssignedWorkers);
            PriceMinorUnits = Math.Max(0L, PriceMinorUnits);
            Completed = Progress01 >= 1f;
        }
    }
}
