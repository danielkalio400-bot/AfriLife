using System;
using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Manual compass guide to the scene's actual seven authored landmarks.
    /// This is straight-line XZ assistance, not pathfinding, roads or GPS.
    /// </summary>
    public static class FirstNeighborhoodLandmarkGuide
    {
        public struct Cue
        {
            public string SiteId;
            public string Name;
            public string Direction;
            public float DirectMeters;
            public bool Arrived;
        }

        public static bool TryGetCue(string targetSiteId, Vector3 position,
            FirstNeighborhoodInteractionPoint[] sceneMarkers,out Cue cue)
        {
            cue=default;
            if(!FirstNeighborhoodLandmarkService.IsKnownSite(targetSiteId) ||
               sceneMarkers==null || float.IsNaN(position.x) ||
               float.IsNaN(position.z) || float.IsInfinity(position.x) ||
               float.IsInfinity(position.z))
                return false;
            FirstNeighborhoodInteractionPoint closest=null;
            float best=float.MaxValue;
            foreach(var marker in sceneMarkers)
            {
                if(marker==null || marker.SiteId!=targetSiteId)continue;
                Vector3 delta=marker.transform.position-position;
                delta.y=0f;
                if(delta.sqrMagnitude>=best)continue;
                closest=marker;best=delta.sqrMagnitude;
            }
            if(closest==null)return false;
            Vector3 offset=closest.transform.position-position;
            offset.y=0f;
            float meters=Mathf.Sqrt(best);
            bool arrived=meters<=closest.ReachMeters;
            string heading=arrived?"HERE":
                Mathf.Abs(offset.x)>Mathf.Abs(offset.z)
                    ?(offset.x>=0f?"E":"W")
                    :(offset.z>=0f?"N":"S");
            cue=new Cue{
                SiteId=closest.SiteId,Name=closest.DisplayName,
                Direction=heading,DirectMeters=meters,Arrived=arrived
            };
            return true;
        }

        public static bool TryNearestUndiscovered(
            FirstNeighborhoodPrototypeState save,Vector3 playerPosition,
            FirstNeighborhoodInteractionPoint[] sceneMarkers,out Cue selected)
        {
            selected=default;
            if(save==null || sceneMarkers==null)return false;
            string[] visited=save.DiscoveredSiteIds ?? Array.Empty<string>();
            bool found=false;
            foreach(string id in FirstNeighborhoodLandmarkService.SiteIds)
            {
                if(Array.IndexOf(visited,id)>=0)continue;
                if(!TryGetCue(id,playerPosition,sceneMarkers,out var next))
                    continue;
                if(!found || next.DirectMeters<selected.DirectMeters)
                {
                    selected=next;found=true;
                }
            }
            return found;
        }
    }
}
