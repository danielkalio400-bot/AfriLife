using AfriLife.Core.Save;
using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    public sealed class FirstNeighborhoodPrototypeHud : MonoBehaviour
    {
        private FirstNeighborhoodPrototypeLoop _loop;
        private Vector2 _scroll;
        private string _message="Use the action button to follow the first day.";
        private bool _saveVerified;
        private FirstNeighborhoodWalkController _actor;
        private FirstNeighborhoodInteractionPoint[] _points;
        private FirstNeighborhoodResidentAgent[] _residents;
        private float _nextScheduleRefresh;
        private float _nextAutoSave;
        private void Start()
        {
            _loop=new FirstNeighborhoodPrototypeLoop(LocalWorldSaveStore.LoadOrCreate());
            _actor=FindFirstObjectByType<FirstNeighborhoodWalkController>();
            _points=FindObjectsByType<FirstNeighborhoodInteractionPoint>(FindObjectsSortMode.None);
            _residents=FindObjectsByType<FirstNeighborhoodResidentAgent>(FindObjectsSortMode.None);
            _nextScheduleRefresh=Time.unscaledTime;
            if (_actor!=null)_actor.Restore(_loop.State);
            _nextAutoSave=Time.unscaledTime+6f;
        }

        private void Update()
        {
            if (_loop==null) return;
            if (Time.unscaledTime >= _nextScheduleRefresh)
            {
                _nextScheduleRefresh=Time.unscaledTime+1f;
                _loop.Residents.AdvanceSchedule(_loop.State.ElapsedWorldSeconds);
                foreach(FirstNeighborhoodResidentAgent agent in _residents)
                {
                    if(agent==null)continue;
                    var npc=_loop.Residents.Find(agent.ResidentId);
                    if(npc!=null)agent.SetDestination(npc.CurrentLocationId,npc.Sleeping);
                }
            }
            if (_actor==null || Time.unscaledTime < _nextAutoSave)return;
            _nextAutoSave=Time.unscaledTime+6f;
            if (_actor.HasMovedSinceCapture) SavePlayerPosition();
        }

        private void SavePlayerPosition()
        {
            _actor?.Capture(_loop.State);
            LocalWorldSaveStore.Save(_loop.SaveData);
        }

        private FirstNeighborhoodResidentAgent ClosestResident()
        {
            if(_actor==null || _residents==null)return null;
            FirstNeighborhoodResidentAgent best=null;
            float nearest=float.MaxValue;
            foreach(FirstNeighborhoodResidentAgent agent in _residents)
            {
                if(agent==null || !agent.InConversationRange(_actor.transform.position) ||
                   _loop.Residents.Find(agent.ResidentId)==null)continue;
                float distance=(agent.transform.position-_actor.transform.position).sqrMagnitude;
                if(distance>=nearest)continue;
                best=agent;
                nearest=distance;
            }
            return best;
        }

        private void OnApplicationPause(bool paused)
        {
            if (paused && _loop!=null)SavePlayerPosition();
        }

        private void OnApplicationQuit()
        {
            if (_loop!=null)SavePlayerPosition();
        }

        private void OnGUI()
        {
            if(_loop==null || Application.isBatchMode)return;
            Rect safe=Screen.safeArea;
            float width=Mathf.Min(390f,safe.width*0.94f);
            float height=Mathf.Min(350f,safe.height*0.92f);
            GUILayout.BeginArea(new Rect(safe.x+12,safe.y+12,width,height),"AfriLife - Day One Demo",GUI.skin.window);
            _scroll=GUILayout.BeginScrollView(_scroll);
            GUILayout.Label("Location: "+_loop.State.CurrentLocation);
            GUILayout.Label("Current action: "+_loop.CurrentStep);
            GUILayout.Label("Walk to: "+FirstNeighborhoodInteractionPolicy.RequiredSite(_loop.CurrentStep));
            GUILayout.Label("Keyboard WASD/arrows or touch direction pad to move.");
            GUILayout.Label("Progress: "+_loop.State.NextStep+"/"+FirstNeighborhoodPrototypeLoop.Steps.Length);
            GUILayout.Label("Funds (NGN minor units): "+_loop.CashMinorUnits);
            GUILayout.Label("Days completed: "+_loop.CompletedDays);
            GUILayout.Label("Known residents: "+_loop.Residents.Residents().Count);
            if(_loop.CurrentStep=="interact-with-persistent-npcs")
                GUILayout.Label("Stand near a named resident at the neighbor marker.");
            GUILayout.Label("Resident conversations: "+_loop.State.ConversationCount);
            GUILayout.Label("Physical movement with scripted interactions; not a complete open world.");
            if(_loop.CurrentStep=="save-and-reload")
            {
                if(GUILayout.Button("Save & reload to finish day",GUILayout.MinHeight(40)))
                {
                    SavePlayerPosition();
                    var reloaded=LocalWorldSaveStore.LoadOrCreate();
                    // Verify persisted identity and current step before marking success.
                    if(reloaded.Header.WorldId==_loop.SaveData.Header.WorldId &&
                        reloaded.FirstNeighborhoodPrototype!=null &&
                        reloaded.FirstNeighborhoodPrototype.NextStep==16)
                    {
                        _loop=new FirstNeighborhoodPrototypeLoop(reloaded);
                        _actor?.Restore(_loop.State);
                        _saveVerified=_loop.CompleteAfterVerifiedReload(out _message);
                        if(_saveVerified)SavePlayerPosition();
                    }
                    else _message="Save verification failed; progress unchanged.";
                }
            }
            else if(_loop.CurrentStep=="complete")
            {
                if(GUILayout.Button("Begin next demo day",GUILayout.MinHeight(40)))
                {
                    _loop.BeginNextDay();
                    SavePlayerPosition();
                }
            }
            else if(GUILayout.Button("Perform current action",GUILayout.MinHeight(40)))
            {
                if(_actor!=null &&
                    !FirstNeighborhoodInteractionPolicy.CanPerform(_loop.CurrentStep,
                        _actor.transform.position,_points,out _message))
                {
                    // The character must physically reach the correct marker.
                }
                else if(_loop.CurrentStep=="interact-with-persistent-npcs")
                {
                    FirstNeighborhoodResidentAgent agent=ClosestResident();
                    if(agent==null)
                        _message="Move close to an available neighborhood resident.";
                    else if(_loop.TryAdvance(out _message,agent.ResidentId))
                        SavePlayerPosition();
                }
                else if(_loop.TryAdvance(out _message))
                {
                    SavePlayerPosition();
                }
            }
            if(GUILayout.Button("Reload saved state",GUILayout.MinHeight(38)))
            {
                _loop=new FirstNeighborhoodPrototypeLoop(LocalWorldSaveStore.LoadOrCreate());
                _actor?.Restore(_loop.State);
                _message="Reloaded saved neighborhood state and player position.";
            }
            GUILayout.Label(_message);
            GUILayout.EndScrollView();
            GUILayout.EndArea();
        }
    }
}
