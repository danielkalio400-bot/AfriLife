using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class PassengerCheckInState
    {
        public string CheckInId = string.Empty;
        public string FlightId = string.Empty;
        public string PassengerEntityId = string.Empty;
        public string TravelDocumentId = string.Empty;
        public bool CheckedIn;
        public bool SecurityScreeningCompleted;
        public bool ImmigrationCheckpointCompleted;
        public bool BoardingEligible;
    }
}
