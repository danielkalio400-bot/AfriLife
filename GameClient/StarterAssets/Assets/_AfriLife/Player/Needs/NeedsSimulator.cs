using System.Collections.Generic;

namespace AfriLife.Player.Needs
{
    public sealed class NeedsSimulator
    {
        public void Advance(NeedsState state, IReadOnlyList<NeedRate> rates, double gameSeconds)
        {
            if (state == null || rates == null || gameSeconds <= 0d) return;

            float hours = (float)(gameSeconds / 3600d);
            for (int index = 0; index < rates.Count; index++)
            {
                NeedRate rate = rates[index];
                state.Adjust(rate.Type, rate.DeltaPerGameHour * hours);
            }
        }
    }
}
