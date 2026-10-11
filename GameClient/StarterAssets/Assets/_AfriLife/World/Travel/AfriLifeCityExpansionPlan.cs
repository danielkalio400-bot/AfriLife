using System;
using System.Linq;

namespace AfriLife.World.Travel
{
    // Proposed gameplay FOOTPRINTS, not land ownership or real municipal areas.
    // Every state/FCT and region has >=1 proposed city. Only Lagos/Accra have authored scenes.
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
        // Sizes may be increased as streamed districts are produced; no playable scene is created by these rows.
        public static readonly AfriLifePlannedCity[] Cities = {
            new AfriLifePlannedCity("umuahia","Umuahia","ng-abia","NG",64),
            new AfriLifePlannedCity("aba","Aba","ng-abia","NG",25),
            new AfriLifePlannedCity("yola","Yola","ng-adamawa","NG",64),
            new AfriLifePlannedCity("uyo","Uyo","ng-akwa-ibom","NG",64),
            new AfriLifePlannedCity("eket","Eket","ng-akwa-ibom","NG",25),
            new AfriLifePlannedCity("awka","Awka","ng-anambra","NG",64),
            new AfriLifePlannedCity("onitsha","Onitsha","ng-anambra","NG",25),
            new AfriLifePlannedCity("nnewi","Nnewi","ng-anambra","NG",25),
            new AfriLifePlannedCity("bauchi","Bauchi","ng-bauchi","NG",64),
            new AfriLifePlannedCity("yenagoa","Yenagoa","ng-bayelsa","NG",64),
            new AfriLifePlannedCity("makurdi","Makurdi","ng-benue","NG",64),
            new AfriLifePlannedCity("maiduguri","Maiduguri","ng-borno","NG",64),
            new AfriLifePlannedCity("calabar","Calabar","ng-cross-river","NG",64),
            new AfriLifePlannedCity("asaba","Asaba","ng-delta","NG",64),
            new AfriLifePlannedCity("warri","Warri","ng-delta","NG",25),
            new AfriLifePlannedCity("ughelli","Ughelli","ng-delta","NG",25),
            new AfriLifePlannedCity("abakaliki","Abakaliki","ng-ebonyi","NG",64),
            new AfriLifePlannedCity("benin-city","Benin City","ng-edo","NG",64),
            new AfriLifePlannedCity("ado-ekiti","Ado-Ekiti","ng-ekiti","NG",64),
            new AfriLifePlannedCity("enugu","Enugu","ng-enugu","NG",98),
            new AfriLifePlannedCity("nsukka","Nsukka","ng-enugu","NG",25),
            new AfriLifePlannedCity("gombe","Gombe","ng-gombe","NG",64),
            new AfriLifePlannedCity("owerri","Owerri","ng-imo","NG",64),
            new AfriLifePlannedCity("dutse","Dutse","ng-jigawa","NG",64),
            new AfriLifePlannedCity("kaduna","Kaduna","ng-kaduna","NG",64),
            new AfriLifePlannedCity("zaria","Zaria","ng-kaduna","NG",25),
            new AfriLifePlannedCity("kano","Kano","ng-kano","NG",128),
            new AfriLifePlannedCity("katsina","Katsina","ng-katsina","NG",64),
            new AfriLifePlannedCity("birnin-kebbi","Birnin Kebbi","ng-kebbi","NG",64),
            new AfriLifePlannedCity("lokoja","Lokoja","ng-kogi","NG",64),
            new AfriLifePlannedCity("ilorin","Ilorin","ng-kwara","NG",64),
            new AfriLifePlannedCity("lagos","Lagos","ng-lagos","NG",200),
            new AfriLifePlannedCity("epe","Epe","ng-lagos","NG",25),
            new AfriLifePlannedCity("badagry","Badagry","ng-lagos","NG",25),
            new AfriLifePlannedCity("ikorodu","Ikorodu","ng-lagos","NG",25),
            new AfriLifePlannedCity("lafia","Lafia","ng-nasarawa","NG",64),
            new AfriLifePlannedCity("minna","Minna","ng-niger","NG",64),
            new AfriLifePlannedCity("suleja","Suleja","ng-niger","NG",25),
            new AfriLifePlannedCity("abeokuta","Abeokuta","ng-ogun","NG",64),
            new AfriLifePlannedCity("ijebu-ode","Ijebu-Ode","ng-ogun","NG",25),
            new AfriLifePlannedCity("sagamu","Sagamu","ng-ogun","NG",25),
            new AfriLifePlannedCity("akure","Akure","ng-ondo","NG",64),
            new AfriLifePlannedCity("ondo-city","Ondo City","ng-ondo","NG",25),
            new AfriLifePlannedCity("osogbo","Osogbo","ng-osun","NG",64),
            new AfriLifePlannedCity("ile-ife","Ile-Ife","ng-osun","NG",25),
            new AfriLifePlannedCity("ilesa","Ilesa","ng-osun","NG",25),
            new AfriLifePlannedCity("ibadan","Ibadan","ng-oyo","NG",162),
            new AfriLifePlannedCity("ogbomoso","Ogbomoso","ng-oyo","NG",25),
            new AfriLifePlannedCity("jos","Jos","ng-plateau","NG",64),
            new AfriLifePlannedCity("port-harcourt","Port Harcourt","ng-rivers","NG",128),
            new AfriLifePlannedCity("bonny","Bonny","ng-rivers","NG",25),
            new AfriLifePlannedCity("omoku","Omoku","ng-rivers","NG",25),
            new AfriLifePlannedCity("sokoto","Sokoto","ng-sokoto","NG",64),
            new AfriLifePlannedCity("jalingo","Jalingo","ng-taraba","NG",64),
            new AfriLifePlannedCity("damaturu","Damaturu","ng-yobe","NG",64),
            new AfriLifePlannedCity("gusau","Gusau","ng-zamfara","NG",64),
            new AfriLifePlannedCity("abuja","Abuja","ng-fct","NG",200),
            new AfriLifePlannedCity("gwagwalada","Gwagwalada","ng-fct","NG",25),
            new AfriLifePlannedCity("goaso","Goaso","gh-ahafo","GH",49),
            new AfriLifePlannedCity("kumasi","Kumasi","gh-ashanti","GH",128),
            new AfriLifePlannedCity("obuasi","Obuasi","gh-ashanti","GH",16),
            new AfriLifePlannedCity("sunyani","Sunyani","gh-bono","GH",49),
            new AfriLifePlannedCity("berekum","Berekum","gh-bono","GH",16),
            new AfriLifePlannedCity("techiman","Techiman","gh-bono-east","GH",49),
            new AfriLifePlannedCity("cape-coast","Cape Coast","gh-central","GH",49),
            new AfriLifePlannedCity("winneba","Winneba","gh-central","GH",16),
            new AfriLifePlannedCity("koforidua","Koforidua","gh-eastern","GH",49),
            new AfriLifePlannedCity("nsawam","Nsawam","gh-eastern","GH",16),
            new AfriLifePlannedCity("accra","Accra","gh-greater-accra","GH",128),
            new AfriLifePlannedCity("tema","Tema","gh-greater-accra","GH",16),
            new AfriLifePlannedCity("madina","Madina","gh-greater-accra","GH",16),
            new AfriLifePlannedCity("nalerigu","Nalerigu","gh-north-east","GH",49),
            new AfriLifePlannedCity("tamale","Tamale","gh-northern","GH",98),
            new AfriLifePlannedCity("yendi","Yendi","gh-northern","GH",16),
            new AfriLifePlannedCity("dambai","Dambai","gh-oti","GH",49),
            new AfriLifePlannedCity("damongo","Damongo","gh-savannah","GH",49),
            new AfriLifePlannedCity("bolgatanga","Bolgatanga","gh-upper-east","GH",49),
            new AfriLifePlannedCity("bawku","Bawku","gh-upper-east","GH",16),
            new AfriLifePlannedCity("wa","Wa","gh-upper-west","GH",49),
            new AfriLifePlannedCity("ho","Ho","gh-volta","GH",49),
            new AfriLifePlannedCity("hohoe","Hohoe","gh-volta","GH",16),
            new AfriLifePlannedCity("sekondi-takoradi","Sekondi-Takoradi","gh-western","GH",98),
            new AfriLifePlannedCity("tarkwa","Tarkwa","gh-western","GH",16),
            new AfriLifePlannedCity("sefwi-wiawso","Sefwi Wiawso","gh-western-north","GH",49),
        };
        public static AfriLifePlannedCity Find(string id) => Cities.FirstOrDefault(c=>c.Id==id);
        public static AfriLifePlannedCity[] InDivision(string division) => Cities.Where(c=>c.DivisionId==division).ToArray();
        public static AfriLifePlannedCity[] InCountry(string country) => Cities.Where(c=>c.CountryIso2==country).ToArray();
        public static int TotalAreaKm2 => Cities.Sum(c=>c.TargetAreaKm2);
    }
}
