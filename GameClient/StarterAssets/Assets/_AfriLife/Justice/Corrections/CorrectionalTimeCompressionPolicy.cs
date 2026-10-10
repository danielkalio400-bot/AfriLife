using System;

namespace AfriLife.Justice.Corrections
{
    public sealed class CorrectionalTimeCompressionPolicy
    {
        public int AdvanceDays(IncarcerationRecord record, int requestedDays)
        {
            if (record == null || requestedDays <= 0 || record.State == IncarcerationState.Released)
                return 0;

            int advanced = Math.Min(requestedDays, record.RemainingDays);
            record.DaysServed += advanced;
            if (record.RemainingDays == 0)
                record.State = IncarcerationState.ReleaseApproved;
            return advanced;
        }
    }
}
