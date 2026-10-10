namespace AfriLife.Infrastructure.Power
{
    public enum PowerEventType
    {
        Stable = 0,
        LocalFault = 1,
        LoadShedding = 2,
        MajorOutage = 3,
        Restoration = 4
    }
}
