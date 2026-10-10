#if UNITY_EDITOR
using System.Collections.Generic;
using AfriLife.Gameplay.FirstNeighborhood;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    /// <summary>Non-destructive Unity Editor scene validation command.</summary>
    public static class FirstNeighborhoodSceneValidator
    {
        private const string ScenePath =
            "Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";
        private static readonly string[] Sites = {
            "home","market","workplace","bank","park","neighbor","clinic"
        };
        private static readonly string[] ResidentIds = {
            "prototype-resident-ada","prototype-resident-bola",
            "prototype-resident-kwame"
        };

        [MenuItem("AfriLife/Validate First Neighborhood Prototype Scene")]
        public static void ValidateScene()
        {
            if(!System.IO.File.Exists(ScenePath))
            {
                EditorUtility.DisplayDialog("AfriLife scene validation",
                    "Prototype scene is missing; build it in the Unity Editor first.","OK");
                return;
            }
            Scene scene=EditorSceneManager.OpenScene(ScenePath,OpenSceneMode.Single);
            List<string> problems=Inspect();
            if(problems.Count==0)
                Debug.Log("AfriLife first-neighborhood source scene checks passed. "+
                    "This does not certify Play Mode or device performance.");
            else
                Debug.LogError("AfriLife prototype scene issues:\n"+
                    string.Join("\n",problems));
            EditorUtility.DisplayDialog("AfriLife scene validation",
                problems.Count==0
                    ? "No structural issues found. Next: Play Mode and device QA."
                    : string.Join("\n",problems),
                "OK");
        }

        public static List<string> Inspect()
        {
            var problems=new List<string>();
            GameObject player=GameObject.Find("AfriLife Walkable Player");
            if(player==null ||
                player.GetComponent<CharacterController>()==null ||
                player.GetComponent<FirstNeighborhoodWalkController>()==null)
                problems.Add("Missing controllable player.");
            if(Object.FindFirstObjectByType<FirstNeighborhoodPrototypeHud>()==null)
                problems.Add("Missing daily-life HUD.");
            if(Camera.main==null)
                problems.Add("Missing main camera.");
            var markers=Object.FindObjectsByType<FirstNeighborhoodInteractionPoint>(
                FindObjectsSortMode.None);
            var siteCounts=new Dictionary<string,int>();
            foreach(var marker in markers)
            {
                if(marker==null)continue;
                string id=marker.SiteId;
                siteCounts[id]=siteCounts.TryGetValue(id,out int count)?count+1:1;
                if(marker.ReachMeters<1f || marker.ReachMeters>7f)
                    problems.Add("Invalid interaction radius at "+id);
            }
            foreach(string id in Sites)
            {
                if(!siteCounts.TryGetValue(id,out int count))
                    problems.Add("Missing interaction marker: "+id);
                else if(count!=1)
                    problems.Add("Expected one interaction marker at "+id);
            }
            var props=Object.FindObjectsByType<FirstNeighborhoodActivityProp>(
                FindObjectsSortMode.None);
            foreach(string step in FirstNeighborhoodPrototypeLoop.Steps)
            {
                string site=FirstNeighborhoodInteractionPolicy.RequiredSite(step);
                int count=0;
                foreach(var prop in props)
                    if(prop!=null && prop.SiteId==site && prop.Supports(step))count++;
                if(count!=1)problems.Add("Expected one activity prop for "+step);
            }
            var residents=Object.FindObjectsByType<FirstNeighborhoodResidentAgent>(
                FindObjectsSortMode.None);
            foreach(string id in ResidentIds)
            {
                int count=0;
                foreach(var resident in residents)
                    if(resident!=null && resident.ResidentId==id)count++;
                if(count!=1)problems.Add("Expected one resident: "+id);
            }
            return problems;
        }
    }
}
#endif
