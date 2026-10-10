using System;
using System.Collections.Generic;
using AfriLife.Economy.Money;
using AfriLife.Player.Inventory;

namespace AfriLife.Core.Save
{
    [Serializable]
    public sealed class PlayerWorldState
    {
        public string CharacterId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string DistrictId = string.Empty;
        public List<NeedValueRecord> Needs = new();
        public PlayerInventory Inventory = new();
        public WalletState Wallet = new();
    }
}
