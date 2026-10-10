using System;
using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Authored local interaction focus near a neighborhood site. The visual
    /// is a primitive scene prop; no animation or building interior is implied.
    /// Player interaction is gated by physical range, never a HUD-only click.
    /// </summary>
    public sealed class FirstNeighborhoodActivityProp : MonoBehaviour
    {
        public string PropId = string.Empty;
        public string SiteId = string.Empty;
        public string DisplayName = "Activity";
        public string[] StepIds = Array.Empty<string>();
        [Range(1f,5f)] public float ReachMeters = 3f;

        public bool Supports(string step) => !string.IsNullOrWhiteSpace(step)
            && Array.IndexOf(StepIds ?? Array.Empty<string>(),step)>=0;

        public bool Contains(Vector3 actorPosition)
        {
            Vector3 a=transform.position,b=actorPosition;
            a.y=0f;b.y=0f;
            return Vector3.Distance(a,b)<=ReachMeters;
        }
    }
}
