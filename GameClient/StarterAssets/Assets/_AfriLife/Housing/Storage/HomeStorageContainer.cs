using System;
using AfriLife.Player.Inventory;

namespace AfriLife.Housing.Storage
{
    [Serializable]
    public sealed class HomeStorageContainer
    {
        public string StorageId = string.Empty;
        public string HomeId = string.Empty;
        public string Label = string.Empty;
        public PlayerInventory Inventory = new();
        public int CapacityDistinctItems = 64;
    }
}
