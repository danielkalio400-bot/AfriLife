using System;

namespace AfriLife.Jobs
{
    [Serializable]
    public sealed class EmploymentState
    {
        public string JobId = string.Empty;
        public string EmployerId = string.Empty;
        public int CompletedShifts;
        public bool Employed => !string.IsNullOrWhiteSpace(JobId);
    }
}
