#if UNITY_EDITOR
using AfriLife.Gameplay.FirstNeighborhood;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    public static class FirstNeighborhoodPrototypeSceneBuilder
    {
        [MenuItem("AfriLife/Build First Neighborhood Prototype Scene")]
        public static void Build()
        {
            const string path="Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";
            if(System.IO.File.Exists(path))
            {
                EditorUtility.DisplayDialog("Existing scene protected",
                    "The existing prototype scene will not be overwritten.","OK");
                return;
            }

            BuildUnattended();
            EditorUtility.DisplayDialog("Prototype created",
                "Primitive buildings, a movable capsule and walk-to-interact markers were created. No city AI or driving is implemented.","OK");
        }

        // The same scene generator is callable by Unity -batchmode, without
        // modal Editor dialogs or overwriting an existing authored scene.
        public static void BuildUnattended()
        {
            const string path="Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";
            if(System.IO.File.Exists(path))return;
            var current=SceneManager.GetActiveScene();
            if(current.IsValid() && current.isDirty)
                throw new System.InvalidOperationException(
                    "Save the currently modified Unity scene before unattended prototype generation.");
            var scene=EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects,
                NewSceneMode.Single);
            GameObject root=new GameObject("First Neighborhood Scripted Demo");
            root.AddComponent<FirstNeighborhoodPrototypeHud>();

            CreateBlock("Ground - Prototype Square",
                new Vector3(0f,-0.5f,0f),new Vector3(34f,1f,34f));
            CreateBlock("Home",new Vector3(-11f,1f,-10f),new Vector3(5f,2f,5f));
            CreateBlock("Grocery Market",new Vector3(9f,1f,-8f),new Vector3(6f,2f,4f));
            CreateBlock("Workplace",new Vector3(10f,1f,8f),new Vector3(7f,2f,5f));
            CreateBlock("Bank",new Vector3(-7f,1f,10f),new Vector3(4f,2f,4f));
            CreateBlock("Clinic",new Vector3(0f,1f,12f),new Vector3(4f,2f,4f));

            Camera camera=Camera.main;
            if(camera!=null)
            {
                camera.transform.position=new Vector3(0f,33f,-25f);
                camera.transform.rotation=Quaternion.Euler(53f,0f,0f);
            }

            System.IO.Directory.CreateDirectory("Assets/_AfriLife/Scenes");
            FirstNeighborhoodWalkLayerBuilder.AddToScene(scene);
            EditorSceneManager.SaveScene(scene,path);
            AssetDatabase.Refresh();
        }

        private static void CreateBlock(string name,Vector3 position,Vector3 scale)
        {
            var obj=GameObject.CreatePrimitive(PrimitiveType.Cube);
            obj.name=name;
            obj.transform.position=position;
            obj.transform.localScale=scale;
        }
    }
}
#endif
