using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class VoyageState
    {
        public string VoyageId = string.Empty;
        public string RouteId = string.Empty;
        public string VesselId = string.Empty;
        public VoyageStatus Status = VoyageStatus.Scheduled;
        public long ScheduledDepartureUnixSeconds;
        public long ScheduledArrivalUnixSeconds;
        public string WeatherStateId = string.Empty;
    }
}
