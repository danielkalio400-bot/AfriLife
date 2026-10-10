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
            // Attach to the existing named Ada resident; never spawn a
            // second identity or a duplicate visual capsule.
            GameObject root=GameObject.Find("Resident - Ada");
            if(root==null)
            {
                root=GameObject.CreatePrimitive(PrimitiveType.Capsule);
                root.name="Resident - Ada";
                root.transform.position=new Vector3(6f,1f,3f);
                Collider collider=root.GetComponent<Collider>();
                if(collider!=null)Object.DestroyImmediate(collider);
            }
            var agent=root.GetComponent<FirstNeighborhoodResidentAgent>();
            if(agent==null)agent=root.AddComponent<FirstNeighborhoodResidentAgent>();
            agent.ResidentId="prototype-resident-ada";
            agent.DisplayName="Ada";
            EditorSceneManager.MarkSceneDirty(scene);
        }

    }
}
#endif
