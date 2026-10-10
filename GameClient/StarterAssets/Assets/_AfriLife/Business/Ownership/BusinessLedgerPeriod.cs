using System;

namespace AfriLife.Business.Ownership
{
    [Serializable]
    public sealed class BusinessLedgerPeriod
    {
        public long RevenueMinorUnits;
        public long CostOfGoodsMinorUnits;
        public long SalariesMinorUnits;
        public long RentMinorUnits;
        public long UtilitiesMinorUnits;
        public long OtherCostsMinorUnits;

        public long ProfitLossMinorUnits =>
            RevenueMinorUnits -
            CostOfGoodsMinorUnits -
            SalariesMinorUnits -
            RentMinorUnits -
            UtilitiesMinorUnits -
            OtherCostsMinorUnits;
    }
}
