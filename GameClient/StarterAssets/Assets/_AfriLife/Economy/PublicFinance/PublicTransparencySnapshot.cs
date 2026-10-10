using System;

namespace AfriLife.Economy.PublicFinance
{
    [Serializable]
    public sealed class PublicTransparencySnapshot
    {
        public string SnapshotId = string.Empty;
        public string CountryId = string.Empty;
        public long GovernmentRevenueBalanceMinorUnits;
        public long SovereignReserveBalanceMinorUnits;
        public long CitizenDividendBalanceMinorUnits;
        public long TotalDividendPaidMinorUnits;
        public int DividendRecipientCount;
        public long GeneratedAtUnixSeconds;
    }
}
