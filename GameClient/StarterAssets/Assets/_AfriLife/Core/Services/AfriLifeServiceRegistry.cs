using System;
using System.Collections.Generic;

namespace AfriLife.Core.Services
{
    public static class AfriLifeServiceRegistry
    {
        private static readonly Dictionary<Type, object> Services = new();

        public static void Register<T>(T service) where T : class
        {
            if (service == null) throw new ArgumentNullException(nameof(service));
            Services[typeof(T)] = service;
        }

        public static bool TryResolve<T>(out T service) where T : class
        {
            if (Services.TryGetValue(typeof(T), out var value) && value is T typed)
            {
                service = typed;
                return true;
            }

            service = null;
            return false;
        }

        public static T Resolve<T>() where T : class
        {
            if (TryResolve<T>(out var service)) return service;
            throw new InvalidOperationException($"AfriLife service not registered: {typeof(T).FullName}");
        }

        public static void Clear() => Services.Clear();
    }
}
