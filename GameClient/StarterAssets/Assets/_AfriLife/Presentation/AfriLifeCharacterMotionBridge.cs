using UnityEngine;

namespace AfriLife.Presentation
{
    // Optional parameter bridge for artist-authored humanoid Animator Controllers.
    // No controller is rewritten, and no synthetic animations are claimed.
    public sealed class AfriLifeCharacterMotionBridge : MonoBehaviour
    {
        [SerializeField] private Transform motionSource;
        [SerializeField, Min(0.1f)] private float fullWalkingSpeed = 4.5f;
        [SerializeField] private string speedParameter = "Speed";
        [SerializeField] private string movingParameter = "IsMoving";
        private Animator[] _animators;
        private Vector3 _lastPosition;

        public void Configure(Transform source)
        {
            motionSource = source;
            _lastPosition = source != null ? source.position : transform.position;
        }

        private void Awake()
        {
            _animators = GetComponentsInChildren<Animator>(true);
            _lastPosition = motionSource != null ? motionSource.position : transform.position;
        }

        private void Update()
        {
            if (motionSource == null) return;
            Vector3 position = motionSource.position;
            Vector3 delta = position - _lastPosition;
            delta.y = 0f;
            _lastPosition = position;
            if (Time.deltaTime <= 0f) return;

            float speed = Mathf.Clamp01(delta.magnitude / Time.deltaTime / fullWalkingSpeed);
            if (_animators == null) return;
            foreach (Animator animator in _animators)
            {
                if (animator == null || animator.runtimeAnimatorController == null) continue;
                foreach (AnimatorControllerParameter parameter in animator.parameters)
                {
                    if (parameter.name == speedParameter &&
                        parameter.type == AnimatorControllerParameterType.Float)
                        animator.SetFloat(parameter.nameHash, speed);
                    else if (parameter.name == movingParameter &&
                        parameter.type == AnimatorControllerParameterType.Bool)
                        animator.SetBool(parameter.nameHash, speed > 0.025f);
                }
            }
        }
    }
}
