using System;
using System.Collections.Generic;

namespace AfriLife.Business.Ownership
{
    public sealed class BusinessOperationsLedgerService
    {
        public long PayrollCost(IEnumerable<EmployeeRecord> employees)
        {
            long total = 0L;
            if (employees == null) return total;
            foreach (var employee in employees)
            {
                if (employee == null || !employee.Active) continue;
                checked { total += Math.Max(0L, employee.SalaryPerPeriodMinorUnits); }
            }
            return total;
        }

        public void ApplyPeriod(BusinessOwnershipState business, BusinessLedgerPeriod period)
        {
            if (business == null || period == null) return;
            business.Normalize();
            long next = checked(business.CashMinorUnits + period.ProfitLossMinorUnits);
            business.CashMinorUnits = Math.Max(0L, next);
        }
    }
}
