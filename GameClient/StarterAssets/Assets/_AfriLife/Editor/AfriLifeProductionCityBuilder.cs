#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using AfriLife.Gameplay.FirstNeighborhood;
using AfriLife.World.Production;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Rendering;

namespace AfriLife.Editor
{
    // Independent, physically walkable city scene authoring. Existing first-day
    // NPC identities, activity sites and player save loop are never discarded.
    public static class AfriLifeProductionCityBuilder
    {
        public const string LagosScene = "Assets/_AfriLife/Scenes/ProductionLagos.unity";
        public const string AccraScene = "Assets/_AfriLife/Scenes/ProductionAccra.unity";
        private const string OriginalScene = "Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";
        private const string AssetRoot = "Assets/_AfriLife/ProductionCities";
        private static readonly Dictionary<string, Material> Palette =
            new Dictionary<string, Material>(StringComparer.Ordinal);
        private static string _city;

        [MenuItem("AfriLife/Cities/Create Lagos and Accra")]
        public static void Create()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException("Exit Play Mode.");
            if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo()) return;
            CreateAll();
        }
        public static void CreateAll()
        {
            if (!File.Exists(OriginalScene))
                FirstNeighborhoodPrototypeSceneBuilder.BuildUnattended();
            CreateCity("lagos", "NG", "Lagos, Nigeria", LagosScene, true);
            CreateCity("accra", "GH", "Accra, Ghana", AccraScene, false);
            List<EditorBuildSettingsScene> scenes = EditorBuildSettings.scenes.ToList();
            foreach (string path in new[] { LagosScene, AccraScene })
                if (!scenes.Any(s => s.path == path))
                    scenes.Add(new EditorBuildSettingsScene(path, true));
            EditorBuildSettings.scenes = scenes.ToArray();
            AssetDatabase.SaveAssets();
            Debug.Log("AFRILIFE_CITY_BUILD_RESULT=SUCCESS Lagos=" +
                File.Exists(LagosScene) + " Accra=" + File.Exists(AccraScene));
        }
        public static void Batch()
        {
            try
            {
                CreateAll();
                if (!File.Exists(LagosScene) || !File.Exists(AccraScene))
                    throw new InvalidOperationException("Both city scenes required.");
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                Debug.LogException(ex);
                Debug.LogError("AFRILIFE_CITY_BUILD_RESULT=FAILED");
                EditorApplication.Exit(1);
            }
        }
        [MenuItem("AfriLife/Cities/Open Lagos")]
        public static void OpenLagos() { Open(LagosScene); }
        [MenuItem("AfriLife/Cities/Open Accra")]
        public static void OpenAccra() { Open(AccraScene); }
        private static void Open(string path)
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode) return;
            if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo()) return;
            if (!File.Exists(path))
                throw new InvalidOperationException("Create AfriLife cities first.");
            EditorSceneManager.OpenScene(path, OpenSceneMode.Single);
        }
        private static void CreateCity(string id, string country, string name,
            string destination, bool localEconomy)
        {
            if (File.Exists(destination))
            {
                Debug.Log("Preserved existing authored city: " + destination);
                return;
            }
            Scene source = EditorSceneManager.OpenScene(OriginalScene, OpenSceneMode.Single);
            if (Find<FirstNeighborhoodWalkController>(source).Length != 1 ||
                Find<FirstNeighborhoodResidentAgent>(source).Length != 3 ||
                Find<FirstNeighborhoodInteractionPoint>(source).Length < 7)
                throw new InvalidOperationException(
                    "Original daily life scene must have player, 3 residents and 7 service sites.");
            if (!EditorSceneManager.SaveScene(source, destination, true))
                throw new InvalidOperationException("Unable to copy city source scene.");

            Scene scene = EditorSceneManager.OpenScene(destination, OpenSceneMode.Single);
            _city = id;
            PrepareMaterials();
            var root = new GameObject("AfriLife Living " + name);
            var info = root.AddComponent<AfriLifeProductionCityIdentity>();
            info.Configure(id, country, name, localEconomy);

            // Hide copied blockout render/collision only; retain gameplay actors
            // and all original home/market/work/clinic interaction destinations.
            foreach (GameObject original in scene.GetRootGameObjects())
            {
                if (!new[] { "Ground - Prototype Square", "Home", "Grocery Market",
                    "Workplace", "Bank", "Clinic" }.Contains(original.name)) continue;
                Renderer r = original.GetComponent<Renderer>();
                if (r != null) r.enabled = false;
                Collider c = original.GetComponent<Collider>();
                if (c != null) c.enabled = false;
            }

            Transform map = root.transform;
            Block(map, "Walkable District Ground", new Vector3(0f,-0.17f,0f),
                new Vector3(92f,0.34f,92f), "earth", true);
            BuildRoads(map);
            BuildServices(map, id);
            BuildHomes(map, id);
            BuildStreetDetail(map, id);
            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = id == "accra" ?
                new Color(0.69f,0.72f,0.77f) : new Color(0.57f,0.68f,0.76f);
            RenderSettings.ambientEquatorColor = new Color(0.4f,0.43f,0.42f);
            RenderSettings.ambientGroundColor = new Color(0.21f,0.21f,0.18f);

            if (!EditorSceneManager.SaveScene(scene))
                throw new InvalidOperationException("Unable to save created city scene.");
            Debug.Log("Created playable AfriLife city " + destination +
                " with physical roads, district buildings, stores and persistent actor anchors.");
        }
        private static void BuildRoads(Transform root)
        {
            Transform roads = Folder(root, "Road Network, Drains and Sidewalks");
            for (int lane = -2; lane <= 2; lane++)
            {
                float axis = lane * 17.2f;
                Block(roads, "North-South Road " + lane,
                    new Vector3(axis,0.018f,0), new Vector3(6f,0.035f,89f),"road",false);
                Block(roads, "East-West Road " + lane,
                    new Vector3(0,0.02f,axis), new Vector3(89f,0.035f,6f),"road",false);
                for (int s = -1; s <= 1; s += 2)
                {
                    Block(roads,"Pedestrian Pavement NS "+lane+" "+s,
                        new Vector3(axis+s*4.1f,0.075f,0f),
                        new Vector3(1.8f,0.14f,89f),"concrete",true);
                    Block(roads,"Pedestrian Pavement EW "+lane+" "+s,
                        new Vector3(0f,0.075f,axis+s*4.1f),
                        new Vector3(89f,0.14f,1.8f),"concrete",true);
                }
                for (int i = -5; i <= 5; i++)
                    Block(roads, "Center Lane Mark "+lane+" "+i,
                        new Vector3(axis,0.041f,i*7.6f),
                        new Vector3(0.14f,0.012f,3.1f),"paint",false);
            }
            // Clear, near-level service paths preserve the gameplay markers.
            foreach (Vector3 location in new[] {
                new Vector3(-11f,0f,-6.5f), new Vector3(9f,0f,-4.8f),
                new Vector3(10f,0f,4.8f), new Vector3(-7f,0f,7.3f),
                new Vector3(0f,0f,8.9f), new Vector3(2f,0f,2f)
            })
                Block(roads,"Service Walkway",new Vector3(location.x,0.018f,location.z),
                    new Vector3(1.9f,0.018f,1.9f),"concrete",false);
        }
        private static void BuildServices(Transform root, string id)
        {
            Transform sites = Folder(root, "Playable Home, Bank, Market, Workplace and Clinic");
            Building(sites,"Family Home",-11f,-10f,5f,4f,5f,"plaster");
            Building(sites,"Neighbourhood Market",9f,-8.7f,7f,3.4f,2.9f,"market");
            Building(sites,"Community Workplace",10f,9f,7.4f,6f,5f,"plaster");
            Building(sites,"Bank",-7f,11f,5f,6f,4f,"concrete");
            Building(sites,"Local Clinic",0f,13.0f,5.5f,4f,4.2f,"plaster");
            for (int i = 0; i < 4; i++)
            {
                float x = 5f + i * 2f;
                Block(sites,"Market Sales Counter " + i,
                    new Vector3(x,0.52f,-12f),
                    new Vector3(1.8f,1.04f,1.0f),"wood",true);
                Block(sites,"Market Awning " + i,
                    new Vector3(x,2.55f,-12f),
                    new Vector3(2.0f,0.13f,1.9f),"market",false);
            }
        }
        private static void Building(Transform root,string name,
            float x,float z,float width,float height,float depth,string facade)
        {
            Transform structure = Folder(root,name);
            Block(structure,"Structural Facade",
                new Vector3(x,height*0.5f,z),new Vector3(width,height,depth),facade,true);
            Block(structure,"Roof Sheets",
                new Vector3(x,height+0.2f,z),
                new Vector3(width+0.5f,0.40f,depth+0.5f),"roof",false);
            Block(structure,"Entrance Panel",
                new Vector3(x,1.3f,z+depth*0.5f+0.055f),
                new Vector3(1.30f,2.35f,0.08f),"wood",false);
            for (int window = -1; window <= 1; window += 2)
            {
                Block(structure,"Glass Window "+window,
                    new Vector3(x+window*width*0.3f,2.1f,z+depth*0.5f+0.06f),
                    new Vector3(0.95f,1.05f,0.1f),"glass",false);
                Block(structure,"Window Shade "+window,
                    new Vector3(x+window*width*0.3f,2.75f,z+depth*0.5f+0.2f),
                    new Vector3(1.1f,0.11f,0.45f),"roof",false);
            }
        }
        private static void BuildHomes(Transform root,string id)
        {
            Transform homes=Folder(root,"Residential and Mixed-Use Street Facades");
            for(int side=-1;side<=1;side+=2)
                for(int i=0;i<8;i++)
                {
                    float x=side*(25f+(i%2)*7.5f);
                    float z=-31f+i*8f;
                    float height=4f+(i%3)*2.1f;
                    Building(homes,(id=="accra"?"Accra ":"Lagos ")+"House "+side+" "+i,
                        x,z,5.4f,height,4.8f,i%3==0?"brick":"plaster");
                }
        }
        private static void BuildStreetDetail(Transform root,string id)
        {
            Transform props=Folder(root,"Local Trade, Utility Poles and Street Furniture");
            for(int i=-4;i<=4;i++)
            {
                float x=i*9.2f;
                Block(props,"Drainage Cover "+i,new Vector3(x,0.035f,-15f),
                    new Vector3(0.28f,0.04f,12f),"metal",false);
                Block(props,"Power Pole "+i,new Vector3(x,3f,-21f),
                    new Vector3(0.18f,6f,0.18f),"wood",true);
                Block(props,"Power Crossbar "+i,new Vector3(x,5.7f,-21f),
                    new Vector3(2f,0.12f,0.15f),"metal",false);
            }
            for(int i=0;i<10;i++)
            {
                float x=-31f+(i%5)*15f;
                float z=i<5 ? 31f : -31f;
                Block(props,"Roadside Trading Booth "+i,
                    new Vector3(x,0.55f,z),
                    new Vector3(2.1f,1.1f,1.35f),"wood",true);
                Block(props,"Colourful Stall Roof "+i,
                    new Vector3(x,2.15f,z),
                    new Vector3(2.5f,0.13f,2.0f),i%2==0?"market":"roof",false);
            }
        }
        private static void PrepareMaterials()
        {
            Palette.Clear();
            string folder="Assets/_AfriLife/ProductionCities/"+_city;
            EnsureFolder(folder+"/Textures");
            EnsureFolder(folder+"/Materials");
            MaterialAsset(folder,"earth",new Color(0.49f,0.38f,0.28f),0f,0.12f);
            MaterialAsset(folder,"road",new Color(0.20f,0.21f,0.23f),0f,0.14f);
            MaterialAsset(folder,"concrete",new Color(0.55f,0.54f,0.50f),0.02f,0.18f);
            MaterialAsset(folder,"plaster",new Color(0.69f,0.61f,0.49f),0.02f,0.16f);
            MaterialAsset(folder,"brick",new Color(0.52f,0.27f,0.19f),0f,0.13f);
            MaterialAsset(folder,"roof",new Color(0.52f,0.32f,0.28f),0.48f,0.32f);
            MaterialAsset(folder,"glass",new Color(0.13f,0.25f,0.31f),0.4f,0.7f);
            MaterialAsset(folder,"market",new Color(0.82f,0.56f,0.18f),0.05f,0.2f);
            MaterialAsset(folder,"wood",new Color(0.37f,0.26f,0.18f),0f,0.13f);
            MaterialAsset(folder,"metal",new Color(0.38f,0.42f,0.44f),0.7f,0.37f);
            MaterialAsset(folder,"paint",new Color(0.90f,0.83f,0.58f),0f,0.21f);
        }
        private static void MaterialAsset(string folder,string key,
            Color color,float metallic,float smoothness)
        {
            string texturePath=folder+"/Textures/"+key+".png";
            Texture2D existing=AssetDatabase.LoadAssetAtPath<Texture2D>(texturePath);
            if(existing==null)
            {
                var image=new Texture2D(256,256,TextureFormat.RGBA32,false);
                Color[] pixels=new Color[256*256];
                int seed=key.Length*17;
                for(int y=0;y<256;y++)
                    for(int x=0;x<256;x++)
                    {
                        float n=Mathf.PerlinNoise((x+seed)*0.09f,(y+seed)*0.09f);
                        float m=Mathf.PerlinNoise((x+seed)*0.38f,(y+seed)*0.38f);
                        float shade=0.80f+0.26f*n+0.13f*m;
                        if(key=="brick" && (y%26<2 ||
                            (x+(y/26%2)*23)%48<2))shade*=0.58f;
                        if(key=="roof" && x%22<3)shade*=0.73f;
                        pixels[y*256+x]=new Color(
                            Mathf.Clamp01(color.r*shade),
                            Mathf.Clamp01(color.g*shade),
                            Mathf.Clamp01(color.b*shade),1f);
                    }
                image.SetPixels(pixels);image.Apply();
                File.WriteAllBytes(texturePath,image.EncodeToPNG());
                UnityEngine.Object.DestroyImmediate(image);
                AssetDatabase.ImportAsset(texturePath);
                TextureImporter importer=AssetImporter.GetAtPath(texturePath) as TextureImporter;
                if(importer!=null)
                {
                    importer.mipmapEnabled=true;
                    importer.wrapMode=TextureWrapMode.Repeat;
                    importer.textureCompression=TextureImporterCompression.Compressed;
                    importer.SaveAndReimport();
                }
                existing=AssetDatabase.LoadAssetAtPath<Texture2D>(texturePath);
            }
            string materialPath=folder+"/Materials/"+key+".mat";
            Material mat=AssetDatabase.LoadAssetAtPath<Material>(materialPath);
            if(mat==null)
            {
                Shader urp=Shader.Find("Universal Render Pipeline/Lit");
                if(urp==null)throw new InvalidOperationException(
                    "Unity 6 URP/Lit is required.");
                mat=new Material(urp){name="AfriLife "+_city+" "+key};
                mat.SetColor("_BaseColor",Color.white);
                mat.SetTexture("_BaseMap",existing);
                mat.SetFloat("_Metallic",metallic);
                mat.SetFloat("_Smoothness",smoothness);
                AssetDatabase.CreateAsset(mat,materialPath);
            }
            Palette.Add(key,mat);
        }
        private static Transform Folder(Transform root,string name)
        {
            GameObject obj=new GameObject(name);
            obj.transform.SetParent(root,false);
            return obj.transform;
        }
        private static GameObject Block(Transform root,string name,
            Vector3 position,Vector3 scale,string material,bool physical)
        {
            GameObject obj=GameObject.CreatePrimitive(PrimitiveType.Cube);
            obj.name=name;
            obj.transform.SetParent(root,false);
            obj.transform.localPosition=position;
            obj.transform.localScale=scale;
            obj.GetComponent<MeshRenderer>().sharedMaterial=Palette[material];
            if(!physical)UnityEngine.Object.DestroyImmediate(obj.GetComponent<Collider>());
            obj.isStatic=true;
            return obj;
        }
        private static void EnsureFolder(string path)
        {
            if(path=="Assets" || AssetDatabase.IsValidFolder(path))return;
            string parent=path.Substring(0,path.LastIndexOf('/'));
            EnsureFolder(parent);
            AssetDatabase.CreateFolder(parent,path.Substring(path.LastIndexOf('/')+1));
        }
        private static T[] Find<T>(Scene scene) where T:Component=>
            scene.GetRootGameObjects().SelectMany(g=>g.GetComponentsInChildren<T>(true)).ToArray();
    }
}
#endif
