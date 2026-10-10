using System;

namespace AfriLife.Emergency
{
    [Serializable]
    public sealed class IncidentSceneState
    {
        public string IncidentId = string.Empty;
        public bool SceneSecured;
        public bool TrafficDiversionActive;
        public bool HospitalTransportActive;
        public bool TowRequested;
        public string NotesTag = string.Empty;
    }
}
