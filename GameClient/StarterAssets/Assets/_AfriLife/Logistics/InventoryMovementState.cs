using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class InventoryMovementState
    {
        public string MovementId = string.Empty;
        public string ItemId = string.Empty;
        public double Quantity;
        public string OriginNodeId = string.Empty;
        public string DestinationNodeId = string.Empty;
        public string TransportMode = string.Empty;
        public string Status = "planned";
        public long CreatedAtUnixSeconds;
    }
}
