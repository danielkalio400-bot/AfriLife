using System;

namespace AfriLife.Business.Ownership
{
    [Serializable]
    public sealed class SupplierContract
    {
        public string ContractId = string.Empty;
        public string BusinessId = string.Empty;
        public string SupplierBusinessId = string.Empty;
        public string ProductId = string.Empty;
        public long UnitCostMinorUnits;
        public int QuantityPerDelivery;
        public int DeliveryIntervalDays;
        public bool Active = true;
    }
}
