using AfriLife.Player.Needs;

namespace AfriLife.Player.Interaction.Handlers
{
    public sealed class DrinkInteractionHandler : IInteractionHandler
    {
        public InteractionType Type => InteractionType.Drink;

        public InteractionResult Execute(InteractionContext context, IInteractable target)
        {
            if (context?.Needs == null) return InteractionResult.Fail("interaction.needs_missing");
            context.Needs.Adjust(NeedType.Thirst, 35f);
            return InteractionResult.Ok("interaction.drink_complete");
        }
    }
}
