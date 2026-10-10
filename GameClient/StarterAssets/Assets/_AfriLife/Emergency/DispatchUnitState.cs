using System;

namespace AfriLife.Emergency
{
    [Serializable]
    public sealed class DispatchUnitState
    {
        public string UnitId = string.Empty;
        public DispatchUnitType UnitType;
        public string RegionId = string.Empty;
        public string HomeBaseId = string.Empty;
        public string AssignedIncidentId = string.Empty;
        public bool Available = true;
        public float Condition01 = 1f;
        public float FuelLevel01 = 1f;

        public void Normalize()
        {
            Condition01 = Math.Clamp(Condition01, 0f, 1f);
            FuelLevel01 = Math.Clamp(FuelLevel01, 0f, 1f);
        }

        public bool CanDispatch()
        {
            Normalize();
            return Available &&
                   string.IsNullOrWhiteSpace(AssignedIncidentId) &&
                   Condition01 > 0.2f &&
                   FuelLevel01 > 0.05f;
        }
    }
}
