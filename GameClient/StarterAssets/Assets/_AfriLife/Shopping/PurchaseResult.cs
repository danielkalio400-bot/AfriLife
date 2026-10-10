namespace AfriLife.Shopping
{
    public readonly struct PurchaseResult
    {
        public PurchaseResult(bool success, string messageKey)
        {
            Success = success;
            MessageKey = messageKey ?? string.Empty;
        }

        public bool Success { get; }
        public string MessageKey { get; }
    }
}
