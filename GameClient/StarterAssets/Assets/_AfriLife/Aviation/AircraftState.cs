using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AircraftState
    {
        public string AircraftId = string.Empty;
        public string ModelTag = string.Empty;
        public int PassengerCapacity;
        public double FuelLevel01 = 1d;
        public double Condition01 = 1d;
        public string HangarId = string.Empty;
        public bool InService = true;
    }
}
