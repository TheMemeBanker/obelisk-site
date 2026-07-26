export const DEXSCREENER =
  "https://dexscreener.com/solana/hfrefa2jczxntgn7negisjz84yqjzs64zsgdezwwynpd";

export const df = "font-[family-name:var(--font-display)]";

export const GLYPH_SYMBOLS = ["[◇]", "◎", "⊕", "⟐", "✕", "◉", "⌘", "⊛", "◈", "⟡", "⊞", "⌬"];

export const CIPHER_ALPHABET = "zyxwvutsrqponmlkjihgfedcba";

export function encodeCipher(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((c) => {
      const i = "abcdefghijklmnopqrstuvwxyz".indexOf(c);
      return i >= 0 ? CIPHER_ALPHABET[i] : c;
    })
    .join("");
}

export const CIPHER_PLAINTEXT = "the monument remembers";
export const CIPHER_ENCODED = encodeCipher(CIPHER_PLAINTEXT);

export const SEQUENCE_LABELS = ["⊕", "◎", "◈", "⊛"];
export const SEQUENCE_PATTERN = [2, 0, 3, 1, 2, 0, 3, 1, 0, 3];

export const FRAGMENTS = [
  "What was built to last",
  "will outlast its builders.",
  "Stone forgets nothing.",
  "Code forgives nothing.",
  "The first block was lonely.",
  "The last block hasn't been born.",
  "Every monument must be preloded before it can stand.",
];

export const CHAMBERS = [
  "entrance",
  "echoes",
  "cipher",
  "sequence",
  "mirror",
  "labyrinth",
  "heart",
] as const;
export type Chamber = (typeof CHAMBERS)[number];

export const CHAMBER_NAMES: Record<Chamber, string> = {
  entrance: "The Entrance",
  echoes: "Hall of Echoes",
  cipher: "Cipher Room",
  sequence: "Pillar Chamber",
  mirror: "Mirror Chamber",
  labyrinth: "The Labyrinth",
  heart: "The Heart",
};

export const CHAMBER_GLYPHS: Record<Chamber, string> = {
  entrance: "⊕",
  echoes: "◎",
  cipher: "◈",
  sequence: "⊛",
  mirror: "⟡",
  labyrinth: "⌬",
  heart: "◉",
};
