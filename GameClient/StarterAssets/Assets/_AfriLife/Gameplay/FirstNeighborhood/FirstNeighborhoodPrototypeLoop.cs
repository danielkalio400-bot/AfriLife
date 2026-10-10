using System;
using System.Collections.Generic;
using AfriLife.Core.Save;
using AfriLife.Core.Time;
using AfriLife.Economy.Money;
using AfriLife.Housing.Bills;
using AfriLife.Player.Interaction;
using AfriLife.Player.Needs;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Sequential first-neighborhood vertical-slice controller. It reuses the
    /// canonical player world wallet, phone, inventory, needs and local save.
    /// No grants/rankings/production economic balances are generated.
    /// </summary>
    public sealed class FirstNeighborhoodPrototypeLoop
    {
        public static readonly string[] Steps = {
            "wake","shower","dress","eat","use-phone","buy-mobile-data",
            "travel-or-drive","work","earn-money","shop","exercise",
            "interact-with-persistent-npcs","pay-bills","return-home",
            "sit-or-lie-down","sleep","save-and-reload"
        };

        private static readonly MoneyAmount DataCost = new(CurrencyCode.NGN, 200);
        private static readonly MoneyAmount ShoppingCost = new(CurrencyCode.NGN, 350);
        private static readonly MoneyAmount WorkPay = new(CurrencyCode.NGN, 900);
        private const string GroceryItemId = "prototype-groceries";
        private const string MealItemId = "prototype-meal";
        private const long InitialFunds = 5000;

        private readonly WorldSaveData _save;
        private readonly NeedsState _needs = new();
        private readonly InteractionExecutor _interactions = DefaultInteractionRegistry.Create();
        private readonly GameClock _clock = new();
        private readonly FirstNeighborhoodResidentService _residents;

        public FirstNeighborhoodResidentService Residents => _residents;

        public WorldSaveData SaveData => _save;
        public FirstNeighborhoodPrototypeState State => _save.FirstNeighborhoodPrototype;
        public string CurrentStep => State.NextStep < Steps.Length ? Steps[State.NextStep] : "complete";
        public long CashMinorUnits => _save.Player.Wallet.GetMinorUnits(CurrencyCode.NGN);
        public int CompletedDays => State.DaysCompleted;

        private sealed class SimpleTarget : IInteractable
        {
            public string InteractionId => "first-neighborhood-training-object";
            public IReadOnlyList<InteractionType> GetAvailableInteractions() =>
                new[] {InteractionType.Shower,InteractionType.Eat,InteractionType.Sleep};
            public bool CanInteract(InteractionType type) =>
                type == InteractionType.Shower || type == InteractionType.Eat ||
                type == InteractionType.Sleep;
        }

        public FirstNeighborhoodPrototypeLoop(WorldSaveData save)
        {
            _save = save ?? throw new ArgumentNullException(nameof(save));
            _save.Normalize();
            // This is deliberately a Lagos-only authored blockout. Never
            // convert another Nigerian city or a Ghana world save silently.
            if ((!string.IsNullOrWhiteSpace(_save.Player.CountryId) &&
                 _save.Player.CountryId!="Nigeria") ||
                (!string.IsNullOrWhiteSpace(_save.Player.CityId) &&
                 _save.Player.CityId!="Lagos") ||
                (_save.FirstNeighborhoodPrototype!=null &&
                 _save.FirstNeighborhoodPrototype.ScenarioId!=
                 "lagos-first-district-prototype"))
                throw new InvalidOperationException(
                    "The Lagos first-neighborhood prototype cannot overwrite another world location.");
            _residents = new FirstNeighborhoodResidentService(_save);
            _save.FirstNeighborhoodPrototype ??= new FirstNeighborhoodPrototypeState();
            State.Normalize(Steps.Length);
            _residents.AdvanceSchedule(State.ElapsedWorldSeconds);
            _save.Player.CountryId = "Nigeria";
            if (string.IsNullOrWhiteSpace(_save.Player.CityId))
                _save.Player.CityId = "Lagos";
            if (string.IsNullOrWhiteSpace(_save.Player.DistrictId))
                _save.Player.DistrictId = "prototype-district";
            _save.Player.CharacterId = string.IsNullOrWhiteSpace(_save.Player.CharacterId)
                ? Guid.NewGuid().ToString("N") : _save.Player.CharacterId;
            _save.Header.PlayerCharacterId = _save.Player.CharacterId;
            foreach (NeedValueRecord item in _save.Player.Needs)
                if(item != null) _needs.Set(item.Type,item.Value);
            // Seed funds and a meal ONLY on newly created demo saves.
            if(!State.Started)
            {
                _save.Player.Wallet.Credit(new MoneyAmount(CurrencyCode.NGN,InitialFunds));
                _save.Player.Inventory.Add(MealItemId,1);
                State.Started = true;
                StoreNeeds();
            }
        }

        public bool TryAdvance(out string message, string nearbyResidentId = null)
        {
            if(State.NextStep >= Steps.Length)
            {
                message = "Day completed. Use BeginNextDay.";
                return false;
            }

            string step = Steps[State.NextStep];
            string loc = State.CurrentLocation;
            var player = _save.Player;
            switch(step)
            {
                case "wake":
                    State.CurrentLocation="home";
                    player.Character.IsSleeping=false;
                    break;
                case "shower":
                    if(!Execute(InteractionType.Shower,out message)) return false;
                    break;
                case "dress":
                    if(loc!="home") {message="Return home to dress.";return false;}
                    _needs.Adjust(NeedType.Comfort,5f);
                    break;
                case "eat":
                    if(player.Inventory.Count(MealItemId)<1)
                    {message="Meal unavailable.";return false;}
                    if(!Execute(InteractionType.Eat,out message))return false;
                    player.Inventory.Remove(MealItemId,1);
                    break;
                case "use-phone":
                    if(loc!="home") {message="Phone demo requires home.";return false;}
                    player.Phone.DeviceId="prototype-phone";
                    player.Phone.ProviderId="fictional-local-provider";
                    break;
                case "buy-mobile-data":
                    if(!player.Wallet.TryDebit(DataCost))
                    {message="Insufficient funds for data.";return false;}
                    player.Phone.RemainingDataMegabytes+=100;
                    player.Phone.DataExpiryUnixSeconds=DateTimeOffset.UtcNow.ToUnixTimeSeconds()+86400;
                    break;
                case "travel-or-drive":
                    State.CurrentLocation="market-workplace";
                    State.ElapsedWorldSeconds+=1200;
                    break;
                case "work":
                    if(loc!="market-workplace"){message="Travel to work first.";return false;}
                    player.Character.IsAtWork=true;
                    State.ElapsedWorldSeconds+=14400;
                    player.Employment.JobId="prototype-neighborhood-job";
                    player.Employment.EmployerId="fictional-local-employer";
                    player.Employment.CompletedShifts++;
                    break;
                case "earn-money":
                    if(!player.Character.IsAtWork){message="Work not completed.";return false;}
                    player.Wallet.Credit(WorkPay);
                    player.Character.IsAtWork=false;
                    break;
                case "shop":
                    if(loc!="market-workplace"){message="Go to the neighborhood shop.";return false;}
                    if(!player.Wallet.TryDebit(ShoppingCost))
                    {message="Insufficient funds for groceries.";return false;}
                    player.Inventory.Add(GroceryItemId,1);
                    break;
                case "exercise":
                    _needs.Adjust(NeedType.Fitness,10f);
                    _needs.Adjust(NeedType.Energy,-8f);
                    break;
                case "interact-with-persistent-npcs":
                    if (!_residents.TryConversation(nearbyResidentId,State,out message))
                        return false;
                    _needs.Adjust(NeedType.Social,5f);
                    break;
                case "pay-bills":
                    if(!player.Wallet.TryDebit(new MoneyAmount(CurrencyCode.NGN,400)))
                    {message="Insufficient balance to pay bill.";return false;}
                    player.Bills.Add(new BillState {
                        BillId="prototype-day-"+State.DaysCompleted,
                        Currency=CurrencyCode.NGN,AmountMinorUnits=400,Paid=true
                    });
                    break;
                case "return-home":
                    State.CurrentLocation="home";
                    State.ElapsedWorldSeconds+=1200;
                    break;
                case "sit-or-lie-down":
                    if(loc!="home"){message="Go home before resting.";return false;}
                    _needs.Adjust(NeedType.Comfort,5f);
                    break;
                case "sleep":
                    if(loc!="home"){message="Must be at home to sleep.";return false;}
                    if(!Execute(InteractionType.Sleep,out message))return false;
                    State.ElapsedWorldSeconds+=28800;
                    player.Character.IsSleeping=true;
                    break;
                case "save-and-reload":
                    // Caller must invoke Save() and Reload() to certify
                    // persistence; this action is intentionally not auto-passed.
                    message="Save and reload to complete the day.";
                    return false;
            }

            State.NextStep++;
            var completed = new List<string>(State.CompletedSteps) {step};
            State.CompletedSteps=completed.ToArray();
            StoreNeeds();
            _residents.AdvanceSchedule(State.ElapsedWorldSeconds);
            message="Completed: "+step;
            return true;
        }

        public bool CompleteAfterVerifiedReload(out string message)
        {
            if(CurrentStep!="save-and-reload")
            {message="Save and reload is not the current action.";return false;}
            State.NextStep=Steps.Length;
            var completed=new List<string>(State.CompletedSteps){"save-and-reload"};
            State.CompletedSteps=completed.ToArray();
            State.DaysCompleted++;
            message="Demo day completed after successful reload.";
            return true;
        }

        public bool BeginNextDay()
        {
            if(State.NextStep!=Steps.Length)return false;
            // CompleteAfterVerifiedReload increases the saved day number.
            // The next playable day begins at 06:00, not at the previous
            // evening's fractional clock position.
            State.ElapsedWorldSeconds=FirstNeighborhoodWorldClock.BeginNextDay(
                State.ElapsedWorldSeconds);
            State.WaitingSessionsDay=State.DaysCompleted;
            State.WaitingSessionsToday=0;
            _residents.AdvanceSchedule(State.ElapsedWorldSeconds);
            State.NextStep=0;
            State.CompletedSteps=Array.Empty<string>();
            State.CurrentLocation="home";
            _save.Player.Inventory.Add(MealItemId,1);
            return true;
        }

        private bool Execute(InteractionType action,out string message)
        {
            var result=_interactions.Execute(action,new InteractionContext {
                ActorId=_save.Player.CharacterId,Clock=_clock,
                Needs=_needs,Inventory=_save.Player.Inventory,
                Wallet=_save.Player.Wallet
            },new SimpleTarget());
            message=result.MessageKey;
            return result.Success;
        }

        // Single needs authority: side activities update the same buffered
        // NeedsState used by the scripted daily-life actions and world save.
        public void AdjustNeed(NeedType type, float delta)
        {
            _needs.Adjust(type, delta);
            StoreNeeds();
        }

        private void StoreNeeds()
        {
            _save.Player.Needs.Clear();
            foreach(var entry in _needs.Snapshot())
                _save.Player.Needs.Add(new NeedValueRecord {Type=entry.Key,Value=entry.Value});
        }
    }
}
