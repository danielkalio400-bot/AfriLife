using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class TrainState
    {
        public string TrainId = string.Empty;
        public string DisplayName = string.Empty;
        public TrainType Type;
        public int PassengerCapacity;
        public double FreightCapacityKg;
        public double Condition01 = 1d;
        public string DepotId = string.Empty;
        public bool InService = true;
    }
}
