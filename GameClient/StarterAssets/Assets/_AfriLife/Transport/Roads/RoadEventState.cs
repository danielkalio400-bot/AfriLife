using System;

namespace AfriLife.Transport.Roads
{
    [Serializable]
    public sealed class RoadEventState
    {
        public string EventId = string.Empty;
        public string RoadSegmentId = string.Empty;
        public RoadEventType Type;
        public float Severity01;
        public bool BlocksTraffic;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;

        public void Normalize()
        {
            Severity01 = Math.Clamp(Severity01, 0f, 1f);
        }

        public bool IsActive(long worldUnixSeconds) =>
            worldUnixSeconds >= StartsAtUnixSeconds &&
            (EndsAtUnixSeconds <= 0 || worldUnixSeconds < EndsAtUnixSeconds);
    }
}
