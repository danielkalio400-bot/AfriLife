using System;

namespace AfriLife.Transport.Traffic
{
    [Serializable]
    public sealed class TrafficAgentState
    {
        public string AgentId = string.Empty;
        public TrafficAgentKind Kind;
        public string CurrentRoadSegmentId = string.Empty;
        public string DestinationRoadSegmentId = string.Empty;
        public float DesiredSpeedKph = 40f;
        public float CurrentSpeedKph;
        public float Patience01 = 0.5f;
        public bool Yielding;
        public bool Parked;
        public bool InService = true;

        public void Normalize()
        {
            DesiredSpeedKph = Math.Max(0f, DesiredSpeedKph);
            CurrentSpeedKph = Math.Max(0f, CurrentSpeedKph);
            Patience01 = Math.Clamp(Patience01, 0f, 1f);
        }
    }
}
