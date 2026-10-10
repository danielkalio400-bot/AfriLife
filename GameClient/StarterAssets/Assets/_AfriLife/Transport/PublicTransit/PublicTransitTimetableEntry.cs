using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class PublicTransitTimetableEntry
    {
        public string RouteId = string.Empty;
        public string StopId = string.Empty;
        public int MinuteOfDay;
        public int ExpectedDwellSeconds = 30;
        public bool Weekday = true;
        public bool Weekend = true;
    }
}
