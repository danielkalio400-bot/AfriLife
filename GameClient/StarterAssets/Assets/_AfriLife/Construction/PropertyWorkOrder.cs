using System;

namespace AfriLife.Construction
{
    [Serializable]
    public sealed class PropertyWorkOrder
    {
        public string WorkOrderId = string.Empty;
        public string PropertyId = string.Empty;
        public string ContractorBusinessId = string.Empty;
        public PropertyWorkType Type;
        public string ScopeTag = string.Empty;
        public float Progress01;
        public long BudgetMinorUnits;
        public bool Completed;

        public void Normalize()
        {
            Progress01 = Math.Clamp(Progress01, 0f, 1f);
            BudgetMinorUnits = Math.Max(0L, BudgetMinorUnits);
            Completed = Progress01 >= 1f;
        }
    }
}
