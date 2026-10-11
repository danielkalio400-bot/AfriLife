using System;
using System.Collections.Generic;
using AfriLife.Gameplay.FirstNeighborhood;
using UnityEngine;

namespace AfriLife.World.Production
{
    // Physical site discovery in the actual saved city scene.
    // No synthetic GHS/NGN rewards and no reuse of Lagos-only financial saves.
    [DisallowMultipleComponent]
    public sealed class AfriLifeCityDiscoveryHud : MonoBehaviour
    {
        private AfriLifeProductionCityIdentity _city;
        private FirstNeighborhoodWalkController _player;
        private FirstNeighborhoodInteractionPoint[] _sites;
        private readonly HashSet<string> _seen = new HashSet<string>(StringComparer.Ordinal);
        private bool _expanded;
        private string _message = "Walk to a named site to discover it.";
        private float _nextScan;

        private void Start()
        {
            _city=GetComponent<AfriLifeProductionCityIdentity>();
            _player=FindFirstObjectByType<FirstNeighborhoodWalkController>();
            _sites=FindObjectsByType<FirstNeighborhoodInteractionPoint>(FindObjectsSortMode.None);
            if(_city==null||_player==null){enabled=false;return;}
            // Deliberately session-only until city-specific persistent saves
            // are shipped. Never contaminate Lagos's existing save ledger.
        }

        private string Currency => _city.CountryIso2=="GH"?"GHS (cedi)":"NGN (naira)";
        private string Place => _city.CountryIso2=="GH"?"Ghana":"Nigeria";

        private void Update()
        {
            if(_player==null||_sites==null||Time.unscaledTime<_nextScan)return;
            _nextScan=Time.unscaledTime+0.4f;
            foreach(var point in _sites)
            {
                if(point==null||string.IsNullOrWhiteSpace(point.SiteId))continue;
                if(!point.Contains(_player.transform.position))continue;
                if(_seen.Add(point.SiteId))
                    _message="Discovered "+point.DisplayName+" in "+_city.DisplayName;
            }
        }

        private void OnGUI()
        {
            if(Application.isBatchMode||_city==null)return;
            Rect safe=Screen.safeArea;
            float width=Mathf.Min(250f,safe.width*0.43f);
            float x=safe.xMax-width-12f;
            float y=safe.y+58f;
            if(GUI.Button(new Rect(x,y,width,38f),
                _city.DisplayName+" | Sites "+_seen.Count+"/"+UniqueSiteCount()))
                _expanded=!_expanded;
            if(!_expanded)return;
            float height=Mathf.Min(260f,Mathf.Max(110f,safe.height-y-120f));
            GUI.Box(new Rect(x,y+42f,width,height),"City Exploration");
            float w=width-20f;
            GUI.Label(new Rect(x+10f,y+67f,w,25f),Place+" | "+Currency);
            GUI.Label(new Rect(x+10f,y+94f,w,42f),
                "Explore real markers in the prototype neighborhood.");
            int line=0;
            var rendered=new HashSet<string>(StringComparer.Ordinal);
            foreach(var site in _sites)
            {
                if(site==null||!rendered.Add(site.SiteId))continue;
                float yy=y+135f+line*24f;
                if(yy>y+height+15f)break;
                GUI.Label(new Rect(x+10f,yy,w,23f),
                    (_seen.Contains(site.SiteId)?"[x] ":"[ ] ")+site.DisplayName);
                line++;
            }
            GUI.Label(new Rect(x+10f,y+height+8f,w,42f),_message);
        }

        private int UniqueSiteCount()
        {
            var ids=new HashSet<string>(StringComparer.Ordinal);
            if(_sites!=null)foreach(var site in _sites)
                if(site!=null&&!string.IsNullOrWhiteSpace(site.SiteId))
                    ids.Add(site.SiteId);
            return ids.Count;
        }
    }
}
