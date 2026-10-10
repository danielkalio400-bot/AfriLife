using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class PermitRecord
    {
        public string PermitId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CountryId = string.Empty;
        public PermitType Type;
        public string SourceApplicationId = string.Empty;
        public long StartsAtUnixSeconds;
        public long ExpiresAtUnixSeconds;
        public bool Active;
    }
}
