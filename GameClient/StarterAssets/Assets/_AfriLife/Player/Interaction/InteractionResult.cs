namespace AfriLife.Player.Interaction
{
    public readonly struct InteractionResult
    {
        public InteractionResult(bool success, string messageKey)
        {
            Success = success;
            MessageKey = messageKey ?? string.Empty;
        }

        public bool Success { get; }
        public string MessageKey { get; }

        public static InteractionResult Ok(string messageKey = "") => new(true, messageKey);
        public static InteractionResult Fail(string messageKey) => new(false, messageKey);
    }
}
