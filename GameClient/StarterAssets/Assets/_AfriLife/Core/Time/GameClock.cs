using System;

namespace AfriLife.Core.Time
{
    [Serializable]
    public sealed class GameClock
    {
        public DateTime WorldTimeUtc { get; private set; } = new(2026, 1, 1, 6, 0, 0, DateTimeKind.Utc);
        public double TimeScale { get; set; } = 60.0;
        public void Advance(double realSeconds) => WorldTimeUtc = WorldTimeUtc.AddSeconds(realSeconds * TimeScale);
    }
}
