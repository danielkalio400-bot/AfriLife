using System;

namespace AfriLife.Transport
{
    [Serializable]
    public sealed class TripProgress
    {
        public TripRequest Request = new();
        public TripState State = TripState.Planned;
        public double CompletedDistanceKm;

        public float Progress01
        {
            get
            {
                if (Request == null || Request.DistanceKm <= 0d)
                    return State == TripState.Completed ? 1f : 0f;
                return (float)Math.Clamp(CompletedDistanceKm / Request.DistanceKm, 0d, 1d);
            }
        }
    }
}
