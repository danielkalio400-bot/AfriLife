#if UNITY_EDITOR
using System;
using System.Linq;
using AfriLife.Gameplay.FirstNeighborhood;
using AfriLife.World.Travel;
using AfriLife.World.Production;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace AfriLife.Editor
{
    // Non-destructive upgrade for the two existing, locally generated Unity
    // scenes. Keeps all resident/player roots, imported art and custom geometry.
    public static class AfriLifeWorldNavigationInstaller
    {
        [MenuItem("AfriLife/World/Install Nigeria Ghana Travel")]
        public static void InstallMenu()
        {
            if(EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException("Exit Play Mode before installing.");
            if(!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())return;
            Install();
        }

        public static void Install()
        {
            Upgrade(AfriLifeTravelCatalog.LagosScene,"lagos");
            Upgrade(AfriLifeTravelCatalog.AccraScene,"accra");
            Debug.Log("AFRILIFE_TRAVEL_BUILD_RESULT=SUCCESS");
        }

        private static void Upgrade(string path,string expectedCityId)
        {
            if(AssetDatabase.LoadAssetAtPath<SceneAsset>(path)==null)
                throw new InvalidOperationException(
                    "Author your actual city scene before installing travel: "+path);
            Scene scene=EditorSceneManager.OpenScene(path,OpenSceneMode.Single);
            var identities=scene.GetRootGameObjects().SelectMany(
                r=>r.GetComponentsInChildren<AfriLifeProductionCityIdentity>(true)).ToArray();
            if(identities.Length!=1||identities[0].CityId!=expectedCityId)
                throw new InvalidOperationException(
                    "Incorrect city identity. Refusing to modify "+path);
            var actors=scene.GetRootGameObjects().SelectMany(
                r=>r.GetComponentsInChildren<FirstNeighborhoodWalkController>(true)).ToArray();
            if(actors.Length!=1)
                throw new InvalidOperationException(
                    "Expected exactly one preserved player actor in "+path);

            bool changed=false;
            GameObject host=identities[0].gameObject;
            if(host.GetComponent<AfriLifeWorldNavigator>()==null)
            {
                host.AddComponent<AfriLifeWorldNavigator>();
                changed=true;
            }
            if(host.GetComponent<AfriLifeCityDiscoveryHud>()==null)
            {
                host.AddComponent<AfriLifeCityDiscoveryHud>();
                changed=true;
            }

            // The original FirstNeighborhoodPrototypeLoop explicitly rejects
            // non-Lagos save locations and always uses NGN. Do not activate
            // that Nigeria-only economy and journal in Ghana by mistake.
            if(expectedCityId=="accra")
            {
                var legacyHud=scene.GetRootGameObjects().SelectMany(
                    r=>r.GetComponentsInChildren<FirstNeighborhoodPrototypeHud>(true)).ToArray();
                foreach(FirstNeighborhoodPrototypeHud hud in legacyHud)
                    if(hud.enabled)
                    {
                        hud.enabled=false;
                        changed=true;
                    }
            }

            if(changed)
            {
                EditorSceneManager.MarkSceneDirty(scene);
                if(!EditorSceneManager.SaveScene(scene))
                    throw new InvalidOperationException(
                        "Unable to save travel controls into city scene: "+path);
            }
            Debug.Log("AfriLife world travel installed; city="+expectedCityId+
                ", changed="+changed+", preserved="+path);
        }
    }
}
#endif
