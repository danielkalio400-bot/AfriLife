using System;
using AfriLife.Infrastructure.Power;
using AfriLife.Infrastructure.Telecom;
using AfriLife.Transport.Roads;

namespace AfriLife.World.Weather
{
    public sealed class WeatherImpactService
    {
        public void Apply(
            RegionalWeatherState weather,
            RoadSegmentState road,
            RegionalPowerState power,
            RegionalTelecomState telecom)
        {
            if (weather == null) return;
            weather.Normalize();

            if (road != null)
            {
                road.Normalize();
                if (weather.RoadFloodingRisk && weather.RainIntensity01 >= 0.75f &&
                    road.Condition != RoadSurfaceCondition.Closed)
                {
                    road.Condition = RoadSurfaceCondition.Flooded;
                    road.Congestion01 = Math.Clamp(road.Congestion01 + 0.25f, 0f, 1f);
                }

                if (weather.Hazard == WeatherHazardType.ReducedVisibility ||
                    weather.Hazard == WeatherHazardType.HarmattanDust)
                {
                    road.Congestion01 = Math.Clamp(road.Congestion01 + 0.1f, 0f, 1f);
                }
            }

            if (power != null && weather.PowerFaultRisk && weather.RainIntensity01 > 0.8f)
            {
                power.DistributionCondition01 = Math.Clamp(power.DistributionCondition01 - 0.15f, 0f, 1f);
            }

            if (telecom != null)
            {
                telecom.Congestion01 = Math.Clamp(
                    telecom.Congestion01 + (weather.Hazard == WeatherHazardType.Thunderstorm ? 0.08f : 0f),
                    0f,
                    1f);
                telecom.Normalize();
            }
        }
    }
}
