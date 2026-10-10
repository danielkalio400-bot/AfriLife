using System;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Deterministic simulated local time. World time begins at 06:00
    /// (day zero), independent of the user's real clock or time zone.
    /// </summary>
    public static class FirstNeighborhoodWorldClock
    {
        private const long SecondsPerDay=86400L;
        private const long StartHourSeconds=21600L;

        public static int MinuteOfDay(long elapsedWorldSeconds)
        {
            long elapsed=Math.Max(0L,elapsedWorldSeconds)%SecondsPerDay;
            return (int)(((elapsed+StartHourSeconds)%SecondsPerDay)/60L);
        }

        public static int HourOfDay(long elapsedWorldSeconds)
        {
            return MinuteOfDay(elapsedWorldSeconds)/60;
        }

        public static string Display(long elapsedWorldSeconds)
        {
            int minute=MinuteOfDay(elapsedWorldSeconds);
            return (minute/60).ToString("00")+":"+(minute%60).ToString("00");
        }

        public static long SecondsUntilNextMorning(long elapsedWorldSeconds)
        {
            long seconds=Math.Max(0L,elapsedWorldSeconds)%SecondsPerDay;
            long wallClock=(seconds+StartHourSeconds)%SecondsPerDay;
            long remaining=(StartHourSeconds-wallClock+SecondsPerDay)%SecondsPerDay;
            // Day transitions must always advance time; never repeat the
            // same receipt day because the clock was exactly 06:00.
            return remaining==0L?SecondsPerDay:remaining;
        }

        public static long BeginNextDay(long elapsedWorldSeconds)
        {
            if(elapsedWorldSeconds<0L)throw new ArgumentOutOfRangeException(nameof(elapsedWorldSeconds));
            return checked(elapsedWorldSeconds+SecondsUntilNextMorning(elapsedWorldSeconds));
        }

        public static bool IsServiceOpen(string errandId,long elapsedWorldSeconds)
        {
            int hour=HourOfDay(elapsedWorldSeconds);
            switch(errandId)
            {
                case "clinic-checkin": return hour>=8 && hour<17;
                case "market-supplies": return hour>=7 && hour<19;
                case "park-cleanup": return hour>=6 && hour<20;
                case "neighbor-help": return hour>=6 && hour<21;
                default:return false;
            }
        }

        public static string HoursLabel(string errandId)
        {
            switch(errandId)
            {
                case "clinic-checkin":return "08:00-17:00";
                case "market-supplies":return "07:00-19:00";
                case "park-cleanup":return "06:00-20:00";
                case "neighbor-help":return "06:00-21:00";
                default:return "closed";
            }
        }
    }
}
