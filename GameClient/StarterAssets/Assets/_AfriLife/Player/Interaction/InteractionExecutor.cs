using System;
using System.Collections.Generic;

namespace AfriLife.Player.Interaction
{
    public sealed class InteractionExecutor
    {
        private readonly Dictionary<InteractionType, IInteractionHandler> _handlers = new();

        public void Register(IInteractionHandler handler)
        {
            if (handler == null) throw new ArgumentNullException(nameof(handler));
            _handlers[handler.Type] = handler;
        }

        public InteractionResult Execute(
            InteractionType type,
            InteractionContext context,
            IInteractable target)
        {
            if (target == null) return InteractionResult.Fail("interaction.target_missing");
            if (!target.CanInteract(type)) return InteractionResult.Fail("interaction.unavailable");
            if (!_handlers.TryGetValue(type, out var handler))
                return InteractionResult.Fail("interaction.handler_missing");

            return handler.Execute(context, target);
        }
    }
}
