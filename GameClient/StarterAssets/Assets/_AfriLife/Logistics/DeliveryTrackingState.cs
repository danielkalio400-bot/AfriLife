using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class DeliveryTrackingState
    {
        public string DeliveryId = string.Empty;
        public string MovementId = string.Empty;
        public string Status = "created";
        public string CurrentNodeId = string.Empty;
        public double Progress01;
        public long UpdatedAtUnixSeconds;
    }
}
