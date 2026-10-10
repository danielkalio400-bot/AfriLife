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
        private void Start() { _loop = new FirstNeighborhoodPrototypeLoop(LocalWorldSaveStore.LoadOrCreate()); }

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
            GUILayout.Label("Progress: "+_loop.State.NextStep+"/"+FirstNeighborhoodPrototypeLoop.Steps.Length);
            GUILayout.Label("Funds (NGN minor units): "+_loop.CashMinorUnits);
            GUILayout.Label("Days completed: "+_loop.CompletedDays);
            GUILayout.Label("This is a scripted Unity prototype, not a complete open world.");
            if(_loop.CurrentStep=="save-and-reload")
            {
                if(GUILayout.Button("Save & reload to finish day",GUILayout.MinHeight(40)))
                {
                    LocalWorldSaveStore.Save(_loop.SaveData);
                    var reloaded=LocalWorldSaveStore.LoadOrCreate();
                    // Verify persisted identity and current step before marking success.
                    if(reloaded.Header.WorldId==_loop.SaveData.Header.WorldId &&
                        reloaded.FirstNeighborhoodPrototype!=null &&
                        reloaded.FirstNeighborhoodPrototype.NextStep==16)
                    {
                        _loop=new FirstNeighborhoodPrototypeLoop(reloaded);
                        _saveVerified=_loop.CompleteAfterVerifiedReload(out _message);
                        if(_saveVerified)LocalWorldSaveStore.Save(_loop.SaveData);
                    }
                    else _message="Save verification failed; progress unchanged.";
                }
            }
            else if(_loop.CurrentStep=="complete")
            {
                if(GUILayout.Button("Begin next demo day",GUILayout.MinHeight(40)))
                {
                    _loop.BeginNextDay();
                    LocalWorldSaveStore.Save(_loop.SaveData);
                }
            }
            else if(GUILayout.Button("Perform current action",GUILayout.MinHeight(40)))
            {
                if(_loop.TryAdvance(out _message))
                    LocalWorldSaveStore.Save(_loop.SaveData);
            }
            if(GUILayout.Button("Reload saved state",GUILayout.MinHeight(38)))
            {
                _loop=new FirstNeighborhoodPrototypeLoop(LocalWorldSaveStore.LoadOrCreate());
                _message="Reloaded saved neighborhood state.";
            }
            GUILayout.Label(_message);
            GUILayout.EndScrollView();
            GUILayout.EndArea();
        }
    }
}
