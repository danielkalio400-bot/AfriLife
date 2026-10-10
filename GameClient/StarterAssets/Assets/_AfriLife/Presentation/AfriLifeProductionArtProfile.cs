using UnityEngine;

namespace AfriLife.Presentation
{
    // A production artist explicitly provides legal, imported URP-ready assets.
    // This asset stores references only, not generated faux-realistic geometry.
    [CreateAssetMenu(fileName = "AfriLifeProductionArtProfile",
        menuName = "AfriLife/Production Art Profile")]
    public sealed class AfriLifeProductionArtProfile : ScriptableObject
    {
        [Header("Rigged humanoids")]
        [SerializeField] private GameObject playerPrefab;
        [SerializeField] private GameObject adaPrefab;
        [SerializeField] private GameObject bolaPrefab;
        [SerializeField] private GameObject kwamePrefab;
        [Header("Authored Nigeria/Ghana neighborhood with colliders")]
        [SerializeField] private GameObject neighborhoodPrefab;

        public GameObject PlayerPrefab => playerPrefab;
        public GameObject AdaPrefab => adaPrefab;
        public GameObject BolaPrefab => bolaPrefab;
        public GameObject KwamePrefab => kwamePrefab;
        public GameObject NeighborhoodPrefab => neighborhoodPrefab;
    }
}
