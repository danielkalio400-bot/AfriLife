using System;

namespace AfriLife.Infrastructure.Telecom
{
    [Serializable]
    public sealed class TelecomOutageState
    {
        public string OutageId = string.Empty;
        public string RegionId = string.Empty;
        public TelecomOutageType Type;
        public float Severity01;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;

        public void Normalize() => Severity01 = Math.Clamp(Severity01, 0f, 1f);
    }
}
