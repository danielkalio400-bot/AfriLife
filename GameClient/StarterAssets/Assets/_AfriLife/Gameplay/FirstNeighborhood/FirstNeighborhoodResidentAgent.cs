using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>Visible local NPC avatar. Position follows a saved schedule;
    /// its motion is a low-cost visual prototype, not full pathfinding.</summary>
    public sealed class FirstNeighborhoodResidentAgent : MonoBehaviour
    {
        public string ResidentId = string.Empty;
        public string DisplayName = "Resident";
        [Range(0.2f,3f)] public float Speed = 1.2f;
        [Range(1f,5f)] public float TalkReachMeters = 2.7f;
        public bool Available { get; private set; }
        private Vector3 _destination;

        public void SetDestination(string locationId, bool sleeping)
        {
            Available=!sleeping;
            switch (locationId)
            {
                case "home": _destination=new Vector3(-9f,0f,-6f);break;
                case "market": _destination=new Vector3(8f,0f,-5f);break;
                case "park": _destination=new Vector3(3f,0f,3f);break;
                default: _destination=new Vector3(6f,0f,3f);break;
            }
            _destination.y=transform.position.y;
        }

        public void MoveTo(Vector3 destination)
        {
            _destination=new Vector3(destination.x,transform.position.y,destination.z);
            Available=true;
        }

        public bool CanConverse(Vector3 actorPosition) => InConversationRange(actorPosition);

        private void Update()
        {
            Vector3 delta=_destination-transform.position;
            delta.y=0f;
            if(delta.sqrMagnitude<=0.01f)return;
            transform.position=Vector3.MoveTowards(transform.position,
                _destination,Speed*Time.deltaTime);
            if(delta.sqrMagnitude>0.04f)
                transform.rotation=Quaternion.Slerp(transform.rotation,
                    Quaternion.LookRotation(delta),Time.deltaTime*5f);
        }

        public bool InConversationRange(Vector3 actorPosition)
        {
            if(!Available)return false;
            Vector3 a=transform.position,b=actorPosition;
            a.y=0f;b.y=0f;
            return Vector3.Distance(a,b)<=TalkReachMeters;
        }

        private void OnGUI()
        {
            if (Application.isBatchMode || !Available || Camera.main==null) return;
            Vector3 p=Camera.main.WorldToScreenPoint(transform.position+Vector3.up*2.4f);
            if(p.z<=0f)return;
            float y=Screen.height-p.y;
            if(!Screen.safeArea.Contains(new Vector2(p.x,y)))return;
            GUI.Label(new Rect(p.x-58f,y-14f,116f,24f),DisplayName);
        }
    }
}
