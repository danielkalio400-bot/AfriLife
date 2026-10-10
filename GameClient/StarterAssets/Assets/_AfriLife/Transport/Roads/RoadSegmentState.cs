using System;

namespace AfriLife.Transport.Roads
{
    [Serializable]
    public sealed class RoadSegmentState
    {
        public string RoadSegmentId = string.Empty;
        public string RegionId = string.Empty;
        public RoadSurfaceCondition Condition = RoadSurfaceCondition.Good;
        public float Congestion01;
        public bool Toll;
        public bool StreetLighting;
        public bool DrainageFunctional = true;
        public bool IncidentActive;

        public void Normalize()
        {
            Congestion01 = Math.Clamp(Congestion01, 0f, 1f);
        }
    }
}
