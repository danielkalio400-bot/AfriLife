using System;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    [Serializable]
    public sealed class FirstNeighborhoodErrandReceipt
    {
        public string ErrandId = string.Empty;
        public int CompletedDay;
        public long WalletBalanceAfterMinorUnits;
        public string SiteId = string.Empty;
    }
}
