using UnityEngine;
using UnityEngine.AI;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace AfriLife.Gameplay.FirstNeighborhood
{
    [RequireComponent(typeof(CharacterController))]
    public sealed class FirstNeighborhoodWalkController : MonoBehaviour
    {
        [Range(1f, 8f)] public float WalkingSpeed = 4.5f;
        public bool EnableVirtualButtons = true;
        private CharacterController _controller;
        private bool _up, _down, _left, _right;
        private Vector3 _lastPosition;

        private void Awake()
        {
            _controller = GetComponent<CharacterController>();
            _lastPosition = transform.position;
        }

        private void Update()
        {
            float x = (_right ? 1f : 0f) - (_left ? 1f : 0f);
            float z = (_up ? 1f : 0f) - (_down ? 1f : 0f);
#if ENABLE_INPUT_SYSTEM
            Keyboard kb = Keyboard.current;
            if (kb != null)
            {
                if (kb.aKey.isPressed || kb.leftArrowKey.isPressed) x -= 1f;
                if (kb.dKey.isPressed || kb.rightArrowKey.isPressed) x += 1f;
                if (kb.wKey.isPressed || kb.upArrowKey.isPressed) z += 1f;
                if (kb.sKey.isPressed || kb.downArrowKey.isPressed) z -= 1f;
            }
#else
            if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) x -= 1f;
            if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow)) x += 1f;
            if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) z += 1f;
            if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) z -= 1f;
#endif
#if ENABLE_INPUT_SYSTEM
            // Use a physical controller on mobile and Windows without synthetic touches.
            Gamepad pad = Gamepad.current;
            if (pad != null)
            {
                Vector2 stick = pad.leftStick.ReadValue();
                if (stick.sqrMagnitude >= 0.0225f)
                {
                    x = stick.x;
                    z = stick.y;
                }
            }
#endif
            Vector3 movement = new Vector3(x,0f,z);
            if (movement.sqrMagnitude > 1f) movement.Normalize();
            _controller.SimpleMove(movement * WalkingSpeed);
            if (movement.sqrMagnitude > 0.01f)
                transform.rotation = Quaternion.Slerp(transform.rotation,
                    Quaternion.LookRotation(movement),Time.deltaTime * 12f);
        }

        // A pause or lost window focus must not leave touch navigation stuck.
        private void OnDisable() { _up=_down=_left=_right=false; }
        private void OnApplicationFocus(bool focused)
        {
            if(!focused)_up=_down=_left=_right=false;
        }

        public void Restore(FirstNeighborhoodPrototypeState state)
        {
            if (state == null || !state.HasSavedPosition) return;
            Vector3 p = new Vector3(state.PlayerX, transform.position.y, state.PlayerZ);
            if (float.IsNaN(p.x) || float.IsInfinity(p.x) ||
                float.IsNaN(p.z) || float.IsInfinity(p.z)) return;

            if (HasImportedProductionWorld())
            {
                // The saved schema records X/Z only. Recover the playable Y from
                // the actual baked walkable surface, not an invented flat plane.
                // Reject distant projection: this can teleport players through
                // walls or erase their intended save location.
                if (!NavMesh.SamplePosition(p, out NavMeshHit ground,
                    5f, NavMesh.AllAreas) ||
                    new Vector2(p.x - ground.position.x,
                        p.z - ground.position.z).sqrMagnitude > 2.25f)
                {
                    Debug.LogWarning(
                        "Saved neighborhood position has no nearby walkable NavMesh. " +
                        "Preserving the saved coordinates; bake the production world " +
                        "or repair its walkable surfaces before restoring.", this);
                    return;
                }
                p = ground.position;
            }
            else
            {
                // Keep compatibility with the original 34 m square test map.
                p.x = Mathf.Clamp(p.x, -16f, 16f);
                p.z = Mathf.Clamp(p.z, -16f, 16f);
                p.y = 0f;
            }

            if (_controller == null) _controller = GetComponent<CharacterController>();
            if (_controller == null) return;
            bool wasEnabled = _controller.enabled;
            if (wasEnabled) _controller.enabled = false;
            transform.position = p;
            if (wasEnabled) _controller.enabled = true;
            _lastPosition = p;
        }

        private bool HasImportedProductionWorld()
        {
            // Limit the lookup to this gameplay scene, not other additive scenes.
            if (!gameObject.scene.IsValid() || !gameObject.scene.isLoaded)
                return false;
            foreach (GameObject root in gameObject.scene.GetRootGameObjects())
            {
                if (root.name == "AfriLife Production Neighborhood" &&
                    root.activeInHierarchy)
                    return true;
            }
            return false;
        }

        public void Capture(FirstNeighborhoodPrototypeState state)
        {
            if (state == null) return;
            state.PlayerX=transform.position.x;
            state.PlayerZ=transform.position.z;
            state.HasSavedPosition=true;
            _lastPosition=transform.position;
        }

        public bool HasMovedSinceCapture => (transform.position-_lastPosition).sqrMagnitude>0.04f;

        private void OnGUI()
        {
            if (!EnableVirtualButtons || Application.isBatchMode) return;
            Rect safe=Screen.safeArea;
            float size=Mathf.Min(66f,safe.width * 0.16f);
            float x=safe.xMax-size*2.4f;
            float y=safe.yMax-size*3.5f;
            _up=GUI.RepeatButton(new Rect(x+size,y,size,size),"N");
            _left=GUI.RepeatButton(new Rect(x,y+size,size,size),"W");
            _right=GUI.RepeatButton(new Rect(x+size*2f,y+size,size,size),"E");
            _down=GUI.RepeatButton(new Rect(x+size,y+size*2f,size,size),"S");
        }
    }
}
