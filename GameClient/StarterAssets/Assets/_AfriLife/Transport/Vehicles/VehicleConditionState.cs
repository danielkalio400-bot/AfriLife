using System;

namespace AfriLife.Transport.Vehicles
{
    [Serializable]
    public sealed class VehicleConditionState
    {
        public float Engine = 100f;
        public float Brakes = 100f;
        public float Tires = 100f;
        public float Suspension = 100f;
        public float Battery = 100f;
        public float Body = 100f;

        public void Normalize()
        {
            Engine = Math.Clamp(Engine, 0f, 100f);
            Brakes = Math.Clamp(Brakes, 0f, 100f);
            Tires = Math.Clamp(Tires, 0f, 100f);
            Suspension = Math.Clamp(Suspension, 0f, 100f);
            Battery = Math.Clamp(Battery, 0f, 100f);
            Body = Math.Clamp(Body, 0f, 100f);
        }

        public bool CanDrive() =>
            Engine > 5f && Brakes > 5f && Tires > 5f && Battery > 1f;
    }
}
