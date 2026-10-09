using System;
using System.Collections.Generic;

namespace AfriLife.Core.Events
{
    public interface IWorldEvent { }

    public sealed class WorldEventBus
    {
        private readonly Dictionary<Type, Delegate> _handlers = new();

        public void Subscribe<T>(Action<T> handler) where T : IWorldEvent
        {
            var key = typeof(T);
            _handlers[key] = _handlers.TryGetValue(key, out var current)
                ? Delegate.Combine(current, handler)
                : handler;
        }

        public void Publish<T>(T evt) where T : IWorldEvent
        {
            if (_handlers.TryGetValue(typeof(T), out var handler))
                (handler as Action<T>)?.Invoke(evt);
        }
    }
}
