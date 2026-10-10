using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AirportSecurityState
    {
        public string ScreeningId = string.Empty;
        public string CheckInId = string.Empty;
        public string Status = "pending";
        public bool Cleared;
        public string OutcomeTag = string.Empty;
    }
}
