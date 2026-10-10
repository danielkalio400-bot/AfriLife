using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class FictionalCandidateState
    {
        public string CandidateId = string.Empty;
        public string ElectionId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string FictionalPartyId = string.Empty;
        public int Votes;
    }
}
