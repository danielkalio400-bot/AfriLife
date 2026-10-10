using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace AfriLife.Core.Save
{
    /// <summary>
    /// Local, offline two-slot save store. Each alternate slot contains a
    /// checksum-verified JSON envelope. The newest valid slot is read first.
    /// No cloud synchronization or encryption is claimed.
    /// </summary>
    public static class LocalWorldSaveStore
    {
        private const string LegacyFileName = "afrilife-local-world.json";
        private const int FormatVersion = 1;

        [Serializable]
        private sealed class SaveEnvelope
        {
            public int FormatVersion;
            public long Generation;
            public string PayloadJson = string.Empty;
            public string Sha256 = string.Empty;
        }

        private sealed class Slot
        {
            public string Path;
            public WorldSaveData World;
            public long Generation;
        }

        public static string FilePath => Path.Combine(
            Application.persistentDataPath, LegacyFileName);
        public static string SlotAPath => FilePath + ".slot-a";
        public static string SlotBPath => FilePath + ".slot-b";
        public static string LastLoadStatus { get; private set; } = "not-loaded";

        private static string Digest(string content)
        {
            using (SHA256 sha = SHA256.Create())
            {
                byte[] digest = sha.ComputeHash(Encoding.UTF8.GetBytes(content));
                return BitConverter.ToString(digest).Replace("-", "").ToLowerInvariant();
            }
        }

        private static bool ValidWorld(WorldSaveData world)
        {
            return world != null && world.Header != null &&
                !string.IsNullOrWhiteSpace(world.Header.WorldId) &&
                world.Header.SchemaVersion == 1 && world.Player != null &&
                FirstNeighborhoodSaveIntegrity.Check(world,out _);
        }

        private static Slot TryReadSlot(string path)
        {
            if (!File.Exists(path)) return null;
            try
            {
                SaveEnvelope envelope=JsonUtility.FromJson<SaveEnvelope>(
                    File.ReadAllText(path, Encoding.UTF8));
                if (envelope == null || envelope.FormatVersion != FormatVersion ||
                    envelope.Generation < 1 ||
                    string.IsNullOrEmpty(envelope.PayloadJson) ||
                    string.IsNullOrWhiteSpace(envelope.Sha256) ||
                    !string.Equals(Digest(envelope.PayloadJson),envelope.Sha256,
                        StringComparison.OrdinalIgnoreCase))
                    return null;

                WorldSaveData world=JsonUtility.FromJson<WorldSaveData>(
                    envelope.PayloadJson);
                if(!ValidWorld(world))return null;
                world.Normalize();
                return new Slot { Path=path,World=world,Generation=envelope.Generation };
            }
            catch (Exception)
            {
                // A corrupt or incomplete slot is ignored only if another
                // valid slot or a valid legacy save can recover it.
                return null;
            }
        }

        private static WorldSaveData TryReadLegacy()
        {
            if (!File.Exists(FilePath))return null;
            try
            {
                WorldSaveData world=JsonUtility.FromJson<WorldSaveData>(
                    File.ReadAllText(FilePath, Encoding.UTF8));
                if(!ValidWorld(world))return null;
                world.Normalize();
                return world;
            }
            catch(Exception){return null;}
        }

        private static Slot Latest(Slot a, Slot b)
        {
            // Two individually valid checksums must NEVER merge different
            // world identities. Preserve both files for manual recovery.
            if(a!=null && b!=null &&
               a.World.Header.WorldId != b.World.Header.WorldId)
                throw new InvalidDataException(
                    "Two valid AfriLife save slots contain different world IDs.");
            if(a==null)return b;
            if(b==null)return a;
            if(a.Generation==b.Generation &&
               !string.Equals(JsonUtility.ToJson(a.World),
                   JsonUtility.ToJson(b.World),StringComparison.Ordinal))
                throw new InvalidDataException(
                    "Save slots have conflicting content for the same generation.");
            return b.Generation>a.Generation?b:a;
        }

        public static WorldSaveData LoadOrCreate()
        {
            Slot a=TryReadSlot(SlotAPath),b=TryReadSlot(SlotBPath);
            Slot latest=Latest(a,b);
            if(latest!=null)
            {
                LastLoadStatus=(File.Exists(SlotAPath)&&a==null) ||
                    (File.Exists(SlotBPath)&&b==null)
                    ? "recovered-valid-slot" : "loaded-verified-slot";
                return latest.World;
            }
            WorldSaveData legacy=TryReadLegacy();
            if(legacy!=null)
            {
                LastLoadStatus="loaded-legacy-save";
                return legacy; // Preserve original file during migration.
            }
            if(File.Exists(SlotAPath) || File.Exists(SlotBPath) ||
                File.Exists(FilePath))
            {
                LastLoadStatus="unrecoverable-save";
                // Never silently create a new character and overwrite data
                // when all known save files are unreadable.
                throw new InvalidDataException(
                    "AfriLife save files are unreadable; preserve both slots for recovery.");
            }
            LastLoadStatus="new-world";
            return CreateNew();
        }

        public static void Save(WorldSaveData save)
        {
            if(save==null)throw new ArgumentNullException(nameof(save));
            // Validate BEFORE Normalize(): normalization can truncate or
            // discard inconsistent ledger entries. Never silently repair an
            // invalid active game state by writing a checksum for the result.
            if(!ValidWorld(save))
                throw new InvalidDataException(
                    "World header or daily-life ledger is invalid.");
            save.Normalize();

            Slot a=TryReadSlot(SlotAPath),b=TryReadSlot(SlotBPath);
            Slot latest=Latest(a,b);
            WorldSaveData legacy=latest==null?TryReadLegacy():null;
            if(latest==null && legacy==null &&
                (File.Exists(SlotAPath)||File.Exists(SlotBPath)||
                 File.Exists(FilePath)))
                throw new InvalidDataException("Refusing to overwrite unreadable save slots.");
            if(latest!=null && latest.World.Header.WorldId!=save.Header.WorldId)
                throw new InvalidDataException("Cannot replace another world ID.");
            if(legacy!=null && legacy.Header.WorldId!=save.Header.WorldId)
                throw new InvalidDataException("Cannot replace the legacy world ID.");

            long generation=checked((latest?.Generation ?? 0L)+1L);
            string target=latest==null || latest.Path==SlotBPath
                ?SlotAPath:SlotBPath;
            save.Header.SavedAtUnixSeconds=DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            string worldJson=JsonUtility.ToJson(save,false);
            var envelope=new SaveEnvelope {
                FormatVersion=FormatVersion,Generation=generation,
                PayloadJson=worldJson,Sha256=Digest(worldJson)
            };
            string json=JsonUtility.ToJson(envelope,false);
            string temporary=target+".tmp";

            Directory.CreateDirectory(Application.persistentDataPath);
            // Checkpoint to the INACTIVE slot. The previously valid slot
            // remains intact through interruptions or device restarts.
            byte[] bytes=Encoding.UTF8.GetBytes(json);
            using(var stream=new FileStream(temporary,FileMode.Create,
                FileAccess.Write,FileShare.None))
            {
                stream.Write(bytes,0,bytes.Length);
                stream.Flush(true);
            }
            Slot verified=TryReadSlot(temporary);
            if(verified==null || verified.Generation!=generation)
                throw new InvalidDataException("Temporary save checksum verification failed.");

            if(File.Exists(target))File.Delete(target);
            File.Move(temporary,target);
            Slot committed=TryReadSlot(target);
            if(committed==null || committed.Generation!=generation)
                throw new InvalidDataException("Committed save verification failed.");
        }

        private static WorldSaveData CreateNew()
        {
            return new WorldSaveData {
                Header = new WorldSaveHeader {
                    SchemaVersion=1,WorldId=Guid.NewGuid().ToString("N")
                }
            };
        }
    }
}
