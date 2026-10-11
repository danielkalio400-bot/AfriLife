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
