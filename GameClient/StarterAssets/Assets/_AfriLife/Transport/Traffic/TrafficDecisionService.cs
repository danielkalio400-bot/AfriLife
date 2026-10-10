using System;
using AfriLife.Transport.Roads;

namespace AfriLife.Transport.Traffic
{
    public sealed class TrafficDecisionService
    {
        public float ResolveTargetSpeedKph(
            TrafficAgentState agent,
            RoadSegmentState road,
            TrafficSignalState signal,
            TrafficRuntimeState runtime)
        {
            if (agent == null || road == null) return 0f;
            agent.Normalize();
            road.Normalize();
            runtime?.Normalize();

            if (road.Condition == RoadSurfaceCondition.Closed || agent.Parked || !agent.InService)
                return 0f;

            if (signal != null && (signal.Faulted || !signal.Powered || signal.Phase == TrafficSignalPhase.Stop))
                return 0f;

            float multiplier = 1f;
            multiplier *= 1f - road.Congestion01 * 0.55f;
            if (runtime != null) multiplier *= 1f - runtime.Congestion01 * 0.45f;

            if (road.Condition == RoadSurfaceCondition.Rough) multiplier *= 0.75f;
            if (road.Condition == RoadSurfaceCondition.Flooded) multiplier *= 0.45f;
            if (road.Condition == RoadSurfaceCondition.UnderRepair) multiplier *= 0.6f;

            return Math.Max(0f, agent.DesiredSpeedKph * multiplier);
        }
    }
}
