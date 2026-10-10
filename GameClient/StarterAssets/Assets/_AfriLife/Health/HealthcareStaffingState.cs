using System;
using System.Collections.Generic;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class HealthcareStaffingState
    {
        public List<HealthcareStaffingLine> Lines = new();

        public float Availability01()
        {
            if (Lines == null || Lines.Count == 0) return 0f;

            int required = 0;
            int present = 0;
            foreach (var line in Lines)
            {
                if (line == null) continue;
                line.Normalize();
                required += line.Required;
                present += Math.Min(line.Present, line.Required);
            }

            return required <= 0 ? 1f : Math.Clamp((float)present / required, 0f, 1f);
        }
    }

    [Serializable]
    public sealed class HealthcareStaffingLine
    {
        public HealthcareStaffRole Role;
        public int Required;
        public int Present;

        public void Normalize()
        {
            Required = Math.Max(0, Required);
            Present = Math.Max(0, Present);
        }
    }
}
