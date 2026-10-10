using System;

namespace AfriLife.Business.Services
{
    public sealed class MaintenanceBusinessService
    {
        public void Advance(ServiceWorkOrder order, double gameHours, float skill01)
        {
            if (order == null || gameHours <= 0d || order.Completed) return;
            order.Normalize();

            float skill = Math.Clamp(skill01, 0.1f, 1f);
            float workers = Math.Max(1, order.AssignedWorkers);
            order.Progress01 = Math.Clamp(
                order.Progress01 + (float)(gameHours * 0.08d * skill * Math.Sqrt(workers)),
                0f,
                1f);
            order.Completed = order.Progress01 >= 1f;
        }
    }
}
