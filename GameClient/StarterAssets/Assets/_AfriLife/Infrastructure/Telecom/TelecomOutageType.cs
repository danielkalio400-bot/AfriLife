namespace AfriLife.Infrastructure.Telecom
{
    public enum TelecomOutageType
    {
        None = 0,
        TowerPowerLoss = 1,
        BackhaulFault = 2,
        Congestion = 3,
        PlannedMaintenance = 4,
        RegionalOutage = 5
    }
}
