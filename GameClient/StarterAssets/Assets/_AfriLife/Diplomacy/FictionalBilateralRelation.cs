using System;
using UnityEngine;

namespace AfriLife.Diplomacy
{
    [Serializable]
    public sealed class FictionalRouteAccess
    {
        public bool trade = true;
        public bool border = true;
        public bool maritime = true;
        public bool travel = true;
    }

    [Serializable]
    public sealed class FictionalBilateralRelation
    {
        public string relationId = "Nigeria-Ghana";
        public string phase = "normal";
        public int revision;
        public bool fictional = true;
        [Range(0f,1f)] public float civilianRelief01 = 1f;
        public bool ceasefireObserved;
        public FictionalRouteAccess routeAccess = new FictionalRouteAccess();

        public bool CanPresentComparedTo(FictionalBilateralRelation previous)
        {
            return fictional && (previous == null ||
                (relationId == previous.relationId && revision > previous.revision));
        }
    }
}
