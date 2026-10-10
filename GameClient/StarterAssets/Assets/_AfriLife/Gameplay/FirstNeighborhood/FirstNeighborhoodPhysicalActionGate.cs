using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Physical step gate: both an authored site and its specific in-world
    /// interaction prop must be within range of the controllable avatar.
    /// </summary>
    public static class FirstNeighborhoodPhysicalActionGate
    {
        public static bool CanPerform(string step,
            FirstNeighborhoodWalkController actor,
            FirstNeighborhoodInteractionPoint[] points,
            FirstNeighborhoodActivityProp[] props,out string message)
        {
            if(actor==null)
            {
                message="A walkable player is required. Repair the prototype scene.";
                return false;
            }
            if(!FirstNeighborhoodInteractionPolicy.CanPerform(step,
                actor.transform.position,points,out message))return false;

            string site=FirstNeighborhoodInteractionPolicy.RequiredSite(step);
            if(props!=null)
                foreach(var prop in props)
                    if(prop!=null && prop.SiteId==site &&
                       prop.Supports(step) && prop.Contains(actor.transform.position))
                    {
                        message="At "+prop.DisplayName;
                        return true;
                    }
            message="Move closer to the "+step+" activity prop at "+site+".";
            return false;
        }
    }
}
