using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class HealthcareFacilityState
    {
        public string FacilityId = string.Empty;
        public string DisplayName = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string NeighborhoodId = string.Empty;
        public HealthcareFacilityType Type;
        public int Capacity;
        public int Occupancy;
        public float GridPowerAvailability01 = 1f;
        public float BackupPowerAvailability01 = 1f;
        public float MedicalSupplyAvailability01 = 1f;
        public bool Open = true;
        public HealthcareStaffingState Staffing = new();

        public void Normalize()
        {
            Capacity = Math.Max(0, Capacity);
            Occupancy = Math.Clamp(Occupancy, 0, Capacity);
            GridPowerAvailability01 = Math.Clamp(GridPowerAvailability01, 0f, 1f);
            BackupPowerAvailability01 = Math.Clamp(BackupPowerAvailability01, 0f, 1f);
            MedicalSupplyAvailability01 = Math.Clamp(MedicalSupplyAvailability01, 0f, 1f);
            Staffing ??= new HealthcareStaffingState();
        }

        public float EffectivePower01
        {
            get
            {
                Normalize();
                return Math.Max(GridPowerAvailability01, BackupPowerAvailability01);
            }
        }
    }
}
