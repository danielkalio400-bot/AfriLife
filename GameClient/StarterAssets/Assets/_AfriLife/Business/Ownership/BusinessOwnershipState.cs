using System;
using System.Collections.Generic;

namespace AfriLife.Business.Ownership
{
    [Serializable]
    public sealed class BusinessOwnershipState
    {
        public string BusinessId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public string LegalName = string.Empty;
        public string CountryId = string.Empty;
        public BusinessType Type;
        public long CashMinorUnits;
        public float Reputation01 = 0.5f;
        public bool Registered;
        public List<string> BranchIds = new();

        public void Normalize()
        {
            CashMinorUnits = Math.Max(0L, CashMinorUnits);
            Reputation01 = Math.Clamp(Reputation01, 0f, 1f);
        }
    }
}
