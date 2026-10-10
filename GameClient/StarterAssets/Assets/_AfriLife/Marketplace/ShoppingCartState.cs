using System;
using System.Collections.Generic;

namespace AfriLife.Marketplace
{
    [Serializable]
    public sealed class ShoppingCartState
    {
        public string CartId = string.Empty;
        public string BuyerEntityId = string.Empty;
        public List<ShoppingCartLine> Lines = new();

        public int TotalUnits()
        {
            int total = 0;
            foreach (var line in Lines)
            {
                if (line == null) continue;
                line.Normalize();
                total += line.Quantity;
            }
            return total;
        }
    }
}
