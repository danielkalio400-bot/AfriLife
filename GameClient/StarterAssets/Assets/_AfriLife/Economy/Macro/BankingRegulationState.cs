using System;

namespace AfriLife.Economy.Macro
{
    [Serializable]
    public sealed class BankingRegulationState
    {
        public string CountryId = string.Empty;
        public string PolicyTag = string.Empty;
        public double CapitalRequirement01;
        public double LiquidityRequirement01;
        public bool Active = true;
    }
}
