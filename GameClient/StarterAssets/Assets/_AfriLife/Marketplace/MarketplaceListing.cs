using System;
using AfriLife.Economy.Money;

namespace AfriLife.Marketplace
{
    [Serializable]
    public sealed class MarketplaceListing
    {
        public string ListingId = string.Empty;
        public string SellerId = string.Empty;
        public string ProductId = string.Empty;
        public string Title = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long UnitPriceMinorUnits;
        public int AvailableQuantity;
        public string WarehouseId = string.Empty;
        public bool Active = true;

        public void Normalize()
        {
            UnitPriceMinorUnits = Math.Max(0L, UnitPriceMinorUnits);
            AvailableQuantity = Math.Max(0, AvailableQuantity);
            if (AvailableQuantity == 0) Active = false;
        }
    }
}
