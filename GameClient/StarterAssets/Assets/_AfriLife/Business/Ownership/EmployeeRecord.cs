using System;

namespace AfriLife.Business.Ownership
{
    [Serializable]
    public sealed class EmployeeRecord
    {
        public string EmployeeNpcId = string.Empty;
        public string BusinessId = string.Empty;
        public string RoleId = string.Empty;
        public long SalaryPerPeriodMinorUnits;
        public bool Active = true;
    }
}
