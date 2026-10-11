using System;
using System.Collections;
using AfriLife.Gameplay.FirstNeighborhood;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.World.Travel
{
    // Cross-city selector, deliberately separate from the Lagos-only daily-life
    // HUD and economy. Scene transfer is functional; vehicle/visa trips are not.
    [DefaultExecutionOrder(200)]
    [DisallowMultipleComponent]
    public sealed class AfriLifeWorldNavigator : MonoBehaviour
    {
        private bool _open;
        private bool _loading;
        private string _selectedCountry="NG";
        private string _selectedDivision="ng-lagos";
        private string _message="";
        private Vector2 _divisionScroll;
        private Vector2 _cityScroll;
        private AfriLifeTravelCity _current;
        private AfriLifeTravelCheckpoint.State _state;
        private FirstNeighborhoodWalkController _player;

        private void Start()
        {
            _current=AfriLifeTravelCatalog.ForScene(gameObject.scene.path);
            if(_current==null)
            {
                Debug.LogError("AfriLife world navigator only supports authored Lagos/Accra scenes.");
                enabled=false;
                return;
            }
            AfriLifeDivision admin=AfriLifeTravelCatalog.FindDivision(_current.DivisionId);
            _selectedCountry=admin.CountryIso2;
            _selectedDivision=admin.Id;
            try
            {
                _state=AfriLifeTravelCheckpoint.Load();
                _state.CurrentCityId=_current.CityId;
            }
            catch(Exception ex)
            {
                // Never destroy a corrupt checkpoint or create a fresh one
                // over it. The current city is still safe to explore.
                Debug.LogError("AfriLife travel checkpoint unavailable: "+ex.Message,this);
                _message="Travel checkpoint needs recovery. Existing save files preserved.";
                _state=null;
            }
            _player=FindFirstObjectByType<FirstNeighborhoodWalkController>();
            if(_state!=null&&_player!=null&&
               _state.TryPosition(_current.CityId,out Vector3 location))
                RestorePosition(location);
        }

        private void RestorePosition(Vector3 saved)
        {
            // Only positions on the small authored neighborhood are restored.
            // CharacterController owns actor physics; do not snap across scenes
            // or use a different game's player/save identity.
            if(Mathf.Abs(saved.x)>45f||Mathf.Abs(saved.z)>45f)return;
            CharacterController controller=_player.GetComponent<CharacterController>();
            if(controller==null)return;
            bool wasEnabled=controller.enabled;
            if(wasEnabled)controller.enabled=false;
            _player.transform.position=new Vector3(saved.x,0f,saved.z);
            if(wasEnabled)controller.enabled=true;
        }

        private void OnApplicationPause(bool paused)
        {
            if(paused)CaptureAndSave();
        }
        private void OnApplicationQuit()
        {
            CaptureAndSave();
        }

        private void CaptureAndSave()
        {
            if(_state==null||_current==null||_loading)return;
            try
            {
                if(_player!=null)_state.Capture(_current.CityId,_player.transform.position);
                _state.CurrentCityId=_current.CityId;
                AfriLifeTravelCheckpoint.Save(_state);
            }
            catch(Exception ex)
            {
                Debug.LogError("AfriLife travel checkpoint save failed: "+ex.Message,this);
            }
        }

        private void Transfer(AfriLifeTravelCity destination)
        {
            if(_loading||_state==null||destination==null||
               !destination.SceneAuthored||destination.CityId==_current.CityId)return;
            if(!Application.CanStreamedLevelBeLoaded(destination.ScenePath))
            {
                _message="Destination scene is not included in Unity Build Settings.";
                return;
            }
            try
            {
                if(_player!=null)_state.Capture(_current.CityId,_player.transform.position);
                _state.CurrentCityId=destination.CityId;
                AfriLifeTravelCheckpoint.Save(_state);
            }
            catch(Exception ex)
            {
                _state.CurrentCityId=_current.CityId;
                _message="Transfer cancelled. Previous travel checkpoint preserved.";
                Debug.LogError("AfriLife city transfer save failed: "+ex.Message,this);
                return;
            }
            _loading=true;
            _open=false;
            StartCoroutine(Load(destination.ScenePath));
        }

        private IEnumerator Load(string path)
        {
            AsyncOperation operation=SceneManager.LoadSceneAsync(path,LoadSceneMode.Single);
            if(operation==null)
            {
                _loading=false;
                _message="Unity could not start loading the destination.";
                Debug.LogError(_message,this);
                yield break;
            }
            while(!operation.isDone)
                yield return null;
        }

        private void OnGUI()
        {
            if(Application.isBatchMode||_current==null)return;
            Rect safe=Screen.safeArea;
            float width=Mathf.Min(178f,safe.width*0.41f);
            float bx=safe.xMax-width-10f;
            float by=safe.y+10f;
            if(GUI.Button(new Rect(bx,by,width,39f),
                _loading?"Loading city...":"World Map | "+_current.DisplayName))
            {
                if(!_loading)_open=!_open;
            }
            if(!_open)return;

            float panelWidth=Mathf.Min(530f,safe.width-20f);
            float panelHeight=Mathf.Min(570f,safe.height-65f);
            Rect panel=new Rect(safe.xMax-panelWidth-10f,by+45f,
                panelWidth,panelHeight);
            GUI.Box(panel,"AfriLife World Map");
            float pad=12f, x=panel.x+pad, y=panel.y+34f;
            float w=panel.width-pad*2f;
            GUI.Label(new Rect(x,y,w,23f),"Current: "+_current.DisplayName+
                " | "+(_selectedCountry=="NG"?"Nigeria":"Ghana"));
            y+=31f;
            if(GUI.Button(new Rect(x,y,w*0.49f,34f),"Nigeria (36 states + FCT)"))
            {
                _selectedCountry="NG";_selectedDivision="ng-lagos";
                _divisionScroll=Vector2.zero;
            }
            if(GUI.Button(new Rect(x+w*0.51f,y,w*0.49f,34f),
                "Ghana (16 regions)"))
            {
                _selectedCountry="GH";_selectedDivision="gh-greater-accra";
                _divisionScroll=Vector2.zero;
            }
            y+=43f;
            GUI.Label(new Rect(x,y,w*0.56f,24f),
                _selectedCountry=="NG"?"Select state or FCT":"Select region");
            GUI.Label(new Rect(x+w*0.56f,y,w*0.44f,24f),"Cities / availability");
            y+=27f;
            float viewHeight=Mathf.Max(75f,panel.yMax-y-100f);
            float leftWidth=w*0.54f, rightWidth=w-leftWidth-7f;
            var divisions=AfriLifeTravelCatalog.InCountry(_selectedCountry);
            float allDivisionHeight=divisions.Length*34f+4f;
            Rect leftView=new Rect(x,y,leftWidth,viewHeight);
            _divisionScroll=GUI.BeginScrollView(leftView,_divisionScroll,
                new Rect(0f,0f,leftWidth-20f,allDivisionHeight),false,true);
            for(int i=0;i<divisions.Length;i++)
            {
                AfriLifeDivision division=divisions[i];
                string prefix=division.Id==_selectedDivision?"* ":"";
                if(GUI.Button(new Rect(0f,i*34f,leftWidth-21f,31f),
                    prefix+division.DisplayName))
                    _selectedDivision=division.Id;
            }
            GUI.EndScrollView();

            var cities=AfriLifeTravelCatalog.InDivision(_selectedDivision);
            Rect rightView=new Rect(x+leftWidth+7f,y,rightWidth,viewHeight);
            _cityScroll=GUI.BeginScrollView(rightView,_cityScroll,
                new Rect(0f,0f,rightWidth-16f,Mathf.Max(viewHeight,
                    cities.Length*66f+50f)),false,true);
            if(cities.Length==0)
                GUI.Label(new Rect(3f,3f,rightWidth-20f,75f),
                    "Region registered.\nCity scene not authored yet.");
            for(int i=0;i<cities.Length;i++)
            {
                var city=cities[i];
                bool ready=city.SceneAuthored &&
                    Application.CanStreamedLevelBeLoaded(city.ScenePath);
                bool here=city.CityId==_current.CityId;
                GUI.Label(new Rect(3f,i*66f,rightWidth-20f,22f),
                    city.DisplayName);
                bool previous=GUI.enabled;
                GUI.enabled=ready&&!here&&_state!=null&&!_loading;
                if(GUI.Button(new Rect(3f,i*66f+24f,rightWidth-23f,34f),
                    here?"You are here":ready?"Transfer to city":"Planned"))
                    Transfer(city);
                GUI.enabled=previous;
            }
            GUI.EndScrollView();

            y+=viewHeight+8f;
            GUI.Label(new Rect(x,y,w,55f),
                _message.Length>0?_message:
                "Instant scene transfer only. Road, flight and border journeys are not yet simulated.");
        }
    }
}
