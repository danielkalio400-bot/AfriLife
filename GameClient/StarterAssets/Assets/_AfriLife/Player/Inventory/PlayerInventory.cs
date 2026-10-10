using System;
using System.Collections.Generic;

namespace AfriLife.Player.Inventory
{
    [Serializable]
    public sealed class PlayerInventory
    {
        public List<InventoryItemStack> Items = new();

        public int Count(string itemId)
        {
            var stack = Items.Find(item => item.ItemId == itemId);
            return stack?.Quantity ?? 0;
        }

        public bool Add(string itemId, int quantity)
        {
            if (string.IsNullOrWhiteSpace(itemId) || quantity <= 0) return false;

            var stack = Items.Find(item => item.ItemId == itemId);
            if (stack == null)
            {
                Items.Add(new InventoryItemStack(itemId, quantity));
            }
            else
            {
                stack.Quantity += quantity;
            }
            return true;
        }

        public bool Remove(string itemId, int quantity)
        {
            if (string.IsNullOrWhiteSpace(itemId) || quantity <= 0) return false;

            var stack = Items.Find(item => item.ItemId == itemId);
            if (stack == null || stack.Quantity < quantity) return false;

            stack.Quantity -= quantity;
            if (stack.Quantity == 0) Items.Remove(stack);
            return true;
        }
    }
}
