using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class BoardingRecord
    {
        public string BoardingId = string.Empty;
        public string CheckInId = string.Empty;
        public string FlightId = string.Empty;
        public string GateId = string.Empty;
        public bool Boarded;
        public long BoardedAtUnixSeconds;
    }
}
