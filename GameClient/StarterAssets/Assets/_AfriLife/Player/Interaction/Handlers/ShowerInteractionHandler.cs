using AfriLife.Player.Needs;

namespace AfriLife.Player.Interaction.Handlers
{
    public sealed class ShowerInteractionHandler : IInteractionHandler
    {
        public InteractionType Type => InteractionType.Shower;

        public InteractionResult Execute(InteractionContext context, IInteractable target)
        {
            if (context?.Needs == null) return InteractionResult.Fail("interaction.needs_missing");
            context.Needs.Set(NeedType.Hygiene, 100f);
            context.Needs.Adjust(NeedType.Comfort, 5f);
            return InteractionResult.Ok("interaction.shower_complete");
        }
    }
}
