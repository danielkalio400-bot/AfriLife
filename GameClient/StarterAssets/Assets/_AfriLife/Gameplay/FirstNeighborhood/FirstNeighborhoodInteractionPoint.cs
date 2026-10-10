using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>Physical interaction marker for authored, non-networked demo scenes.</summary>
    public sealed class FirstNeighborhoodInteractionPoint : MonoBehaviour
    {
        public string SiteId = "home";
        public string DisplayName = "Home";
        [Range(1f, 7f)] public float ReachMeters = 3f;

        public bool Contains(Vector3 worldPosition)
        {
            Vector3 a = worldPosition;
            Vector3 b = transform.position;
            a.y = 0f;
            b.y = 0f;
            return Vector3.Distance(a, b) <= ReachMeters;
        }

        private void OnGUI()
        {
            Camera camera = Camera.main;
            if (camera == null || Application.isBatchMode) return;
            Vector3 p = camera.WorldToScreenPoint(transform.position + Vector3.up * 1.2f);
            if (p.z <= 0f) return;
            Rect safe = Screen.safeArea;
            float y = Screen.height - p.y;
            if (!safe.Contains(new Vector2(p.x, y))) return;
            GUI.Box(new Rect(p.x-60f,y-15f,120f,28f),DisplayName);
        }
    }
}
