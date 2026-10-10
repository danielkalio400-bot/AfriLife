using System;

namespace AfriLife.Business
{
    [Serializable]
    public sealed class BusinessRuntimeState
    {
        public string BusinessId = string.Empty;
        public BusinessType Type;
        public string NeighborhoodId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public int StaffRequired = 1;
        public int StaffPresent;
        public int CustomerCapacity = 10;
        public int CustomersPresent;
        public float UtilityAvailability01 = 1f;
        public bool Open = true;
        public long CashBalanceMinorUnits;

        public void Normalize()
        {
            StaffRequired = Math.Max(0, StaffRequired);
            StaffPresent = Math.Max(0, StaffPresent);
            CustomerCapacity = Math.Max(0, CustomerCapacity);
            CustomersPresent = Math.Clamp(CustomersPresent, 0, CustomerCapacity);
            UtilityAvailability01 = Math.Clamp(UtilityAvailability01, 0f, 1f);
            CashBalanceMinorUnits = Math.Max(0L, CashBalanceMinorUnits);
        }
    }
}
