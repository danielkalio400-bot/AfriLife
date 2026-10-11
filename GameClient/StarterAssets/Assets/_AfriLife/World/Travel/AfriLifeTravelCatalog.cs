using System;
using System.Linq;
namespace AfriLife.World.Travel
{
    // Complete administrative DIRECTORY, not fictitious streamed game worlds.
    // Only Lagos and Accra are currently valid Unity scene destinations.
    public static class AfriLifeTravelCatalog
    {
        public const string LagosScene="Assets/_AfriLife/Scenes/ProductionLagos.unity";
        public const string AccraScene="Assets/_AfriLife/Scenes/ProductionAccra.unity";
        public static readonly AfriLifeDivision[] Divisions={
            new AfriLifeDivision("ng-abia","NG","Abia","State"),
            new AfriLifeDivision("ng-adamawa","NG","Adamawa","State"),
            new AfriLifeDivision("ng-akwa-ibom","NG","Akwa Ibom","State"),
            new AfriLifeDivision("ng-anambra","NG","Anambra","State"),
            new AfriLifeDivision("ng-bauchi","NG","Bauchi","State"),
            new AfriLifeDivision("ng-bayelsa","NG","Bayelsa","State"),
            new AfriLifeDivision("ng-benue","NG","Benue","State"),
            new AfriLifeDivision("ng-borno","NG","Borno","State"),
            new AfriLifeDivision("ng-cross-river","NG","Cross River","State"),
            new AfriLifeDivision("ng-delta","NG","Delta","State"),
            new AfriLifeDivision("ng-ebonyi","NG","Ebonyi","State"),
            new AfriLifeDivision("ng-edo","NG","Edo","State"),
            new AfriLifeDivision("ng-ekiti","NG","Ekiti","State"),
            new AfriLifeDivision("ng-enugu","NG","Enugu","State"),
            new AfriLifeDivision("ng-gombe","NG","Gombe","State"),
            new AfriLifeDivision("ng-imo","NG","Imo","State"),
            new AfriLifeDivision("ng-jigawa","NG","Jigawa","State"),
            new AfriLifeDivision("ng-kaduna","NG","Kaduna","State"),
            new AfriLifeDivision("ng-kano","NG","Kano","State"),
            new AfriLifeDivision("ng-katsina","NG","Katsina","State"),
            new AfriLifeDivision("ng-kebbi","NG","Kebbi","State"),
            new AfriLifeDivision("ng-kogi","NG","Kogi","State"),
            new AfriLifeDivision("ng-kwara","NG","Kwara","State"),
            new AfriLifeDivision("ng-lagos","NG","Lagos","State"),
            new AfriLifeDivision("ng-nasarawa","NG","Nasarawa","State"),
            new AfriLifeDivision("ng-niger","NG","Niger","State"),
            new AfriLifeDivision("ng-ogun","NG","Ogun","State"),
            new AfriLifeDivision("ng-ondo","NG","Ondo","State"),
            new AfriLifeDivision("ng-osun","NG","Osun","State"),
            new AfriLifeDivision("ng-oyo","NG","Oyo","State"),
            new AfriLifeDivision("ng-plateau","NG","Plateau","State"),
            new AfriLifeDivision("ng-rivers","NG","Rivers","State"),
            new AfriLifeDivision("ng-sokoto","NG","Sokoto","State"),
            new AfriLifeDivision("ng-taraba","NG","Taraba","State"),
            new AfriLifeDivision("ng-yobe","NG","Yobe","State"),
            new AfriLifeDivision("ng-zamfara","NG","Zamfara","State"),
            new AfriLifeDivision("ng-fct","NG","Federal Capital Territory","FCT"),
            new AfriLifeDivision("gh-ahafo","GH","Ahafo","Region"),
            new AfriLifeDivision("gh-ashanti","GH","Ashanti","Region"),
            new AfriLifeDivision("gh-bono","GH","Bono","Region"),
            new AfriLifeDivision("gh-bono-east","GH","Bono East","Region"),
            new AfriLifeDivision("gh-central","GH","Central","Region"),
            new AfriLifeDivision("gh-eastern","GH","Eastern","Region"),
            new AfriLifeDivision("gh-greater-accra","GH","Greater Accra","Region"),
            new AfriLifeDivision("gh-north-east","GH","North East","Region"),
            new AfriLifeDivision("gh-northern","GH","Northern","Region"),
            new AfriLifeDivision("gh-oti","GH","Oti","Region"),
            new AfriLifeDivision("gh-savannah","GH","Savannah","Region"),
            new AfriLifeDivision("gh-upper-east","GH","Upper East","Region"),
            new AfriLifeDivision("gh-upper-west","GH","Upper West","Region"),
            new AfriLifeDivision("gh-volta","GH","Volta","Region"),
            new AfriLifeDivision("gh-western","GH","Western","Region"),
            new AfriLifeDivision("gh-western-north","GH","Western North","Region")
        };
        // Planned destinations deliberately have null ScenePath.
        public static readonly AfriLifeTravelCity[] Cities={
            new AfriLifeTravelCity("lagos","Lagos","ng-lagos",LagosScene),
            new AfriLifeTravelCity("abuja","Abuja","ng-fct",null),
            new AfriLifeTravelCity("port-harcourt","Port Harcourt","ng-rivers",null),
            new AfriLifeTravelCity("kano","Kano","ng-kano",null),
            new AfriLifeTravelCity("ibadan","Ibadan","ng-oyo",null),
            new AfriLifeTravelCity("enugu","Enugu","ng-enugu",null),
            new AfriLifeTravelCity("accra","Accra","gh-greater-accra",AccraScene),
            new AfriLifeTravelCity("kumasi","Kumasi","gh-ashanti",null),
            new AfriLifeTravelCity("tema","Tema","gh-greater-accra",null),
            new AfriLifeTravelCity("takoradi","Takoradi","gh-western",null),
            new AfriLifeTravelCity("tamale","Tamale","gh-northern",null),
            new AfriLifeTravelCity("cape-coast","Cape Coast","gh-central",null)
        };
        public static AfriLifeTravelCity FindCity(string id)=>
            Cities.FirstOrDefault(c=>c.CityId==id);
        public static AfriLifeTravelCity ForScene(string path)=>
            Cities.FirstOrDefault(c=>c.SceneAuthored &&
                string.Equals(c.ScenePath,path,StringComparison.Ordinal));
        public static AfriLifeDivision FindDivision(string id)=>
            Divisions.FirstOrDefault(d=>d.Id==id);
        public static AfriLifeDivision[] InCountry(string country)=>
            Divisions.Where(d=>d.CountryIso2==country).ToArray();
        public static AfriLifeTravelCity[] InDivision(string id)=>
            Cities.Where(c=>c.DivisionId==id).ToArray();
    }
}
