using UnityEngine;
namespace AfriLife.World.Production
{
    [DisallowMultipleComponent]
    public sealed class AfriLifeProductionCityIdentity : MonoBehaviour
    {
        [SerializeField] private string cityId;
        [SerializeField] private string countryIso2;
        [SerializeField] private string displayName;
        [SerializeField] private bool localizedEconomy;
        [SerializeField] private int targetAreaKm2;
        [SerializeField] private float targetWidthKm;
        [SerializeField] private float targetHeightKm;
        public int TargetAreaKm2 => targetAreaKm2;
        public float TargetWidthKm => targetWidthKm;
        public float TargetHeightKm => targetHeightKm;
        public void SetMapTarget(int areaKm2,float widthKm,float heightKm)
        {
            if(areaKm2<=0||widthKm<=0||heightKm<=0)
                throw new System.ArgumentOutOfRangeException(nameof(areaKm2));
            targetAreaKm2=areaKm2;
            targetWidthKm=widthKm;
            targetHeightKm=heightKm;
        }
        public string CityId => cityId;
        public string CountryIso2 => countryIso2;
        public string DisplayName => displayName;
        public bool LocalizedEconomy => localizedEconomy;
        public void Configure(string id, string country, string name, bool localized)
        {
            cityId = id; countryIso2 = country;
            displayName = name; localizedEconomy = localized;
        }
    }
}
