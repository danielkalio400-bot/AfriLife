#if UNITY_EDITOR
using AfriLife.Gameplay.FirstNeighborhood;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    public static class FirstNeighborhoodResidentSceneBuilder
    {
        private const string ScenePath =
            "Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";

        [MenuItem("AfriLife/Add Persistent Neighborhood Resident")]
        public static void Upgrade()
        {
            if (!System.IO.File.Exists(ScenePath))
            {
                EditorUtility.DisplayDialog("Scene missing",
                    "Build the first-neighborhood scene before adding residents.", "OK");
                return;
            }
            Scene scene = EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            AddToScene(scene);
            EditorSceneManager.SaveScene(scene, ScenePath);
            AssetDatabase.Refresh();
        }

        public static void AddToScene(Scene scene)
        {
            if (GameObject.Find("First Neighborhood Resident") != null) return;

            GameObject resident = new GameObject("First Neighborhood Resident");
            resident.transform.position = new Vector3(6.2f, 0f, 3.1f);
            var agent = resident.AddComponent<FirstNeighborhoodResidentAgent>();
            agent.ResidentId = "first-neighborhood-resident-01";
            agent.DisplayName = "Amara (fictional neighbor)";

            GameObject visual = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            visual.name = "Resident Capsule Visual";
            visual.transform.SetParent(resident.transform, false);
            visual.transform.localPosition = Vector3.up;
            Collider collider = visual.GetComponent<Collider>();
            if (collider != null) Object.DestroyImmediate(collider);

            var director = resident.AddComponent<FirstNeighborhoodResidentDirector>();
            director.Resident = agent;
            EditorSceneManager.MarkSceneDirty(scene);
        }
    }
}
#endif
