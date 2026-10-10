using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class MedicalSupplyShipment
    {
        public string ShipmentId = string.Empty;
        public string SupplierBusinessId = string.Empty;
        public string DestinationFacilityId = string.Empty;
        public string SupplyCategory = string.Empty;
        public int Quantity;
        public string Status = "pending";
        public long ExpectedAtUnixSeconds;

        public void Normalize()
        {
            Quantity = Math.Max(0, Quantity);
        }
    }
}
