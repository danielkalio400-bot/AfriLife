using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class BiometricAppointmentState
    {
        public string AppointmentId = string.Empty;
        public string ApplicationId = string.Empty;
        public string OfficeId = string.Empty;
        public long ScheduledAtUnixSeconds;
        public bool Completed;
        public bool IdentityCheckPassed;
    }
}
