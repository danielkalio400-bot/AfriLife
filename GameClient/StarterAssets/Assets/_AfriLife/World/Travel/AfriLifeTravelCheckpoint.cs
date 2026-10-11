using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace AfriLife.World.Travel
{
    // Independent scene-travel checkpoint. Critically, this NEVER rewrites the
    // Lagos-only FirstNeighborhoodPrototype ledger or the canonical wallet.
    // Two alternating verified slots protect the previous departure on failure.
    public static class AfriLifeTravelCheckpoint
    {
        [Serializable]
        public sealed class State
        {
            public string CurrentCityId = "lagos";
            public bool HasLagosPosition;
            public float LagosX;
            public float LagosZ;
            public bool HasAccraPosition;
            public float AccraX;
            public float AccraZ;

            public void Capture(string sceneCity,Vector3 position)
            {
                if (float.IsNaN(position.x) || float.IsInfinity(position.x) ||
                    float.IsNaN(position.z) || float.IsInfinity(position.z) ||
                    Mathf.Abs(position.x)>45f || Mathf.Abs(position.z)>45f)return;
                if (sceneCity=="lagos")
                {
                    LagosX=position.x;LagosZ=position.z;HasLagosPosition=true;
                }
                else if (sceneCity=="accra")
                {
                    AccraX=position.x;AccraZ=position.z;HasAccraPosition=true;
                }
            }

            public bool TryPosition(string sceneCity,out Vector3 position)
            {
                position=Vector3.zero;
                if (sceneCity=="lagos" && HasLagosPosition)
                    position=new Vector3(LagosX,0f,LagosZ);
                else if (sceneCity=="accra" && HasAccraPosition)
                    position=new Vector3(AccraX,0f,AccraZ);
                else return false;
                return true;
            }
        }

        [Serializable]
        private sealed class Envelope
        {
            public int Version=1;
            public long Generation;
            public string Json=string.Empty;
            public string Hash=string.Empty;
        }

        private sealed class Slot
        {
            public string Path;
            public long Generation;
            public State Value;
        }

        private static string BasePath=>Path.Combine(
            Application.persistentDataPath,"afrilife-world-travel.json");
        private static string SlotA=>BasePath+".a";
        private static string SlotB=>BasePath+".b";

        private static string Digest(string json)
        {
            using(SHA256 sha=SHA256.Create())
            {
                return BitConverter.ToString(
                    sha.ComputeHash(Encoding.UTF8.GetBytes(json)))
                    .Replace("-","").ToLowerInvariant();
            }
        }

        private static bool Valid(State state)
        {
            if(state==null || AfriLifeTravelCatalog.FindCity(state.CurrentCityId)==null)
                return false;
            if(!AfriLifeTravelCatalog.FindCity(state.CurrentCityId).SceneAuthored)
                return false;
            foreach(float v in new[]{state.LagosX,state.LagosZ,state.AccraX,state.AccraZ})
                if(float.IsNaN(v)||float.IsInfinity(v)||Mathf.Abs(v)>45f)return false;
            return true;
        }

        private static Slot Read(string path)
        {
            if(!File.Exists(path))return null;
            try
            {
                Envelope env=JsonUtility.FromJson<Envelope>(
                    File.ReadAllText(path,Encoding.UTF8));
                if(env==null||env.Version!=1||env.Generation<1||
                   string.IsNullOrEmpty(env.Json)||env.Hash!=Digest(env.Json))
                    return null;
                State state=JsonUtility.FromJson<State>(env.Json);
                return Valid(state)?new Slot{
                    Path=path,Generation=env.Generation,Value=state
                }:null;
            }
            catch(Exception){return null;}
        }

        private static Slot Latest()
        {
            Slot a=Read(SlotA),b=Read(SlotB);
            if(a!=null&&b!=null&&a.Generation==b.Generation &&
               JsonUtility.ToJson(a.Value)!=JsonUtility.ToJson(b.Value))
                throw new InvalidDataException("Conflicting AfriLife travel slots.");
            if(a==null&&b==null&&(File.Exists(SlotA)||File.Exists(SlotB)))
                throw new InvalidDataException(
                    "Both travel checkpoints unreadable; preserving them for recovery.");
            if(a==null)return b;
            if(b==null)return a;
            return a.Generation>=b.Generation?a:b;
        }

        public static State Load()
        {
            Slot latest=Latest();
            return latest==null?new State():latest.Value;
        }

        public static void Save(State state)
        {
            if(!Valid(state))throw new InvalidDataException("Invalid travel location.");
            Slot current=Latest();
            string target=current==null||current.Path==SlotB?SlotA:SlotB;
            var envelope=new Envelope{
                Version=1,Generation=checked((current?.Generation??0L)+1L)
            };
            envelope.Json=JsonUtility.ToJson(state);
            envelope.Hash=Digest(envelope.Json);
            string json=JsonUtility.ToJson(envelope);
            Directory.CreateDirectory(Application.persistentDataPath);
            string temporary=target+".tmp";
            using(var stream=new FileStream(temporary,FileMode.Create,FileAccess.Write,FileShare.None))
            {
                byte[] data=Encoding.UTF8.GetBytes(json);
                stream.Write(data,0,data.Length);
                stream.Flush(true);
            }
            if(Read(temporary)==null)
                throw new InvalidDataException("Travel checkpoint write did not verify.");
            // Never destroy the other valid slot; allow crash recovery.
            if(File.Exists(target))File.Delete(target);
            File.Move(temporary,target);
            if(Read(target)==null)
                throw new InvalidDataException("Travel checkpoint commit did not verify.");
        }
    }
}
