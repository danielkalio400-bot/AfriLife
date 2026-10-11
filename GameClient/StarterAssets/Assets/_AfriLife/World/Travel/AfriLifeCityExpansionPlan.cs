using System;
using System.Linq;

namespace AfriLife.World.Travel
{
    // Proposed gameplay FOOTPRINTS, not land ownership or real municipal areas.
    // Only the ten approved priority locations are active; only Lagos/Accra have authored scenes.
    [Serializable]
    public sealed class AfriLifePlannedCity
    {
        public string Id;
        public string DisplayName;
        public string DivisionId;
        public string CountryIso2;
        public int TargetAreaKm2;
        public AfriLifePlannedCity(string id,string name,string division,string country,int area)
        { Id=id;DisplayName=name;DivisionId=division;CountryIso2=country;TargetAreaKm2=area; }
        public double TargetSquareSideKm => Math.Sqrt(TargetAreaKm2);
        public double TargetAcres => TargetAreaKm2 * 247.105381467;
        public bool HasAuthoredScene => AfriLifeTravelCatalog.FindCity(Id)?.SceneAuthored ?? false;
    }

    public static class AfriLifeCityExpansionPlan
    {
        // Approved scope: six Nigerian states/FCT and four Ghanaian regions. No other city is in active production.
        public static readonly AfriLifePlannedCity[] Cities = {
            new AfriLifePlannedCity("enugu","Enugu","ng-enugu","NG",98),
            new AfriLifePlannedCity("kano","Kano","ng-kano","NG",128),
            new AfriLifePlannedCity("lagos","Lagos","ng-lagos","NG",200),
            new AfriLifePlannedCity("ibadan","Ibadan","ng-oyo","NG",162),
            new AfriLifePlannedCity("port-harcourt","Port Harcourt","ng-rivers","NG",128),
            new AfriLifePlannedCity("abuja","Abuja","ng-fct","NG",200),
            new AfriLifePlannedCity("kumasi","Kumasi","gh-ashanti","GH",128),
            new AfriLifePlannedCity("accra","Accra","gh-greater-accra","GH",128),
            new AfriLifePlannedCity("tamale","Tamale","gh-northern","GH",98),
            new AfriLifePlannedCity("sekondi-takoradi","Sekondi-Takoradi","gh-western","GH",98),
        };
        public static AfriLifePlannedCity Find(string id) => Cities.FirstOrDefault(c=>c.Id==id);
        public static AfriLifePlannedCity[] InDivision(string division) => Cities.Where(c=>c.DivisionId==division).ToArray();
        public static AfriLifePlannedCity[] InCountry(string country) => Cities.Where(c=>c.CountryIso2==country).ToArray();
        public static int TotalAreaKm2 => Cities.Sum(c=>c.TargetAreaKm2);
    }
}
