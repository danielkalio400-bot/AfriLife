# AfriLife Bulk 46 — Physically gated casual resident dialogue

The existing walkable prototype now permits a player who approaches an awake, physically present member of the three original neighborhood residents (Ada, Bola, Kwame) to open a **casual local conversation**, even outside the single scripted daily-life conversation step. Each person offers original location-oriented dialogue varying with the saved simulated morning, daytime and evening clock. Returning players receive a familiar greeting based on persisted conversation history.

Casual conversation is deliberately **read-only**. It does not auto-complete a daily-life step, credit money, increase reputation, or create another NPC conversation ledger. This prevents a repeated HUD tap from farming progression. The original `FirstNeighborhoodResidentService.TryConversation` remains the authority for the mandatory story interaction. A separate defect was corrected: a successful mandatory scripted conversation now increments `ConversationCount` and records `LastConversationDay` in the canonical world save, so the HUD total reflects actual persisted interaction. The semantic save integrity check rejects negative totals and impossible last-day values.

Node reference tests check all three residents across simulated dayparts, physical proximity, sleeping status, returning dialogue, unchanged wallets/progression, and Unity HUD/source wiring.

This remains locally scripted prototype dialogue: there is no voice synthesis, NPC AI, real-world Lagos conversations, multiplayer sync or Unity Editor/device compilation certification.
