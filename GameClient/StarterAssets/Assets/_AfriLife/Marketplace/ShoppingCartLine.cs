using System;

namespace AfriLife.Marketplace
{
    [Serializable]
    public sealed class ShoppingCartLine
    {
        public string ListingId = string.Empty;
        public int Quantity = 1;

        public void Normalize() => Quantity = Math.Max(1, Quantity);
    }
}
