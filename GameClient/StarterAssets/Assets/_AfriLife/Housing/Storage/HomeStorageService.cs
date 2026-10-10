namespace AfriLife.Housing.Storage
{
    public sealed class HomeStorageService
    {
        public bool MoveIntoHome(
            Player.Inventory.PlayerInventory playerInventory,
            HomeStorageContainer storage,
            string itemId,
            int quantity)
        {
            if (playerInventory == null || storage?.Inventory == null || quantity <= 0)
                return false;

            if (storage.Inventory.Count(itemId) == 0 &&
                storage.Inventory.Items.Count >= storage.CapacityDistinctItems)
                return false;

            if (!playerInventory.Remove(itemId, quantity)) return false;
            if (storage.Inventory.Add(itemId, quantity)) return true;

            playerInventory.Add(itemId, quantity);
            return false;
        }
    }
}
