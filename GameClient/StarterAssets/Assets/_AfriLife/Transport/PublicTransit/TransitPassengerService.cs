using System;
using System.Collections.Generic;

namespace AfriLife.Transport.PublicTransit
{
    public sealed class TransitPassengerService
    {
        public bool TryBoard(
            TransitPassengerState passenger,
            PublicTransitVehicleState vehicle,
            string currentStopId)
        {
            if (passenger == null || vehicle == null || passenger.CompletedTrip)
                return false;

            vehicle.Normalize();
            if (!vehicle.InService || vehicle.Passengers >= vehicle.Capacity)
                return false;

            if (passenger.OriginStopId != currentStopId || vehicle.CurrentStopId != currentStopId)
                return false;

            vehicle.Passengers++;
            passenger.CurrentVehicleId = vehicle.VehicleId;
            passenger.Boarded = true;
            return true;
        }

        public bool TryAlight(
            TransitPassengerState passenger,
            PublicTransitVehicleState vehicle,
            string currentStopId)
        {
            if (passenger == null || vehicle == null || !passenger.Boarded)
                return false;
            if (passenger.DestinationStopId != currentStopId)
                return false;

            vehicle.Passengers = Math.Max(0, vehicle.Passengers - 1);
            passenger.CurrentVehicleId = string.Empty;
            passenger.Boarded = false;
            passenger.CompletedTrip = true;
            return true;
        }

        public int WaitingCount(IEnumerable<TransitPassengerState> passengers)
        {
            int count = 0;
            if (passengers == null) return count;
            foreach (var passenger in passengers)
            {
                if (passenger != null && !passenger.Boarded && !passenger.CompletedTrip)
                    count++;
            }
            return count;
        }
    }
}
