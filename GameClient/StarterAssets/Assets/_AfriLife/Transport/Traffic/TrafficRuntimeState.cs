using System;

namespace AfriLife.Transport.Traffic
{
    [Serializable]
    public sealed class TrafficRuntimeState
    {
        public string RegionId = string.Empty;
        public float Congestion01;
        public int ActiveVehicles;
        public int QueuedVehicles;
        public int ActiveIncidents;
        public float AverageSpeedKph;

        public void Normalize()
        {
            Congestion01 = Math.Clamp(Congestion01, 0f, 1f);
            ActiveVehicles = Math.Max(0, ActiveVehicles);
            QueuedVehicles = Math.Max(0, QueuedVehicles);
            ActiveIncidents = Math.Max(0, ActiveIncidents);
            AverageSpeedKph = Math.Max(0f, AverageSpeedKph);
        }
    }
}
