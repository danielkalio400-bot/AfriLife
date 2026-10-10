using AfriLife.Economy.Money;

namespace AfriLife.Jobs
{
    public sealed class WorkService
    {
        public WorkShiftResult CompleteShift(
            EmploymentState employment,
            JobDefinition job,
            WalletState wallet)
        {
            if (employment == null || job == null || wallet == null)
                return new WorkShiftResult(false, default, 0d, "work.invalid_context");

            if (!employment.Employed || employment.JobId != job.JobId)
                return new WorkShiftResult(false, default, 0d, "work.not_employed");

            var pay = new MoneyAmount(job.Currency, job.PayPerShiftMinorUnits);
            wallet.Credit(pay);
            employment.CompletedShifts++;
            return new WorkShiftResult(true, pay, job.ShiftDurationGameHours, "work.shift_complete");
        }
    }
}
