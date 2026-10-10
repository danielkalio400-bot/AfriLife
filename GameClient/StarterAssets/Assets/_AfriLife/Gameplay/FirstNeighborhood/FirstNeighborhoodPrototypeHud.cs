using System;
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
        private readonly string[] _errandLabels = {
            "Clinic check-in - NGN 1.20","Market supplies - NGN 1.80",
            "Park cleanup - NGN 0.75 earned","Help a neighbor"
        };
        private FirstNeighborhoodWalkController _actor;
        private FirstNeighborhoodInteractionPoint[] _points;
        private FirstNeighborhoodResidentAgent[] _residents;
        private float _nextScheduleRefresh;
        private float _nextAutoSave;
        private void Start()
        {
            if(!TryLoadWorld(out _loop)) return;
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
                    if(npc==null)continue;
                    agent.SetDestination(npc.CurrentLocationId,npc.Sleeping);
                }
            }
            if (_actor==null || Time.unscaledTime < _nextAutoSave)return;
            _nextAutoSave=Time.unscaledTime+6f;
            if (_actor.HasMovedSinceCapture) SavePlayerPosition();
        }

        private static bool TryLoadWorld(out FirstNeighborhoodPrototypeLoop loop)
        {
            loop=null;
            try
            {
                loop=new FirstNeighborhoodPrototypeLoop(
                    LocalWorldSaveStore.LoadOrCreate());
                return true;
            }
            catch(Exception exception)
            {
                Debug.LogWarning("AfriLife local save requires recovery: "+
                    exception.GetType().Name);
                return false;
            }
        }

        private bool SavePlayerPosition()
        {
            if(_loop==null)return false;
            _actor?.Capture(_loop.State);
            try
            {
                LocalWorldSaveStore.Save(_loop.SaveData);
                return true;
            }
            catch(Exception exception)
            {
                _message="Save failed; a previous verified checkpoint remains. "+
                    exception.GetType().Name;
                return false;
            }
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
            if(Application.isBatchMode)return;
            if(_loop==null)
            {
                GUI.Box(new Rect(Screen.safeArea.x+12,Screen.safeArea.y+12,
                    Mathf.Min(470f,Screen.safeArea.width*0.92f),118f),
                    "AfriLife save cannot be loaded. Preserve existing save slots; "+
                    "do not reset player data.");
                return;
            }
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
            GUILayout.Label("Save verification: "+LocalWorldSaveStore.LastLoadStatus);
            GUILayout.Label("Known residents: "+_loop.Residents.Residents().Count);
            if(_loop.CurrentStep=="interact-with-persistent-npcs")
                GUILayout.Label("Stand near a named resident at the neighbor marker.");
            GUILayout.Label("Resident conversations: "+_loop.State.ConversationCount);
            GUILayout.Label("Physical movement with scripted interactions; not a complete open world.");
            GUILayout.Label("Optional neighborhood errands (once per game day):");
            for(int i=0;i<FirstNeighborhoodErrandService.ErrandIds.Length;i++)
            {
                string errandId=FirstNeighborhoodErrandService.ErrandIds[i];
                var errands=new FirstNeighborhoodErrandService(_loop);
                bool available=errands.CanCompleteToday(errandId);
                GUI.enabled=available;
                if(GUILayout.Button(_errandLabels[i]+(available?"":" [completed]"),GUILayout.MinHeight(34)))
                {
                    string site=FirstNeighborhoodErrandService.RequiredSite(errandId);
                    if(_actor==null || !FirstNeighborhoodInteractionPolicy.CanPerformSite(
                        site,_actor.transform.position,_points,out _message))
                    {
                        // A physical approach is required.
                    }
                    else
                    {
                        string residentId=string.Empty;
                        if(errandId=="neighbor-help")
                        {
                            var resident=ClosestResident();
                            residentId=resident!=null?resident.ResidentId:string.Empty;
                        }
                        if(errands.TryComplete(errandId,site,residentId,out _message))
                            SavePlayerPosition();
                    }
                }
                GUI.enabled=true;
            }
            if(_loop.CurrentStep=="save-and-reload")
            {
                if(GUILayout.Button("Save & reload to finish day",GUILayout.MinHeight(40)))
                {
                    if(SavePlayerPosition() && TryLoadWorld(out var reloaded))
                    {
                        // Verify persisted identity and current action index.
                        if(reloaded.SaveData.Header.WorldId==_loop.SaveData.Header.WorldId &&
                            reloaded.State.NextStep==16)
                        {
                            _loop=reloaded;
                            _actor?.Restore(_loop.State);
                            _saveVerified=_loop.CompleteAfterVerifiedReload(out _message);
                            if(_saveVerified)SavePlayerPosition();
                        }
                        else _message="Save verification failed; progress unchanged.";
                    }
                    else _message="Cannot complete day until saved state is recoverable.";
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
                        _message="Walk closer to a named resident.";
                    else if(_loop.TryAdvance(out _message,agent.ResidentId))
                    {
                        SavePlayerPosition();
                    }
                }
                else if(_loop.TryAdvance(out _message)) SavePlayerPosition();
            }
            if(GUILayout.Button("Reload saved state",GUILayout.MinHeight(38)))
            {
                if(TryLoadWorld(out var reloaded))
                {
                    _loop=reloaded;
                    _actor?.Restore(_loop.State);
                    _message="Reloaded verified neighborhood state and player position.";
                }
                else _message="Save slots are corrupt. Preserve files for recovery.";
            }
            GUILayout.Label(_message);
            GUILayout.EndScrollView();
            GUILayout.EndArea();
        }
    }
}
