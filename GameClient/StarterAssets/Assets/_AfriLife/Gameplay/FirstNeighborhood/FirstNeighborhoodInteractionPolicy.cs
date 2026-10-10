using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    public static class FirstNeighborhoodInteractionPolicy
    {
        public static string RequiredSite(string step)
        {
            switch (step)
            {
                case "travel-or-drive":
                case "work":
                case "earn-money": return "workplace";
                case "shop": return "market";
                case "exercise": return "park";
                case "interact-with-persistent-npcs": return "neighbor";
                case "pay-bills": return "bank";
                default: return "home";
            }
        }

        public static bool CanPerform(string step, Vector3 playerPosition,
            FirstNeighborhoodInteractionPoint[] points, out string reason)
        {
            return CanPerformSite(RequiredSite(step),playerPosition,points,out reason);
        }

        public static bool CanPerformSite(string site, Vector3 playerPosition,
            FirstNeighborhoodInteractionPoint[] points, out string reason)
        {
            if (string.IsNullOrWhiteSpace(site))
            {
                reason="Unknown interaction location.";
                return false;
            }
            if (points != null)
            {
                foreach (FirstNeighborhoodInteractionPoint point in points)
                {
                    if (point != null && point.SiteId == site &&
                        point.Contains(playerPosition))
                    {
                        reason = "At " + point.DisplayName;
                        return true;
                    }
                }
            }
            reason = "Walk to the " + site + " marker first.";
            return false;
        }
    }
}
