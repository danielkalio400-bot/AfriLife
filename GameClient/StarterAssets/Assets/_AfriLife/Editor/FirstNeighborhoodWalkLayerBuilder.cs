#if UNITY_EDITOR
using AfriLife.Gameplay.FirstNeighborhood;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    /// <summary>Safe scene upgrade. Works with both new and existing blockouts.</summary>
    public static class FirstNeighborhoodWalkLayerBuilder
    {
        private const string ScenePath =
            "Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";

        [MenuItem("AfriLife/Add Walkable Interaction Layer")]
        public static void Upgrade()
        {
            if (!System.IO.File.Exists(ScenePath))
            {
                EditorUtility.DisplayDialog("Scene required",
                    "Build the first neighborhood prototype scene first.","OK");
                return;
            }
            Scene scene=EditorSceneManager.OpenScene(ScenePath,OpenSceneMode.Single);
            AddToScene(scene);
            EditorSceneManager.SaveScene(scene,ScenePath);
            AssetDatabase.Refresh();
        }

        public static void AddToScene(Scene scene)
        {
            if (GameObject.Find("AfriLife Walkable Player") != null)
                return; // Do not destroy or replace already authored player content.

            var root = new GameObject("AfriLife Walkable Player");
            root.transform.position=new Vector3(-11f,0f,-5.6f);
            var controller=root.AddComponent<CharacterController>();
            controller.height=2f;
            controller.center=new Vector3(0f,1f,0f);
            controller.radius=0.38f;
            root.AddComponent<FirstNeighborhoodWalkController>();

            GameObject visual=GameObject.CreatePrimitive(PrimitiveType.Capsule);
            visual.name="Original Player Capsule";
            visual.transform.SetParent(root.transform,false);
            visual.transform.localPosition=new Vector3(0f,1f,0f);
            var collision=visual.GetComponent<Collider>();
            if(collision!=null)Object.DestroyImmediate(collision);

            AddMarker("home","Home Entrance",-11f,-6.5f);
            AddMarker("market","Market Counter",9f,-4.8f);
            AddMarker("workplace","Workplace Entry",10f,4.8f);
            AddMarker("bank","Bill Payment Bank",-7f,7.3f);
            AddMarker("park","Small Activity Park",2f,2f);
            AddMarker("neighbor","Neighbor Gathering Spot",6f,3.0f);
            AddResidents();

            Camera camera=Camera.main;
            if (camera!=null)
            {
                var follow=camera.gameObject.GetComponent<FirstNeighborhoodCameraFollow>();
                if(follow==null)follow=camera.gameObject.AddComponent<FirstNeighborhoodCameraFollow>();
                follow.Target=root.transform;
                camera.transform.position=root.transform.position+follow.Offset;
            }

            EditorSceneManager.MarkSceneDirty(scene);
        }

        private static void AddResidents()
        {
            SpawnResident("prototype-resident-ada","Ada",new Vector3(6f,0f,3f));
            SpawnResident("prototype-resident-bola","Bola",new Vector3(8f,0f,-5f));
            SpawnResident("prototype-resident-kwame","Kwame",new Vector3(3f,0f,3f));
        }

        private static void SpawnResident(string id,string name,Vector3 location)
        {
            if(GameObject.Find("Resident - "+name)!=null)return;
            var npc=GameObject.CreatePrimitive(PrimitiveType.Capsule);
            npc.name="Resident - "+name;
            npc.transform.position=location+Vector3.up;
            var collider=npc.GetComponent<Collider>();
            if(collider!=null)Object.DestroyImmediate(collider);
            var agent=npc.AddComponent<FirstNeighborhoodResidentAgent>();
            agent.ResidentId=id;
            agent.DisplayName=name;
            agent.SetDestination("neighbor",false);
        }

        private static void AddMarker(string id,string name,float x,float z)
        {
            GameObject point=GameObject.CreatePrimitive(PrimitiveType.Sphere);
            point.name="Interact - "+name;
            point.transform.position=new Vector3(x,0.35f,z);
            point.transform.localScale=new Vector3(0.65f,0.65f,0.65f);
            SphereCollider trigger=point.GetComponent<SphereCollider>();
            if (trigger!=null)trigger.isTrigger=true;
            FirstNeighborhoodInteractionPoint component=
                point.AddComponent<FirstNeighborhoodInteractionPoint>();
            component.SiteId=id;
            component.DisplayName=name;
            component.ReachMeters=3f;
        }
    }
}
#endif
