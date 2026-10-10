using System;
using System.Collections.Generic;
using System.Linq;

namespace AfriLife.Emergency
{
    public sealed class EmergencyDispatchPolicy
    {
        public IReadOnlyList<DispatchUnitType> RequiredUnitTypes(EmergencyIncidentType type)
        {
            return type switch
            {
                EmergencyIncidentType.Medical => new[] { DispatchUnitType.Ambulance },
                EmergencyIncidentType.Fire => new[] { DispatchUnitType.FireService, DispatchUnitType.Ambulance },
                EmergencyIncidentType.RoadIncident => new[] { DispatchUnitType.Police, DispatchUnitType.Ambulance, DispatchUnitType.TowService },
                EmergencyIncidentType.VehicleBreakdown => new[] { DispatchUnitType.RoadsideAssistance, DispatchUnitType.TowService },
                EmergencyIncidentType.PublicSafety => new[] { DispatchUnitType.Police },
                EmergencyIncidentType.UtilityFailure => Array.Empty<DispatchUnitType>(),
                _ => Array.Empty<DispatchUnitType>()
            };
        }

        public DispatchUnitState SelectAvailable(
            IEnumerable<DispatchUnitState> units,
            string regionId,
            DispatchUnitType type)
        {
            if (units == null) return null;

            return units
                .Where(unit => unit != null &&
                               unit.RegionId == regionId &&
                               unit.UnitType == type &&
                               unit.CanDispatch())
                .OrderByDescending(unit => unit.Condition01)
                .ThenByDescending(unit => unit.FuelLevel01)
                .FirstOrDefault();
        }
    }
}
