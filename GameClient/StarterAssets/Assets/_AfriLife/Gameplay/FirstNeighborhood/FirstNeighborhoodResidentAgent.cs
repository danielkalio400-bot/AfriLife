using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Original local resident visual. Stage-driven walking is a simple
    /// neighborhood demonstration, not free-running NPC AI.
    /// </summary>
    public sealed class FirstNeighborhoodResidentAgent : MonoBehaviour
    {
        public string ResidentId = "first-neighborhood-resident-01";
        public string DisplayName = "Amara (fictional neighbor)";
        [Range(0.4f, 3f)] public float WalkSpeed = 1.4f;
        [Range(1f, 4f)] public float ConversationReachMeters = 2.5f;

        private Vector3 _destination;
        private bool _hasDestination;

        public void MoveTo(Vector3 destination)
        {
            destination.y = transform.position.y;
            _destination = destination;
            _hasDestination = true;
        }

        private void Update()
        {
            if (!_hasDestination) return;
            Vector3 next = Vector3.MoveTowards(transform.position, _destination,
                WalkSpeed * Time.deltaTime);
            Vector3 direction = next - transform.position;
            if (direction.sqrMagnitude > 0.0001f)
                transform.rotation = Quaternion.Slerp(transform.rotation,
                    Quaternion.LookRotation(direction), Time.deltaTime * 8f);
            transform.position = next;
            if ((transform.position - _destination).sqrMagnitude < 0.01f)
                _hasDestination = false;
        }

        public bool CanConverse(Vector3 playerPosition)
        {
            Vector3 a = transform.position;
            Vector3 b = playerPosition;
            a.y = b.y = 0f;
            return Vector3.Distance(a, b) <= ConversationReachMeters;
        }
    }
}
