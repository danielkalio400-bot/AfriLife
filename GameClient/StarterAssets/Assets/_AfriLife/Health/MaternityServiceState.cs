using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class MaternityServiceState
    {
        public string FacilityId = string.Empty;
        public int Capacity;
        public int CurrentPatients;
        public int MidwivesPresent;
        public bool Open = true;

        public void Normalize()
        {
            Capacity = Math.Max(0, Capacity);
            CurrentPatients = Math.Clamp(CurrentPatients, 0, Capacity);
            MidwivesPresent = Math.Max(0, MidwivesPresent);
        }
    }
}
