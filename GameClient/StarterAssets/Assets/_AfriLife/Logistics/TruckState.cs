using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class TruckState
    {
        public string TruckId = string.Empty;
        public string OperatorEntityId = string.Empty;
        public double CapacityUnits;
        public double FuelLevel01 = 1d;
        public double Condition01 = 1d;
        public bool Available = true;
    }
}
