using System;

namespace AfriLife.Justice.FinancialCrime
{
    [Serializable]
    public sealed class AssetFreezeOrder
    {
        public string OrderId = string.Empty;
        public string CaseId = string.Empty;
        public string AssetId = string.Empty;
        public string LegalAuthorityRef = string.Empty;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;
        public bool Active;
    }
}
