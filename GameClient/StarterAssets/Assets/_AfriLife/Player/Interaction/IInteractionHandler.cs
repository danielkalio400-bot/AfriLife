namespace AfriLife.Player.Interaction
{
    public interface IInteractionHandler
    {
        InteractionType Type { get; }
        InteractionResult Execute(InteractionContext context, IInteractable target);
    }
}
