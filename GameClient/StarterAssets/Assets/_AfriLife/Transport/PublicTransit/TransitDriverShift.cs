using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class TransitDriverShift
    {
        public string DriverNpcId = string.Empty;
        public string VehicleId = string.Empty;
        public string RouteId = string.Empty;
        public int StartMinuteOfDay;
        public int EndMinuteOfDay;
        public bool Active;

        public bool Contains(int minuteOfDay)
        {
            int minute = ((minuteOfDay % 1440) + 1440) % 1440;
            int start = ((StartMinuteOfDay % 1440) + 1440) % 1440;
            int end = ((EndMinuteOfDay % 1440) + 1440) % 1440;
            return start <= end ? minute >= start && minute < end : minute >= start || minute < end;
        }
    }
}
