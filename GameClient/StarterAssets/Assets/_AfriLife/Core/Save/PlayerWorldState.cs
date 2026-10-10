using System;
using System.Collections.Generic;
using AfriLife.Economy.Money;
using AfriLife.Housing.Bills;
using AfriLife.Jobs;
using AfriLife.Phone;
using AfriLife.Player.Character;
using AfriLife.Player.Inventory;
using AfriLife.Transport;

namespace AfriLife.Core.Save
{
    [Serializable]
    public sealed class PlayerWorldState
    {
        public string CharacterId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string DistrictId = string.Empty;
        public PlayerCharacterState Character = new();
        public List<NeedValueRecord> Needs = new();
        public PlayerInventory Inventory = new();
        public WalletState Wallet = new();
        public EmploymentState Employment = new();
        public MobilePhoneState Phone = new();
        public List<BillState> Bills = new();
        public TripProgress ActiveTrip = new();
    }
}
