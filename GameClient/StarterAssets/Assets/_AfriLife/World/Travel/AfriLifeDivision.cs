using System;
namespace AfriLife.World.Travel
{
    [Serializable]
    public sealed class AfriLifeDivision
    {
        public string Id;
        public string CountryIso2;
        public string DisplayName;
        public string Kind;
        public AfriLifeDivision(string id,string country,string name,string kind)
        {
            Id=id;CountryIso2=country;DisplayName=name;Kind=kind;
        }
    }
    [Serializable]
    public sealed class AfriLifeTravelCity
    {
        public string CityId;
        public string DisplayName;
        public string DivisionId;
        public string ScenePath;
        public AfriLifeTravelCity(string id,string name,string division,string scene)
        {
            CityId=id;DisplayName=name;DivisionId=division;ScenePath=scene;
        }
        public bool SceneAuthored => !string.IsNullOrEmpty(ScenePath);
    }
}
