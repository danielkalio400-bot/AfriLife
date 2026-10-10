using System;
using System.Collections.Generic;
using AfriLife.Economy.Banking;
using AfriLife.Economy.Money;
using AfriLife.Education;
using AfriLife.Housing.Bills;
using AfriLife.Jobs;
using AfriLife.Phone;
using AfriLife.Player.Character;
using AfriLife.Player.Inventory;
using AfriLife.Transport;
using AfriLife.Transport.Vehicles;

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
        public List<BankAccountState> BankAccounts = new();
        public EducationState Education = new();
        public EmploymentState Employment = new();
        public MobilePhoneState Phone = new();
        public List<BillState> Bills = new();
        public List<VehicleOwnershipState> Vehicles = new();
        public TripProgress ActiveTrip = new();
    }
}
