using AfriLife.Player.Needs;

namespace AfriLife.Player.Interaction.Handlers
{
    public sealed class SleepInteractionHandler : IInteractionHandler
    {
        public InteractionType Type => InteractionType.Sleep;

        public InteractionResult Execute(InteractionContext context, IInteractable target)
        {
            if (context?.Needs == null || context.Clock == null)
                return InteractionResult.Fail("interaction.sleep_context_missing");

            context.Clock.Advance(8d * 60d * 60d / context.Clock.TimeScale);
            context.Needs.Set(NeedType.Energy, 100f);
            context.Needs.Set(NeedType.Fatigue, 0f);
            context.Needs.Adjust(NeedType.Stress, -20f);
            return InteractionResult.Ok("interaction.sleep_complete");
        }
    }
}
