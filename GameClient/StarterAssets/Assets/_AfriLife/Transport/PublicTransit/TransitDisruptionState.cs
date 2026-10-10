using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class TransitDisruptionState
    {
        public string DisruptionId = string.Empty;
        public string RouteId = string.Empty;
        public TransitDisruptionType Type;
        public int DelayMinutes;
        public bool ServiceSuspended;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;
    }
}
