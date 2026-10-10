using System;
using UnityEngine;

namespace AfriLife.Environment
{
    // DTOs for a future authenticated simulation transport; do not generate
    // local official warnings or change bank/inventory/infrastructure ownership.
    [Serializable]
    public sealed class EnvironmentalResponseState
    {
        public string IncidentId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public string Kind = string.Empty;
        public string SourceWeatherStateId = string.Empty;
        public string Status = "disrupted";
        [Range(0f, 1f)] public float Severity01;
        [Range(0f, 1f)] public float Recovery01;
        public string CreatedAt = string.Empty;
        public string UpdatedAt = string.Empty;

        public void Normalize()
        {
            Severity01 = Mathf.Clamp01(Severity01);
            Recovery01 = Mathf.Clamp01(Recovery01);
            if (Status == "restored") Recovery01 = 1f;
        }

        public float RemainingDisruption01
        {
            get { return Mathf.Clamp01(Severity01 * (1f - Recovery01)); }
        }
    }
}
