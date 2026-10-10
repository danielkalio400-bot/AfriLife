using System;

namespace AfriLife.Construction
{
    [Serializable]
    public sealed class ProjectWorkerAssignment
    {
        public string NpcId = string.Empty;
        public ProjectProfessionalRole Role;
        public float Skill01 = 0.5f;
        public bool Active = true;

        public void Normalize()
        {
            Skill01 = Math.Clamp(Skill01, 0f, 1f);
        }
    }
}
