using System;
using System.Collections.Generic;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Player-driven discovery of the original blockout's seven sites.
    /// Discovery is saved in the same canonical world as daily-life progress,
    /// and awards no money, reputation or progression.
    /// </summary>
    public sealed class FirstNeighborhoodLandmarkService
    {
        public static readonly string[] SiteIds = {
            "home","market","workplace","bank","park","neighbor","clinic"
        };
        private readonly FirstNeighborhoodPrototypeLoop _loop;

        public FirstNeighborhoodLandmarkService(FirstNeighborhoodPrototypeLoop loop)
        {
            _loop=loop ?? throw new ArgumentNullException(nameof(loop));
        }

        public static bool IsKnownSite(string siteId)
        {
            return !string.IsNullOrWhiteSpace(siteId) &&
                Array.IndexOf(SiteIds,siteId)>=0;
        }

        public int Count => _loop.State.DiscoveredSiteIds?.Length ?? 0;

        public bool WasDiscovered(string siteId)
        {
            return Array.IndexOf(_loop.State.DiscoveredSiteIds ??
                Array.Empty<string>(),siteId)>=0;
        }

        public bool DiscoverNear(FirstNeighborhoodWalkController player,
            FirstNeighborhoodInteractionPoint[] markers,out string message)
        {
            message=string.Empty;
            if(player==null || markers==null)return false;
            foreach(FirstNeighborhoodInteractionPoint point in markers)
            {
                if(point==null || !IsKnownSite(point.SiteId) ||
                   !point.Contains(player.transform.position) ||
                   WasDiscovered(point.SiteId))
                    continue;

                if(Count>=SiteIds.Length)
                {
                    message="All authored landmarks have been discovered.";
                    return false;
                }
                var discovered=new List<string>(
                    _loop.State.DiscoveredSiteIds ?? Array.Empty<string>())
                    {point.SiteId};
                _loop.State.DiscoveredSiteIds=discovered.ToArray();
                message="Discovered landmark: "+point.DisplayName+
                    " ("+Count+"/"+SiteIds.Length+")";
                return true;
            }
            return false;
        }
    }
}
