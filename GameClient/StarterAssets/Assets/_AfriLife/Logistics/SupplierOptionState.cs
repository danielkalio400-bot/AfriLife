using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class SupplierOptionState
    {
        public string SupplierId = string.Empty;
        public string ItemId = string.Empty;
        public string CountryId = string.Empty;
        public double AvailableUnits;
        public long UnitPriceMinorUnits;
        public bool Active = true;
    }
}
