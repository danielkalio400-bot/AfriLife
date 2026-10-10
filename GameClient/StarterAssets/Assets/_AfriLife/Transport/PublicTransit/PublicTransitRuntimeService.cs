using System;
using System.Collections.Generic;
using System.Linq;

namespace AfriLife.Transport.PublicTransit
{
    public sealed class PublicTransitRuntimeService
    {
        private readonly List<PublicTransitRoute> _routes = new();
        private readonly List<PublicTransitStop> _stops = new();
        private readonly List<PublicTransitTimetableEntry> _timetable = new();

        public void Replace(
            IEnumerable<PublicTransitRoute> routes,
            IEnumerable<PublicTransitStop> stops,
            IEnumerable<PublicTransitTimetableEntry> timetable)
        {
            _routes.Clear();
            _stops.Clear();
            _timetable.Clear();

            if (routes != null) _routes.AddRange(routes.Where(route => route != null));
            if (stops != null) _stops.AddRange(stops.Where(stop => stop != null));
            if (timetable != null) _timetable.AddRange(timetable.Where(entry => entry != null));
        }

        public IReadOnlyList<PublicTransitRoute> ActiveRoutes() =>
            _routes.Where(route => route.Active).ToArray();

        public IReadOnlyList<PublicTransitTimetableEntry> Upcoming(
            string stopId,
            int minuteOfDay,
            int lookAheadMinutes = 90)
        {
            int start = NormalizeMinute(minuteOfDay);
            int window = Math.Clamp(lookAheadMinutes, 1, 720);

            return _timetable
                .Where(entry => entry.StopId == stopId)
                .Where(entry =>
                {
                    int candidate = NormalizeMinute(entry.MinuteOfDay);
                    int delta = (candidate - start + 1440) % 1440;
                    return delta <= window;
                })
                .OrderBy(entry => (NormalizeMinute(entry.MinuteOfDay) - start + 1440) % 1440)
                .ToArray();
        }

        private static int NormalizeMinute(int value) => ((value % 1440) + 1440) % 1440;
    }
}
