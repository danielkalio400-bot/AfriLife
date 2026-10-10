using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class CustomsClearanceState
    {
        public string ClearanceId = string.Empty;
        public string MovementId = string.Empty;
        public string BorderOrPortId = string.Empty;
        public string Status = "pending";
        public string OutcomeTag = string.Empty;
        public long UpdatedAtUnixSeconds;
    }
}
