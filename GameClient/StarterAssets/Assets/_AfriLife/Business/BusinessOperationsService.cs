using System;

namespace AfriLife.Business
{
    public sealed class BusinessOperationsService
    {
        public float EffectiveServiceCapacity01(BusinessRuntimeState business)
        {
            if (business == null) return 0f;
            business.Normalize();
            if (!business.Open || business.CustomerCapacity <= 0) return 0f;

            float staffing = business.StaffRequired <= 0
                ? 1f
                : Math.Clamp((float)business.StaffPresent / business.StaffRequired, 0f, 1f);

            return Math.Clamp(Math.Min(staffing, business.UtilityAvailability01), 0f, 1f);
        }

        public bool TryServeCustomer(BusinessRuntimeState business, long revenueMinorUnits)
        {
            if (business == null || EffectiveServiceCapacity01(business) <= 0f)
                return false;
            if (business.CustomersPresent >= business.CustomerCapacity)
                return false;

            business.CustomersPresent++;
            checked { business.CashBalanceMinorUnits += Math.Max(0L, revenueMinorUnits); }
            return true;
        }
    }
}
