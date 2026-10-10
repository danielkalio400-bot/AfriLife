using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class CorrectionalMealState
    {
        public string RecordId = string.Empty;
        public int MealsScheduledToday = 3;
        public int MealsCompletedToday;

        public void Normalize()
        {
            MealsScheduledToday = Math.Clamp(MealsScheduledToday, 1, 6);
            MealsCompletedToday = Math.Clamp(MealsCompletedToday, 0, MealsScheduledToday);
        }
    }
}
