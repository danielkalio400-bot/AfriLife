using System;
using System.Collections.Generic;
using AfriLife.NPC;
using AfriLife.World.Neighborhood;
using AfriLife.World.Streaming;

namespace AfriLife.Core.Save
{
    [Serializable]
    public sealed class WorldSaveData
    {
        public WorldSaveHeader Header = new();
        public PlayerWorldState Player = new();
        public List<DistrictSimulationState> Districts = new();
        public List<NeighborhoodState> Neighborhoods = new();
        public List<NpcRuntimeState> PersistentNpcs = new();

        public void Normalize()
        {
            Header ??= new WorldSaveHeader();
            Player ??= new PlayerWorldState();
            Districts ??= new List<DistrictSimulationState>();
            Neighborhoods ??= new List<NeighborhoodState>();
            PersistentNpcs ??= new List<NpcRuntimeState>();
        }
    }
}
