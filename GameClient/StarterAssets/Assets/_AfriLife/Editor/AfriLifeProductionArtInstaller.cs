#if UNITY_EDITOR
using System;
using System.Linq;
using AfriLife.Gameplay.FirstNeighborhood;
using AfriLife.Presentation;
using UnityEngine.AI;
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
            AfriLifeProductionArtProfile profile = LoadProfile();
            GameObject player = Find(scene, "AfriLife Walkable Player");
            GameObject ada = Find(scene, "Resident - Ada");
            GameObject bola = Find(scene, "Resident - Bola");
            GameObject kwame = Find(scene, "Resident - Kwame");
            if (player == null || ada == null || bola == null || kwame == null ||
                player.GetComponent<FirstNeighborhoodWalkController>() == null ||
                new[] { ada, bola, kwame }.Any(obj =>
                    obj.GetComponent<FirstNeighborhoodResidentAgent>() == null))
                throw new InvalidOperationException("Gameplay actors are incomplete.");

            VerifyInstalled(Find(scene, "AfriLife Production Neighborhood"),
                profile.NeighborhoodPrefab, "neighborhood", true, false);
            VerifyInstalled(Find(scene, "AfriLife Production Player"),
                profile.PlayerPrefab, "player", false, true);
            VerifyInstalled(Find(scene, "AfriLife Production Ada"),
                profile.AdaPrefab, "Ada", false, true);
            VerifyInstalled(Find(scene, "AfriLife Production Bola"),
                profile.BolaPrefab, "Bola", false, true);
            VerifyInstalled(Find(scene, "AfriLife Production Kwame"),
                profile.KwamePrefab, "Kwame", false, true);

            GameObject[] residents = { ada, bola, kwame };
            if (residents.Any(resident =>
                resident.GetComponent<NavMeshAgent>() == null))
                throw new InvalidOperationException(
                    "Production residents require NavMeshAgent components. Bake a usable walkable NavMesh before Play Mode.");
            ValidateNavigationRoutes(residents);

            foreach (string name in new[] { "Ground - Prototype Square", "Home",
                "Grocery Market", "Workplace", "Bank", "Clinic" })
            {
                GameObject blockout = FindSceneRoot(scene, name);
                if (blockout != null && blockout.GetComponent<Renderer>() is Renderer legacy &&
                    legacy.enabled)
                    throw new InvalidOperationException("Blockout renderer remains visible: " + name);
            }

            Debug.Log("AfriLife installed prefab sources, enabled humanoid controllers and physical world colliders verified. Manual realism and device QA remain required.");
        }

        // Real geometry must support connected walkable routes, not merely a
        // NavMeshAgent component on each imported resident.
        private static void ValidateNavigationRoutes(GameObject[] residents)
        {
            Vector3[] neighborhoodDestinations =
            {
                new Vector3(-9f, 0f, -6f),  // home
                new Vector3(8f, 0f, -5f),   // market
                new Vector3(3f, 0f, 3f),    // park
                new Vector3(6f, 0f, 3f)     // neighbor gathering
            };

            NavMeshPath route = new NavMeshPath();
            foreach (GameObject resident in residents)
            {
                NavMeshAgent agent = resident.GetComponent<NavMeshAgent>();
                if (agent == null || !agent.enabled)
                    throw new InvalidOperationException(
                        resident.name + " needs an enabled NavMeshAgent.");
                if (!NavMesh.SamplePosition(resident.transform.position,
                    out NavMeshHit spawn, 3f, NavMesh.AllAreas))
                    throw new InvalidOperationException(
                        "No baked walkable NavMesh within 3 m of " + resident.name +
                        ". Rebuild navigation after importing the realistic environment.");

                foreach (Vector3 destination in neighborhoodDestinations)
                {
                    if (!NavMesh.SamplePosition(destination,
                        out NavMeshHit goal, 3f, NavMesh.AllAreas))
                        throw new InvalidOperationException(
                            "Missing walkable NavMesh near neighborhood destination " +
                            destination + ". Preserve gameplay service access.");

                    if (!NavMesh.CalculatePath(spawn.position, goal.position,
                        NavMesh.AllAreas, route) ||
                        route.status != NavMeshPathStatus.PathComplete)
                        throw new InvalidOperationException(
                            "Resident " + resident.name +
                            " cannot reach neighborhood service at " + destination +
                            ". Check buildings, road connections, Navigation areas and links.");
                }
            }
        }

        private static void ReplaceResident(Scene scene, GameObject resident, GameObject prefab)
        {
            string name = "AfriLife Production " + resident.GetComponent<FirstNeighborhoodResidentAgent>().DisplayName;
            // Existing resident spawn roots are centered 1 m above ground.
            GameObject visual = EnsurePrefab(prefab, scene, resident.transform,
                name, Vector3.down);
            EnsureMotionBridge(visual, resident.transform);
            EnsureResidentNavigation(resident);
            Renderer oldRenderer = resident.GetComponent<Renderer>();
            if (oldRenderer != null && oldRenderer.enabled)
            {
                Undo.RecordObject(oldRenderer, "Hide AfriLife resident capsule");
                oldRenderer.enabled = false;
            }
        }

        // Production residents require authored/baked walkable Navigation surfaces.
        // An agent without a baked NavMesh holds position rather than crossing walls.
        private static void EnsureResidentNavigation(GameObject resident)
        {
            NavMeshAgent navigation = resident.GetComponent<NavMeshAgent>();
            if (navigation == null) navigation = Undo.AddComponent<NavMeshAgent>(resident);
            Undo.RecordObject(navigation, "Configure AfriLife resident pathfinding");
            FirstNeighborhoodResidentAgent behavior =
                resident.GetComponent<FirstNeighborhoodResidentAgent>();
            navigation.speed = behavior != null ? Mathf.Max(0.2f, behavior.Speed) : 1.2f;
            navigation.radius = 0.32f;
            navigation.height = 1.8f;
            // Original resident gameplay anchors are authored 1 meter above ground.
            navigation.baseOffset = -1f;
            navigation.acceleration = 7f;
            navigation.angularSpeed = 480f;
            navigation.stoppingDistance = 0.3f;
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

        // Verify artist-imported prefab identity and active runtime components.
        // A same-named empty GameObject must never pass as realistic production art.
        private static void VerifyInstalled(GameObject instance, GameObject expected,
            string label, bool requireCollider, bool requireHumanoid)
        {
            if (instance == null || !instance.activeInHierarchy)
                throw new InvalidOperationException("Missing or inactive production " + label);
            GameObject source = PrefabUtility.GetCorrespondingObjectFromSource(instance);
            if (expected == null || source != expected)
                throw new InvalidOperationException(
                    "Production " + label + " is not the prefab assigned in the art profile.");

            if (!instance.GetComponentsInChildren<Renderer>(true)
                .Any(renderer => renderer != null && renderer.enabled &&
                    renderer.gameObject.activeInHierarchy))
                throw new InvalidOperationException(
                    "Production " + label + " needs an active visible renderer.");

            if (requireCollider && !instance.GetComponentsInChildren<Collider>(true)
                .Any(collider => collider != null && collider.enabled &&
                    collider.gameObject.activeInHierarchy && !collider.isTrigger))
                throw new InvalidOperationException(
                    "Production " + label + " needs physical, enabled, non-trigger colliders.");

            if (requireHumanoid && !instance.GetComponentsInChildren<Animator>(true)
                .Any(animator => animator != null && animator.enabled &&
                    animator.gameObject.activeInHierarchy &&
                    animator.avatar != null && animator.avatar.isHuman &&
                    animator.runtimeAnimatorController != null))
                throw new InvalidOperationException(
                    "Production " + label + " needs an enabled Humanoid Animator Controller.");
        }

        private static void HideLegacyObject(GameObject obj)
        {
            if (obj == null) return;
            // A blockout root can contain locally authored scripts, markers or props.
            // Suppress only that root's original primitive geometry, never its children.
            Renderer renderer = obj.GetComponent<Renderer>();
            if (renderer != null && renderer.enabled)
            {
                Undo.RecordObject(renderer, "Hide AfriLife legacy renderer");
                renderer.enabled = false;
            }
            Collider collider = obj.GetComponent<Collider>();
            if (collider != null && collider.enabled)
            {
                Undo.RecordObject(collider, "Replace AfriLife legacy collider");
                collider.enabled = false;
            }
        }
    }
}
#endif
