using System;

namespace AfriLife.World.Events
{
    [Serializable]
    public sealed class InfrastructureEventState
    {
        public string EventId = string.Empty;
        public InfrastructureEventType Type;
        public string RegionId = string.Empty;
        public string AssetId = string.Empty;
        public float Severity01;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;
        public bool Resolved;

        public void Normalize() => Severity01 = Math.Clamp(Severity01, 0f, 1f);
    }
}
