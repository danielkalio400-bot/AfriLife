using System;
using System.IO;
using UnityEngine;

namespace AfriLife.Core.Save
{
    public static class LocalWorldSaveStore
    {
        private const string FileName = "afrilife-local-world.json";

        public static string FilePath => Path.Combine(Application.persistentDataPath, FileName);

        public static void Save(WorldSaveData save)
        {
            if (save == null) throw new ArgumentNullException(nameof(save));
            save.Normalize();
            save.Header.SavedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            string json = JsonUtility.ToJson(save, true);
            string temporary = FilePath + ".tmp";
            File.WriteAllText(temporary, json);

            if (File.Exists(FilePath)) File.Delete(FilePath);
            File.Move(temporary, FilePath);
        }

        public static WorldSaveData LoadOrCreate()
        {
            if (!File.Exists(FilePath)) return CreateNew();

            try
            {
                var data = JsonUtility.FromJson<WorldSaveData>(File.ReadAllText(FilePath));
                if (data == null) return CreateNew();
                data.Normalize();
                return data;
            }
            catch (Exception exception)
            {
                Debug.LogWarning($"AfriLife local save could not be loaded: {exception.Message}");
                return CreateNew();
            }
        }

        private static WorldSaveData CreateNew()
        {
            return new WorldSaveData
            {
                Header = new WorldSaveHeader
                {
                    SchemaVersion = 1,
                    WorldId = Guid.NewGuid().ToString("N")
                }
            };
        }
    }
}
