using System;
using AfriLife.Economy.Money;

namespace AfriLife.Shopping
{
    [Serializable]
    public sealed class ProductDefinition
    {
        public string ProductId = string.Empty;
        public string DisplayName = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long PriceMinorUnits;
        public string InventoryItemId = string.Empty;
        public int Quantity = 1;
    }
}
