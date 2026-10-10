using AfriLife.Player.Needs;

namespace AfriLife.Player.Interaction.Handlers
{
    public sealed class EatInteractionHandler : IInteractionHandler
    {
        public InteractionType Type => InteractionType.Eat;

        public InteractionResult Execute(InteractionContext context, IInteractable target)
        {
            if (context?.Needs == null) return InteractionResult.Fail("interaction.needs_missing");
            context.Needs.Adjust(NeedType.Hunger, 30f);
            context.Needs.Adjust(NeedType.Comfort, 3f);
            return InteractionResult.Ok("interaction.eat_complete");
        }
    }
}
