using System.Collections.Generic;

namespace AfriLife.Housing.Appliances
{
    public sealed class ApplianceService
    {
        public bool SetPower(
            ApplianceState appliance,
            bool desiredOn,
            HomeRuntimeState home)
        {
            if (appliance == null || home == null) return false;
            appliance.Normalize();

            if (desiredOn &&
                appliance.RequiresElectricity &&
                home.Electricity != HomeUtilityStatus.On &&
                home.Electricity != HomeUtilityStatus.Backup)
            {
                appliance.IsOn = false;
                return false;
            }

            if (appliance.Condition <= 0f)
            {
                appliance.IsOn = false;
                return false;
            }

            appliance.IsOn = desiredOn;
            return true;
        }

        public void ShutdownUnavailablePower(
            IEnumerable<ApplianceState> appliances,
            HomeRuntimeState home)
        {
            if (appliances == null || home == null) return;
            bool powerAvailable = home.Electricity == HomeUtilityStatus.On ||
                                  home.Electricity == HomeUtilityStatus.Backup;

            if (powerAvailable) return;
            foreach (var appliance in appliances)
            {
                if (appliance != null && appliance.RequiresElectricity)
                    appliance.IsOn = false;
            }
        }
    }
}
