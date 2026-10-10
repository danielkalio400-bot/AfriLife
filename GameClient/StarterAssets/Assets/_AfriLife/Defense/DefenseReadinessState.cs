using System;
using UnityEngine;

namespace AfriLife.Defense
{
    // Fictional aggregate state for non-operational world presentation.
    [Serializable]
    public sealed class DefenseReadinessState
    {
        public string InstitutionId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public string Branch = string.Empty;
        public string Category = string.Empty;
        [Range(0f,1f)] public float Maintenance01;
        [Range(0f,1f)] public float FuelAvailability01;
        [Range(0f,1f)] public float MedicalSupport01;
        [Range(0f,1f)] public float ServiceCapacity01;

        public float ReadinessIndex01
        {
            get { return Mathf.Clamp01((Maintenance01 + FuelAvailability01 +
                MedicalSupport01 + ServiceCapacity01) * 0.25f); }
        }
    }
}
