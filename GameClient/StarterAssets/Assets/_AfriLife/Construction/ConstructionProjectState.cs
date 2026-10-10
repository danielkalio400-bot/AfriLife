using System;
using System.Collections.Generic;
using AfriLife.Economy.Money;

namespace AfriLife.Construction
{
    [Serializable]
    public sealed class ConstructionProjectState
    {
        public string ProjectId = string.Empty;
        public string PropertyId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public string ContractorBusinessId = string.Empty;
        public ConstructionPhase Phase = ConstructionPhase.Planning;
        public float PhaseProgress01;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long BudgetMinorUnits;
        public long SpentMinorUnits;
        public List<ProjectWorkerAssignment> Workers = new();
        public List<ConstructionMaterialRequirement> Materials = new();

        public void Normalize()
        {
            PhaseProgress01 = Math.Clamp(PhaseProgress01, 0f, 1f);
            BudgetMinorUnits = Math.Max(0L, BudgetMinorUnits);
            SpentMinorUnits = Math.Max(0L, SpentMinorUnits);
        }
    }
}
