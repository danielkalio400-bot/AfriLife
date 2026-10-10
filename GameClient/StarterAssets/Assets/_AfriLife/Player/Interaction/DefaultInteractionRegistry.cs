using AfriLife.Player.Interaction.Handlers;

namespace AfriLife.Player.Interaction
{
    public static class DefaultInteractionRegistry
    {
        public static InteractionExecutor Create()
        {
            var executor = new InteractionExecutor();
            executor.Register(new EatInteractionHandler());
            executor.Register(new DrinkInteractionHandler());
            executor.Register(new ShowerInteractionHandler());
            executor.Register(new SleepInteractionHandler());
            return executor;
        }
    }
}
