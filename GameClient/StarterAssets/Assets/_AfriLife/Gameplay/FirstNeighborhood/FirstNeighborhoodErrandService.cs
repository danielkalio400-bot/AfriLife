using System;
using AfriLife.Economy.Money;
using AfriLife.Player.Needs;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Optional, once-per-day neighborhood errands on the canonical wallet,
    /// player needs and WorldSaveData prototype state. Site proximity is
    /// checked by the scene controller before calling this method.
    /// </summary>
    public sealed class FirstNeighborhoodErrandService
    {
        private readonly FirstNeighborhoodPrototypeLoop _loop;
        public static readonly string[] ErrandIds = {
            "clinic-checkin","market-supplies","park-cleanup","neighbor-help"
        };

        public FirstNeighborhoodErrandService(FirstNeighborhoodPrototypeLoop loop)
        {
            _loop=loop ?? throw new ArgumentNullException(nameof(loop));
        }

        public static string RequiredSite(string errandId)
        {
            switch (errandId)
            {
                case "clinic-checkin":return "clinic";
                case "market-supplies":return "market";
                case "park-cleanup":return "park";
                case "neighbor-help":return "neighbor";
                default:return string.Empty;
            }
        }

        public bool CanCompleteToday(string errandId)
        {
            if (string.IsNullOrEmpty(RequiredSite(errandId))) return false;
            int day=_loop.State.DaysCompleted;
            foreach (FirstNeighborhoodErrandReceipt receipt in _loop.State.ErrandReceipts)
                if(receipt.ErrandId==errandId && receipt.CompletedDay==day)
                    return false;
            return true;
        }

        public bool TryComplete(string errandId, string siteId, string residentId,
            out string message)
        {
            string required=RequiredSite(errandId);
            if(required.Length==0 || required!=siteId)
            {
                message="This errand is not available at the current location.";
                return false;
            }
            if(!CanCompleteToday(errandId))
            {
                message="This errand is already complete for today.";
                return false;
            }

            var player=_loop.SaveData.Player;
            switch(errandId)
            {
                case "clinic-checkin":
                    if(!player.Wallet.TryDebit(new MoneyAmount(CurrencyCode.NGN,120)))
                    {message="Not enough funds for the clinic visit.";return false;}
                    _loop.AdjustNeed(NeedType.Health,5f);
                    break;
                case "market-supplies":
                    if(!player.Wallet.TryDebit(new MoneyAmount(CurrencyCode.NGN,180)))
                    {message="Not enough funds for neighborhood supplies.";return false;}
                    player.Inventory.Add("prototype-neighborhood-supplies",1);
                    break;
                case "park-cleanup":
                    _loop.AdjustNeed(NeedType.Comfort,4f);
                    player.Wallet.Credit(new MoneyAmount(CurrencyCode.NGN,75));
                    break;
                case "neighbor-help":
                    if(!_loop.Residents.TryConversation(residentId,_loop.State,out message))
                        return false;
                    _loop.AdjustNeed(NeedType.Social,5f);
                    break;
            }

            _loop.State.ErrandReceipts.Add(new FirstNeighborhoodErrandReceipt {
                ErrandId=errandId,CompletedDay=_loop.State.DaysCompleted,
                SiteId=required,
                WalletBalanceAfterMinorUnits=player.Wallet.GetMinorUnits(CurrencyCode.NGN)
            });
            message="Finished: "+errandId;
            return true;
        }
    }
}
