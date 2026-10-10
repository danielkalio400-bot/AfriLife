using System;

namespace AfriLife.Housing
{
    [Serializable]
    public sealed class HomeRuntimeState
    {
        public string HomeId = string.Empty;
        public HomeUtilityStatus Electricity = HomeUtilityStatus.On;
        public HomeUtilityStatus Water = HomeUtilityStatus.On;
        public float Cleanliness = 100f;
        public float FoodStorageCondition = 100f;
        public bool FrontDoorLocked;

        public void Normalize()
        {
            Cleanliness = Math.Clamp(Cleanliness, 0f, 100f);
            FoodStorageCondition = Math.Clamp(FoodStorageCondition, 0f, 100f);
        }
    }
}
