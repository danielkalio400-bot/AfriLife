using UnityEngine;
using UnityEngine.AI;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>Persistent local resident. Production art uses baked NavMesh routing;
    /// the original small blockout keeps its simple non-production movement.</summary>
    public sealed class FirstNeighborhoodResidentAgent : MonoBehaviour
    {
        public string ResidentId = string.Empty;
        public string DisplayName = "Resident";
        [Range(0.2f,3f)] public float Speed = 1.2f;
        [Range(1f,5f)] public float TalkReachMeters = 2.7f;
        public bool Available { get; private set; }
        private Vector3 _destination;
        private NavMeshAgent _navigation;
        private bool _destinationPending = true;
        private float _nextPathAttemptTime;
        private bool _navigationWarningShown;

        private void Awake()
        {
            _navigation = GetComponent<NavMeshAgent>();
        }

        private void OnEnable()
        {
            _destinationPending = true;
            _nextPathAttemptTime = 0f;
            _navigationWarningShown = false;
        }

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
            _destinationPending = true;
            _nextPathAttemptTime = 0f;
        }

        public void MoveTo(Vector3 destination)
        {
            _destination=new Vector3(destination.x,transform.position.y,destination.z);
            Available=true;
            _destinationPending = true;
            _nextPathAttemptTime = 0f;
        }

        public bool CanConverse(Vector3 actorPosition) => InConversationRange(actorPosition);

        private void Update()
        {
            if (_navigation != null && _navigation.enabled)
            {
                // Authored world navigation must be baked before the resident moves.
                // Never fall through to a straight-line movement that crosses walls.
                if (!_navigation.isOnNavMesh)
                {
                    if (!_navigationWarningShown)
                    {
                        Debug.LogWarning(
                            "Resident is off baked NavMesh: " + DisplayName +
                            ". Check imported terrain and agent placement.", this);
                        _navigationWarningShown = true;
                    }
                    return;
                }
                _navigationWarningShown = false;
                _navigation.speed = Mathf.Max(0.2f, Speed);
                if (_navigation.isPathStale)
                    _destinationPending = true;

                // Retry missing routes at a controlled interval. A failed path
                // must not permanently strand a resident after world changes.
                if (_destinationPending && Time.time >= _nextPathAttemptTime)
                {
                    _nextPathAttemptTime = Time.time + 2f;
                    if (NavMesh.SamplePosition(_destination, out NavMeshHit navGoal,
                        2.5f, NavMesh.AllAreas) &&
                        _navigation.SetDestination(navGoal.position))
                    {
                        _destinationPending = false;
                        _navigationWarningShown = false;
                    }
                    else if (!_navigationWarningShown)
                    {
                        Debug.LogWarning(
                            "Resident cannot navigate to schedule destination: " +
                            DisplayName, this);
                        _navigationWarningShown = true;
                    }
                }
                return;
            }

            // Existing small blockout scenes without NavMeshAgents still work.
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
