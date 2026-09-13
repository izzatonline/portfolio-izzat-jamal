export const emotes = [
  { id: "wave", label: "Wave", key: "1", icon: "👋" },
  { id: "dance", label: "Dance", key: "2", icon: "🎵" },
  { id: "celebrate", label: "Celebrate", key: "3", icon: "🎉" },
  { id: "kopi", label: "Drink kopi", key: "4", icon: "☕" },
] as const;
export type Emote = (typeof emotes)[number]["id"];
