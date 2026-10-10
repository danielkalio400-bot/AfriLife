using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Planar, straight-line guidance to existing world markers. No
    /// NavMesh pathfinding, route ETA or invented street network.
    /// </summary>
    public static class FirstNeighborhoodRouteGuide
    {
        public struct RouteCue
        {
            public string SiteId;
            public string Name;
            public string Direction;
            public float DistanceMeters;
            public bool WithinReach;
        }

        public static bool TryFind(string step, Vector3 position,
            FirstNeighborhoodInteractionPoint[] points, out RouteCue cue)
        {
            cue=default;
            string site=FirstNeighborhoodInteractionPolicy.RequiredSite(step);
            if (string.IsNullOrWhiteSpace(site) || points==null) return false;

            FirstNeighborhoodInteractionPoint nearest=null;
            float minSqr=float.MaxValue;
            foreach (var point in points)
            {
                if(point==null || point.SiteId!=site)continue;
                Vector3 offset=point.transform.position-position;
                offset.y=0f;
                float squared=offset.sqrMagnitude;
                if(squared>=minSqr)continue;
                nearest=point;
                minSqr=squared;
            }
            if(nearest==null)return false;
            Vector3 delta=nearest.transform.position-position;
            delta.y=0f;
            float distance=Mathf.Sqrt(minSqr);
            string heading;
            if(distance<=nearest.ReachMeters)heading="HERE";
            else if(Mathf.Abs(delta.x)>Mathf.Abs(delta.z))
                heading=delta.x>=0f?"E":"W";
            else heading=delta.z>=0f?"N":"S";
            cue=new RouteCue {
                SiteId=site,Name=nearest.DisplayName,
                Direction=heading,DistanceMeters=distance,
                WithinReach=distance<=nearest.ReachMeters
            };
            return true;
        }
    }
}
