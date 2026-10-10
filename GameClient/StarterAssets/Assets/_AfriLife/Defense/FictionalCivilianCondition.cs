using System;
using UnityEngine;

namespace AfriLife.Defense
{
    [Serializable]
    public sealed class FictionalCivilianCondition
    {
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public string Status = "normal";
        [Range(0f,1f)] public float Pressure01;
        [Range(0f,1f)] public float TransportReliability01 = 1f;
        [Range(0f,1f)] public float HospitalAvailability01 = 1f;
        [Range(0f,1f)] public float SupplyReliability01 = 1f;
        [Range(0f,1f)] public float AssistanceDemand01;

        public void Normalize()
        {
            Pressure01 = Mathf.Clamp01(Pressure01);
            TransportReliability01 = Mathf.Clamp01(TransportReliability01);
            HospitalAvailability01 = Mathf.Clamp01(HospitalAvailability01);
            SupplyReliability01 = Mathf.Clamp01(SupplyReliability01);
            AssistanceDemand01 = Mathf.Clamp01(AssistanceDemand01);
        }
    }
}
