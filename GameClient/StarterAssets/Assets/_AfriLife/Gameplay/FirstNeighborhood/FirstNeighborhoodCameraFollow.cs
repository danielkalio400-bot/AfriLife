using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    // Keeps the player visible when a detailed authored neighborhood is installed.
    // Casts do not allocate per-frame arrays and ignore the controlled player.
    public sealed class FirstNeighborhoodCameraFollow : MonoBehaviour
    {
        public Transform Target;
        public Vector3 Offset = new Vector3(0f, 20f, -16f);
        [Range(1f, 20f)] public float TrackingSpeed = 8f;
        [SerializeField, Min(0.05f)] private float obstructionRadius = 0.3f;
        [SerializeField, Min(0.2f)] private float minimumDistance = 0.8f;
        [SerializeField] private LayerMask obstructionMask = ~(1 << 2);
        private readonly RaycastHit[] _obstructionHits = new RaycastHit[24];

        private void LateUpdate()
        {
            if (Target == null) return;

            Vector3 focus = Target.position + Vector3.up * 1.5f;
            Vector3 preferred = Target.position + Offset;
            Vector3 delta = preferred - focus;
            float distance = delta.magnitude;
            bool obstructed = false;

            if (distance > 0.01f)
            {
                Vector3 direction = delta / distance;
                float unobstructed = distance;
                int count = Physics.SphereCastNonAlloc(focus, obstructionRadius,
                    direction, _obstructionHits, distance, obstructionMask,
                    QueryTriggerInteraction.Ignore);

                for (int i = 0; i < count; i++)
                {
                    Collider collider = _obstructionHits[i].collider;
                    if (collider == null || collider.transform.IsChildOf(Target))
                        continue;
                    float safeDistance = Mathf.Max(minimumDistance,
                        _obstructionHits[i].distance - obstructionRadius);
                    unobstructed = Mathf.Min(unobstructed, safeDistance);
                }

                obstructed = unobstructed < distance - 0.01f;
                if (obstructed)
                    preferred = focus + direction * unobstructed;
            }

            // Move immediately in front of blocking geometry rather than
            // interpolating the camera through a wall for several frames.
            float blend = obstructed ? 1f :
                1f - Mathf.Exp(-TrackingSpeed * Time.deltaTime);
            transform.position = Vector3.Lerp(transform.position, preferred, blend);
            Vector3 view = focus - transform.position;
            if (view.sqrMagnitude > 0.0001f)
                transform.rotation = Quaternion.LookRotation(view, Vector3.up);
        }
    }
}
