using System;

namespace AfriLife.RealEstate
{
    public sealed class PropertyValuationService
    {
        public long Estimate(PropertyValuationInputs input)
        {
            if (input == null) return 0L;
            input.Normalize();

            double location = 0.7d + input.NeighborhoodValueIndex01 * 0.6d;
            double condition = 0.55d + input.Condition01 * 0.45d;
            double access =
                0.5d +
                input.UtilityAccess01 * 0.2d +
                input.TransportAccess01 * 0.15d +
                input.ServiceAccess01 * 0.15d;

            return Math.Max(0L, (long)Math.Round(input.BaseValueMinorUnits * location * condition * access));
        }
    }
}
