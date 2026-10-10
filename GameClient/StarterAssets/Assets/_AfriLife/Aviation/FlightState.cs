using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class FlightState
    {
        public string FlightId = string.Empty;
        public FlightType Type;
        public string OriginAirportId = string.Empty;
        public string DestinationAirportId = string.Empty;
        public string AircraftId = string.Empty;
        public FlightStatus Status = FlightStatus.Scheduled;
        public long ScheduledDepartureUnixSeconds;
        public long ScheduledArrivalUnixSeconds;
        public string GateId = string.Empty;
    }
}
