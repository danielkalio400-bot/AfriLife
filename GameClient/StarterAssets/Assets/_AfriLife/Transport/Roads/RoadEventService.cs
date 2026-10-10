using System;
using System.Collections.Generic;
using System.Linq;

namespace AfriLife.Transport.Roads
{
    public sealed class RoadEventService
    {
        private readonly List<RoadEventState> _events = new();

        public void Replace(IEnumerable<RoadEventState> events)
        {
            _events.Clear();
            if (events != null) _events.AddRange(events.Where(value => value != null));
        }

        public IReadOnlyList<RoadEventState> ActiveForRoad(string roadSegmentId, long worldUnixSeconds) =>
            _events
                .Where(value => value.RoadSegmentId == roadSegmentId && value.IsActive(worldUnixSeconds))
                .ToArray();

        public void ApplyToRoad(RoadSegmentState road, long worldUnixSeconds)
        {
            if (road == null) return;
            var active = ActiveForRoad(road.RoadSegmentId, worldUnixSeconds);

            foreach (var roadEvent in active)
            {
                roadEvent.Normalize();
                road.IncidentActive = true;
                road.Congestion01 = Math.Clamp(road.Congestion01 + roadEvent.Severity01 * 0.35f, 0f, 1f);

                if (roadEvent.BlocksTraffic || roadEvent.Type == RoadEventType.Closure)
                    road.Condition = RoadSurfaceCondition.Closed;
                else if (roadEvent.Type == RoadEventType.Flooding)
                    road.Condition = RoadSurfaceCondition.Flooded;
                else if (roadEvent.Type == RoadEventType.Construction)
                    road.Condition = RoadSurfaceCondition.UnderRepair;
            }
        }
    }
}
