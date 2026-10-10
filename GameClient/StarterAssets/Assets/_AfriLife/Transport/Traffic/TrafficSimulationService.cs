using System;
using AfriLife.Transport.Roads;

namespace AfriLife.Transport.Traffic
{
    public sealed class TrafficSimulationService
    {
        public float ResolveTravelTimeMultiplier(RoadSegmentState road, TrafficRuntimeState traffic)
        {
            if (road == null) return 3f;
            road.Normalize();
            traffic?.Normalize();

            if (road.Condition == RoadSurfaceCondition.Closed) return float.PositiveInfinity;

            float multiplier = 1f;
            multiplier += road.Congestion01 * 2.2f;
            if (traffic != null) multiplier += traffic.Congestion01 * 1.8f;
            if (road.Condition == RoadSurfaceCondition.Rough) multiplier += 0.35f;
            if (road.Condition == RoadSurfaceCondition.Flooded) multiplier += 1.25f;
            if (road.Condition == RoadSurfaceCondition.UnderRepair) multiplier += 0.65f;
            if (road.IncidentActive) multiplier += 0.8f;

            return Math.Max(1f, multiplier);
        }
    }
}
