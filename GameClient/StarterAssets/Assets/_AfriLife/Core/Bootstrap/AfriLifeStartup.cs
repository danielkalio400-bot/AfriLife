using UnityEngine;

namespace AfriLife.Core
{
    public sealed class AfriLifeStartup : MonoBehaviour
    {
        private void Awake() => DontDestroyOnLoad(gameObject);
        private void Start() => Debug.Log("AfriLife architecture scaffold loaded.");
    }
}
