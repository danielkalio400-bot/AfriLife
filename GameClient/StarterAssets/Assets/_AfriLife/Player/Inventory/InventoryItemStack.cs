using System;

namespace AfriLife.Player.Inventory
{
    [Serializable]
    public sealed class InventoryItemStack
    {
        public string ItemId = string.Empty;
        public int Quantity;

        public InventoryItemStack() { }

        public InventoryItemStack(string itemId, int quantity)
        {
            ItemId = itemId ?? string.Empty;
            Quantity = Math.Max(0, quantity);
        }
    }
}
