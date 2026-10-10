using UnityEngine;

namespace AfriLife.Environment
{
    // Read-only regional presentation effects. Source systems apply authority
    // checks before changing actual grid, flights, ships, roads or agriculture.
    public static class EnvironmentalResponseEffects
    {
        public static float Capacity01(EnvironmentalResponseState incident)
        {
            if (incident == null) return 1f;
            incident.Normalize();
            float severity = incident.RemainingDisruption01;
            switch (incident.Kind)
            {
                case "road": return 1f - severity * 0.8f;
                case "grid": return 1f - severity * 0.85f;
                case "aviation": return 1f - severity * 0.9f;
                case "maritime": return 1f - severity * 0.85f;
                case "agriculture": return 1f - severity * 0.65f;
                default: return 1f;
            }
        }

        public static bool IsServiceReduced(EnvironmentalResponseState incident)
        {
            return incident != null && incident.Status != "restored" &&
                   Capacity01(incident) < 0.99f;
        }
    }
}
