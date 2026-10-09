using System.Collections.Generic;

namespace AfriLife.Player.Interaction
{
    public interface IInteractable
    {
        string InteractionId { get; }
        IReadOnlyList<InteractionType> GetAvailableInteractions();
        bool CanInteract(InteractionType type);
    }
}
