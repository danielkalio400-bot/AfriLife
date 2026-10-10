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
        private bool[] _hasSpeed;
        private bool[] _hasMoving;
        private int _speedHash, _movingHash;
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
            _speedHash = Animator.StringToHash(speedParameter);
            _movingHash = Animator.StringToHash(movingParameter);
            _hasSpeed = new bool[_animators.Length];
            _hasMoving = new bool[_animators.Length];
            for (int i = 0; i < _animators.Length; i++)
            {
                Animator animator = _animators[i];
                if (animator == null) continue;
                foreach (AnimatorControllerParameter parameter in animator.parameters)
                {
                    if (parameter.nameHash == _speedHash &&
                        parameter.type == AnimatorControllerParameterType.Float)
                        _hasSpeed[i] = true;
                    if (parameter.nameHash == _movingHash &&
                        parameter.type == AnimatorControllerParameterType.Bool)
                        _hasMoving[i] = true;
                }
            }
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
            for (int i = 0; i < _animators.Length; i++)
            {
                Animator animator = _animators[i];
                if (animator == null || animator.runtimeAnimatorController == null) continue;
                if (_hasSpeed[i]) animator.SetFloat(_speedHash, speed);
                if (_hasMoving[i]) animator.SetBool(_movingHash, speed > 0.025f);
            }
        }
    }
}
