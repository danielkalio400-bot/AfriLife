using AfriLife.Core.Time;
using AfriLife.Economy.Money;
using AfriLife.Player.Inventory;
using AfriLife.Player.Needs;

namespace AfriLife.Player.Interaction
{
    // Unity 6's managed framework can lack C# init-only setters' marker.
    // Interaction context values are assigned before executing handlers.
    public sealed class InteractionContext
    {
        public string ActorId { get; set; } = string.Empty;
        public GameClock Clock { get; set; }
        public NeedsState Needs { get; set; }
        public PlayerInventory Inventory { get; set; }
        public WalletState Wallet { get; set; }
    }
}
