#if UNITY_EDITOR
using System;
using System.Linq;
using AfriLife.Gameplay.FirstNeighborhood;
using AfriLife.Presentation;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    // Converts an existing walkable scene into one using imported, authored world
    // and humanoid models, preserving all gameplay anchor objects and local edits.
    public static class AfriLifeProductionArtInstaller
    {
        private const string ScenePath = "Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity";

        [MenuItem("AfriLife/Production Art/Apply Imported Prefabs")]
        public static void Apply()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException("Exit Play Mode before installing production art.");
            Scene scene = SceneManager.GetActiveScene();
            if (!scene.isLoaded || scene.path != ScenePath)
                throw new InvalidOperationException("Open the saved First Neighborhood scene first.");

            AfriLifeProductionArtProfile profile = LoadProfile();
            CheckHumanoid(profile.PlayerPrefab, "player");
            CheckHumanoid(profile.AdaPrefab, "Ada");
            CheckHumanoid(profile.BolaPrefab, "Bola");
            CheckHumanoid(profile.KwamePrefab, "Kwame");
            CheckEnvironment(profile.NeighborhoodPrefab);

            GameObject player = Find(scene, "AfriLife Walkable Player");
            GameObject ada = Find(scene, "Resident - Ada");
            GameObject bola = Find(scene, "Resident - Bola");
            GameObject kwame = Find(scene, "Resident - Kwame");
            if (player == null || ada == null || bola == null || kwame == null ||
                player.GetComponent<FirstNeighborhoodWalkController>() == null ||
                new[] { ada, bola, kwame }.Any(obj =>
                    obj.GetComponent<FirstNeighborhoodResidentAgent>() == null))
                throw new InvalidOperationException(
                    "Player and three residents must exist in this scene. No modifications were made.");

            GameObject world = EnsurePrefab(profile.NeighborhoodPrefab, scene,
                null, "AfriLife Production Neighborhood", Vector3.zero);
            if (world == null)
                throw new InvalidOperationException("Neighborhood prefab could not be installed.");

            foreach (string name in new[] { "Ground - Prototype Square", "Home",
                "Grocery Market", "Workplace", "Bank", "Clinic" })
                HideLegacyObject(FindSceneRoot(scene, name));

            GameObject visual = EnsurePrefab(profile.PlayerPrefab, scene,
                player.transform, "AfriLife Production Player", Vector3.zero);
            EnsureMotionBridge(visual, player.transform);
            HideLegacyObject(Find(scene, "Original Player Capsule"));

            ReplaceResident(scene, ada, profile.AdaPrefab);
            ReplaceResident(scene, bola, profile.BolaPrefab);
            ReplaceResident(scene, kwame, profile.KwamePrefab);

            // Activity points remain functional. Hide only their blockout graphics,
            // not the interaction scripts, triggers or save-state references.
            foreach (GameObject root in scene.GetRootGameObjects())
            {
                foreach (Renderer renderer in root.GetComponentsInChildren<Renderer>(true))
                {
                    if (!renderer.gameObject.name.StartsWith("Interact - ", StringComparison.Ordinal) &&
                        !renderer.gameObject.name.StartsWith("Activity - ", StringComparison.Ordinal))
                        continue;
                    if (!renderer.enabled) continue;
                    Undo.RecordObject(renderer, "Hide AfriLife guide geometry");
                    renderer.enabled = false;
                }
            }

            EditorSceneManager.MarkSceneDirty(scene);
            Debug.Log("AfriLife production visuals placed. Inspect collision, scale, rigging, skin tones, animations and site access, then save the authored scene.");
        }

        [MenuItem("AfriLife/Production Art/Validate Open Scene")]
        public static void Validate()
        {
            Scene scene = SceneManager.GetActiveScene();
            if (!scene.isLoaded || scene.path != ScenePath)
                throw new InvalidOperationException("Open the saved First Neighborhood scene.");
            if (Find(scene, "AfriLife Production Neighborhood") == null ||
                Find(scene, "AfriLife Production Player") == null ||
                Find(scene, "AfriLife Production Ada") == null ||
                Find(scene, "AfriLife Production Bola") == null ||
                Find(scene, "AfriLife Production Kwame") == null)
                throw new InvalidOperationException("The realistic model references are incomplete.");
            Debug.Log("AfriLife production prefab references found. Manual realism, collision and hardware QA is still required.");
        }

        private static void ReplaceResident(Scene scene, GameObject resident, GameObject prefab)
        {
            string name = "AfriLife Production " + resident.GetComponent<FirstNeighborhoodResidentAgent>().DisplayName;
            // Existing resident spawn roots are centered 1 m above ground.
            GameObject visual = EnsurePrefab(prefab, scene, resident.transform,
                name, Vector3.down);
            EnsureMotionBridge(visual, resident.transform);
            Renderer oldRenderer = resident.GetComponent<Renderer>();
            if (oldRenderer != null && oldRenderer.enabled)
            {
                Undo.RecordObject(oldRenderer, "Hide AfriLife resident capsule");
                oldRenderer.enabled = false;
            }
        }

        private static void EnsureMotionBridge(GameObject avatar, Transform actor)
        {
            AfriLifeCharacterMotionBridge bridge = avatar.GetComponent<AfriLifeCharacterMotionBridge>();
            if (bridge == null) bridge = Undo.AddComponent<AfriLifeCharacterMotionBridge>(avatar);
            bridge.Configure(actor);
        }

        private static AfriLifeProductionArtProfile LoadProfile()
        {
            string[] ids = AssetDatabase.FindAssets("t:AfriLifeProductionArtProfile");
            if (ids.Length != 1)
                throw new InvalidOperationException(
                    "Create exactly one AfriLife Production Art Profile under Assets. Found: " + ids.Length);
            AfriLifeProductionArtProfile result =
                AssetDatabase.LoadAssetAtPath<AfriLifeProductionArtProfile>(
                    AssetDatabase.GUIDToAssetPath(ids[0]));
            if (result == null) throw new InvalidOperationException("Could not load art profile.");
            return result;
        }

        private static void CheckHumanoid(GameObject prefab, string label)
        {
            CheckPrefab(prefab, label, false);
            if (!prefab.GetComponentsInChildren<Animator>(true)
                .Any(animator => animator.avatar != null && animator.avatar.isHuman))
                throw new InvalidOperationException(label + " requires an imported Humanoid Avatar and Animator.");
        }

        private static void CheckEnvironment(GameObject prefab)
        {
            CheckPrefab(prefab, "neighborhood", true);
        }

        private static void CheckPrefab(GameObject prefab, string label, bool needsCollider)
        {
            if (prefab == null || !PrefabUtility.IsPartOfPrefabAsset(prefab))
                throw new InvalidOperationException("Import and assign a prefab asset for " + label + ".");
            if (prefab.GetComponentsInChildren<Renderer>(true).Length == 0)
                throw new InvalidOperationException(label + " prefab must contain visible meshes.");
            if (needsCollider && prefab.GetComponentsInChildren<Collider>(true).Length == 0)
                throw new InvalidOperationException(label + " requires physical colliders.");
        }

        private static GameObject FindSceneRoot(Scene scene, string name)
        {
            foreach (GameObject root in scene.GetRootGameObjects())
                if (root.name == name) return root;
            return null;
        }

        private static GameObject Find(Scene scene, string name)
        {
            foreach (GameObject root in scene.GetRootGameObjects())
                foreach (Transform part in root.GetComponentsInChildren<Transform>(true))
                    if (part.name == name) return part.gameObject;
            return null;
        }

        private static GameObject EnsurePrefab(GameObject prefab, Scene scene,
            Transform parent, string name, Vector3 localPosition)
        {
            GameObject existing = Find(scene, name);
            if (existing != null) return existing; // Preserve placed art.
            GameObject instance = PrefabUtility.InstantiatePrefab(prefab, scene) as GameObject;
            if (instance == null) throw new InvalidOperationException("Cannot instantiate " + name);
            Undo.RegisterCreatedObjectUndo(instance, "Install AfriLife production art");
            instance.name = name;
            if (parent != null) instance.transform.SetParent(parent, false);
            instance.transform.localPosition = localPosition;
            instance.transform.localRotation = Quaternion.identity;
            instance.transform.localScale = Vector3.one;
            return instance;
        }

        private static void HideLegacyObject(GameObject obj)
        {
            if (obj == null || !obj.activeSelf) return;
            Undo.RecordObject(obj, "Hide AfriLife blockout object");
            obj.SetActive(false);
        }
    }
}
#endif
