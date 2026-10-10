using AfriLife.Economy.Money;

namespace AfriLife.Jobs
{
    public readonly struct WorkShiftResult
    {
        public WorkShiftResult(bool success, MoneyAmount pay, double gameHours, string messageKey)
        {
            Success = success;
            Pay = pay;
            GameHours = gameHours;
            MessageKey = messageKey ?? string.Empty;
        }

        public bool Success { get; }
        public MoneyAmount Pay { get; }
        public double GameHours { get; }
        public string MessageKey { get; }
    }
}
