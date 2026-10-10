using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class AmbulanceUnitState
    {
        public string AmbulanceId = string.Empty;
        public string HomeFacilityId = string.Empty;
        public string DriverNpcId = string.Empty;
        public string CrewNpcId = string.Empty;
        public AmbulanceAvailabilityState State = AmbulanceAvailabilityState.Available;
        public string AssignedVisitId = string.Empty;
        public float FuelLevel01 = 1f;
        public float Condition01 = 1f;

        public void Normalize()
        {
            FuelLevel01 = Math.Clamp(FuelLevel01, 0f, 1f);
            Condition01 = Math.Clamp(Condition01, 0f, 1f);
        }

        public bool CanDispatch()
        {
            Normalize();
            return State == AmbulanceAvailabilityState.Available &&
                   FuelLevel01 > 0.05f &&
                   Condition01 > 0.2f;
        }
    }
}
