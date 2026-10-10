using AfriLife.Core.Time;
using AfriLife.Economy.Money;
using AfriLife.Player.Inventory;
using AfriLife.Player.Needs;

namespace AfriLife.Player.Interaction
{
    public sealed class InteractionContext
    {
        public string ActorId { get; init; } = string.Empty;
        public GameClock Clock { get; init; }
        public NeedsState Needs { get; init; }
        public PlayerInventory Inventory { get; init; }
        public WalletState Wallet { get; init; }
    }
}
