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

        // Only resolve objects belonging to the scene being upgraded.
        private static GameObject FindInScene(Scene scene,string name)
        {
            foreach(GameObject root in scene.GetRootGameObjects())
                foreach(Transform child in root.GetComponentsInChildren<Transform>(true))
                    if(child.gameObject.name==name)return child.gameObject;
            return null;
        }

        public static Camera FindSceneCamera(Scene scene)
        {
            foreach(GameObject root in scene.GetRootGameObjects())
                foreach(Camera camera in root.GetComponentsInChildren<Camera>(true))
                    if(camera.CompareTag("MainCamera"))return camera;
            return null;
        }

        [MenuItem("AfriLife/Add Walkable Interaction Layer")]
        public static void Upgrade()
        {
            if (!System.IO.File.Exists(ScenePath))
            {
                EditorUtility.DisplayDialog("Scene required",
                    "Build the first neighborhood prototype scene first.","OK");
                return;
            }
            if(!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())return;
            Scene scene=EditorSceneManager.OpenScene(ScenePath,OpenSceneMode.Single);
            AddToScene(scene);
            EditorSceneManager.SaveScene(scene,ScenePath);
            AssetDatabase.Refresh();
        }

        public static void AddToScene(Scene scene)
        {
            GameObject root=FindInScene(scene,"AfriLife Walkable Player");
            if(root==null)
            {
                root = new GameObject("AfriLife Walkable Player");
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
            }
            else
            {
                // Missing components can be added without replacing a saved
                // scene's already-authored player and placement.
                if(root.GetComponent<CharacterController>()==null)
                    root.AddComponent<CharacterController>();
                if(root.GetComponent<FirstNeighborhoodWalkController>()==null)
                    root.AddComponent<FirstNeighborhoodWalkController>();
            }

            AddMarker(scene,"home","Home Entrance",-11f,-6.5f);
            AddMarker(scene,"market","Market Counter",9f,-4.8f);
            AddMarker(scene,"workplace","Workplace Entry",10f,4.8f);
            AddMarker(scene,"bank","Bill Payment Bank",-7f,7.3f);
            AddMarker(scene,"park","Small Activity Park",2f,2f);
            AddMarker(scene,"neighbor","Neighbor Gathering Spot",6f,3.0f);
            AddClinicMarker(scene);
            AddResidents(scene);
            AddActivityProps(scene);

            Camera camera=FindSceneCamera(scene);
            if (camera!=null)
            {
                var follow=camera.gameObject.GetComponent<FirstNeighborhoodCameraFollow>();
                if(follow==null)follow=camera.gameObject.AddComponent<FirstNeighborhoodCameraFollow>();
                follow.Target=root.transform;
                camera.transform.position=root.transform.position+follow.Offset;
            }

            EditorSceneManager.MarkSceneDirty(scene);
        }

        [MenuItem("AfriLife/Add Clinic Errand Marker")]
        public static void UpgradeClinic()
        {
            if(!System.IO.File.Exists(ScenePath))return;
            if(!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())return;
            Scene scene=EditorSceneManager.OpenScene(ScenePath,OpenSceneMode.Single);
            AddClinicMarker(scene);
            EditorSceneManager.SaveScene(scene,ScenePath);
            AssetDatabase.Refresh();
        }

        private static void AddClinicMarker(Scene scene)
        {
            if(FindInScene(scene,"Interact - Clinic Reception")!=null)return;
            AddMarker(scene,"clinic","Clinic Reception",0f,8.9f);
        }

        private static void AddResidents(Scene scene)
        {
            SpawnResident(scene,"prototype-resident-ada","Ada",new Vector3(6f,0f,3f));
            SpawnResident(scene,"prototype-resident-bola","Bola",new Vector3(8f,0f,-5f));
            SpawnResident(scene,"prototype-resident-kwame","Kwame",new Vector3(3f,0f,3f));
        }

        private static void SpawnResident(Scene scene,string id,string name,Vector3 location)
        {
            if(FindInScene(scene,"Resident - "+name)!=null)return;
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

        /// <summary>Non-destructive original blockout activity props.</summary>
        public static void AddActivityProps(Scene scene)
        {
            AddProp(scene,"home-bed","Bed and Rest","home",-11.7f,-5.6f,
                "wake","sit-or-lie-down","sleep","save-and-reload");
            AddProp(scene,"home-sink","Shower Basin","home",-12.2f,-6.2f,"shower");
            AddProp(scene,"home-wardrobe","Wardrobe","home",-10.1f,-6.1f,"dress");
            AddProp(scene,"home-table","Breakfast Table","home",-11f,-6.2f,"eat");
            AddProp(scene,"home-phone","Phone and Data","home",-10.3f,-5.5f,
                "use-phone","buy-mobile-data");
            AddProp(scene,"home-door","Home Entry","home",-11f,-6.9f,"return-home");
            AddProp(scene,"work-desk","Work Desk","workplace",10f,4.8f,
                "travel-or-drive","work","earn-money");
            AddProp(scene,"market-counter","Grocery Counter","market",9f,-4.8f,"shop");
            AddProp(scene,"park-area","Park Activity","park",2f,2f,"exercise");
            AddProp(scene,"neighbor-circle","Neighbor Meeting","neighbor",6f,3f,
                "interact-with-persistent-npcs");
            AddProp(scene,"bank-window","Bill Window","bank",-7f,7.3f,"pay-bills");
        }

        private static void AddProp(Scene scene,string id,string label,string site,
            float x,float z,params string[] steps)
        {
            string name="Activity - "+label;
            GameObject obj=FindInScene(scene,name);
            if(obj==null)
            {
                obj=GameObject.CreatePrimitive(PrimitiveType.Cube);
                obj.name=name;
                obj.transform.position=new Vector3(x,0.45f,z);
                obj.transform.localScale=new Vector3(0.48f,0.65f,0.48f);
                var collider=obj.GetComponent<Collider>();
                // Props indicate a place to interact, not a solid obstruction
                // trapping the player in the blockout exterior.
                if(collider!=null)Object.DestroyImmediate(collider);
            }
            var prop=obj.GetComponent<FirstNeighborhoodActivityProp>();
            if(prop==null)prop=obj.AddComponent<FirstNeighborhoodActivityProp>();
            prop.PropId=id;
            prop.DisplayName=label;
            prop.SiteId=site;
            prop.StepIds=steps;
            prop.ReachMeters=3f;
        }

        private static void AddMarker(Scene scene,string id,string name,float x,float z)
        {
            GameObject existing=FindInScene(scene,"Interact - "+name);
            if(existing!=null)
            {
                var marker=existing.GetComponent<FirstNeighborhoodInteractionPoint>();
                if(marker==null)marker=existing.AddComponent<FirstNeighborhoodInteractionPoint>();
                marker.SiteId=id;
                marker.DisplayName=name;
                return;
            }
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
