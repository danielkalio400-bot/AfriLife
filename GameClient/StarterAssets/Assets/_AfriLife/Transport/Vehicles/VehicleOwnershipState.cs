using System;

namespace AfriLife.Transport.Vehicles
{
    [Serializable]
    public sealed class VehicleOwnershipState
    {
        public string VehicleId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public VehicleType Type = VehicleType.Car;
        public string RegistrationId = string.Empty;
        public string InsurancePolicyId = string.Empty;
        public double MileageKm;
        public double FuelLiters;
        public double FuelCapacityLiters = 50d;
        public VehicleConditionState Condition = new();
    }
}
