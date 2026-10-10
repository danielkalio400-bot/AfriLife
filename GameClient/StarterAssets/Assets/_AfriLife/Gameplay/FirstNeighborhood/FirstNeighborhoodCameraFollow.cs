using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    public sealed class FirstNeighborhoodCameraFollow : MonoBehaviour
    {
        public Transform Target;
        public Vector3 Offset = new Vector3(0f,20f,-16f);
        [Range(1f,20f)] public float TrackingSpeed = 8f;

        private void LateUpdate()
        {
            if (Target == null) return;
            transform.position=Vector3.Lerp(transform.position,
                Target.position+Offset,1f-Mathf.Exp(-TrackingSpeed*Time.deltaTime));
            transform.rotation=Quaternion.Euler(55f,0f,0f);
        }
    }
}
