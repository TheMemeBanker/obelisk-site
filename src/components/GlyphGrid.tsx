"use client";

import { useState } from "react";

const GLYPHS = [
  {
    symbol: "[◇]",
    name: "The Vault",
    riddle: "I hold everything yet own nothing. I open for those with the right key, but no locksmith can craft it. What am I?",
    accepts: ["wallet", "a wallet", "crypto wallet"],
  },
  {
    symbol: "◎",
    name: "The Oracle",
    riddle: "I speak the truth but have no mouth. I watch the market but have no eyes. Kill me and the towers fall. What am I?",
    accepts: ["price feed", "a price feed", "oracle", "an oracle", "price oracle"],
  },
  {
    symbol: "⊕",
    name: "The Genesis",
    riddle: "I am the first and can never be second. Everyone knows me but no one chose me. I was born with no parent. What am I?",
    accepts: ["genesis block", "the genesis block", "genesis"],
  },
  {
    symbol: "⟐",
    name: "The Bridge",
    riddle: "I connect two kingdoms that speak different tongues. Cross me and your gold changes form. Trust me wrong and it vanishes. What am I?",
    accepts: ["bridge", "a bridge", "cross-chain bridge", "a cross-chain bridge", "cross chain bridge"],
  },
  {
    symbol: "✕",
    name: "The Burn",
    riddle: "I destroy to create value. The more of me that dies, the richer the survivors become. Empires use me as medicine. What am I?",
    accepts: ["burn", "a burn", "token burn", "a token burn"],
  },
  {
    symbol: "◉",
    name: "The Node",
    riddle: "I repeat what others say, yet I am not a parrot. Without me the truth is just an opinion. There are thousands of me, and we must agree. What am I?",
    accepts: ["node", "a node", "validator", "a validator", "validator node", "a validator node"],
  },
  {
    symbol: "⌘",
    name: "The Contract",
    riddle: "I am a promise that keeps itself. No judge, no jury — only math. Break my rules and I simply refuse. What am I?",
    accepts: ["smart contract", "a smart contract", "contract"],
  },
  {
    symbol: "⊛",
    name: "The Pool",
    riddle: "Two rivers flow into me and I give travelers a fair exchange. Drain one side and the other becomes priceless. What am I?",
    accepts: ["liquidity pool", "a liquidity pool", "pool", "a pool", "lp"],
  },
  {
    symbol: "◈",
    name: "The Key",
    riddle: "I am a number so large that guessing me would outlast the sun. Share my shadow freely, but reveal me and you lose everything. What am I?",
    accepts: ["private key", "a private key", "key", "secret key"],
  },
  {
    symbol: "⟡",
    name: "The Airdrop",
    riddle: "I fall from the sky to those who were present. I reward the past, not the future. Chase me and I vanish. What am I?",
    accepts: ["airdrop", "an airdrop", "air drop"],
  },
  {
    symbol: "⊞",
    name: "The Block",
    riddle: "I am a page in a book that can never be erased. Fill me up and the next one begins. I am numbered but never named. What am I?",
    accepts: ["block", "a block"],
  },
  {
    symbol: "⌬",
    name: "The Hash",
    riddle: "Feed me a library and I give you a fingerprint. Change one letter and I am unrecognizable. I am chaos with perfect memory. What am I?",
    accepts: ["hash", "a hash", "hash function", "a hash function", "hashing"],
  },
];

const df = "font-[family-name:var(--font-display)]";

export function GlyphGrid() {
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handleSubmit = (i: number) => {
    const glyph = GLYPHS[i];
    const normalized = guess.trim().toLowerCase().replace(/[.!?,]/g, "");
    if (glyph.accepts.includes(normalized)) {
      setSolved((prev) => new Set(prev).add(i));
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const handleSelect = (i: number) => {
    setSelected(i);
    setGuess("");
    setFeedback(null);
  };

  const glyph = selected !== null ? GLYPHS[selected] : null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {GLYPHS.map((g, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`flex flex-col items-center justify-center rounded-xl border p-5 transition cursor-pointer ${
              selected === i
                ? "border-[var(--neon)] bg-[var(--neon-glow)]"
                : solved.has(i)
                ? "border-[var(--neon-deep)] bg-[var(--neon-dim)]"
                : "border-[var(--hairline)] bg-[var(--bg-card)] hover:border-[var(--neon)] hover:bg-[var(--neon-dim)]"
            }`}
          >
            <span className="font-mono text-2xl text-[var(--neon)] mb-2">{g.symbol}</span>
            <span className={`${df} text-[10px] uppercase tracking-[0.2em] ${solved.has(i) ? "text-[var(--neon-deep)]" : "text-[var(--ink-faint)]"}`}>
              {solved.has(i) ? g.name : `Glyph ${String(i + 1).padStart(2, "0")}`}
            </span>
          </button>
        ))}
      </div>

      {/* Riddle panel */}
      {glyph && selected !== null && (
        <div className="mt-8 rounded-2xl border border-[var(--neon)] bg-[var(--bg-card)] p-5 sm:p-8 text-center">
          <span className="font-mono text-4xl text-[var(--neon)] text-glow">{glyph.symbol}</span>
          <p className={`mt-4 ${df} text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)]`}>
            {solved.has(selected) ? glyph.name : `Glyph ${String(selected + 1).padStart(2, "0")}`}
          </p>
          <p className="mt-4 text-sm sm:text-lg leading-relaxed text-[var(--ink-soft)] italic">
            &ldquo;{glyph.riddle}&rdquo;
          </p>

          {solved.has(selected) ? (
            <div className="mt-6 rounded-xl border border-[var(--neon)] bg-[var(--neon-dim)] p-4">
              <p className={`${df} text-sm font-bold text-[var(--neon)]`}>
                Decoded.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => { setGuess(e.target.value); setFeedback(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter" && guess.trim()) handleSubmit(selected); }}
                  placeholder="Your answer..."
                  className="w-full rounded-xl border border-[var(--hairline-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-mono text-[var(--ink)] outline-none transition focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/20 placeholder:text-[var(--ink-faint)]"
                />
                <button
                  onClick={() => handleSubmit(selected)}
                  disabled={!guess.trim()}
                  className="btn-neon whitespace-nowrap text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>

              {feedback === "wrong" && (
                <p className={`mt-3 ${df} text-xs text-red-400`}>
                  The monument does not accept this answer. Try again.
                </p>
              )}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => { setSelected(null); setFeedback(null); setGuess(""); }}
              className={`${df} text-xs text-[var(--ink-faint)] transition hover:text-[var(--ink-soft)]`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {solved.size > 0 && selected === null && (
        <p className={`mt-6 text-center ${df} text-xs text-[var(--ink-faint)]`}>
          {solved.size}/12 glyphs decoded
        </p>
      )}

      {solved.size === 12 && (
        <div className="mt-6 rounded-xl border border-[var(--neon)] bg-[var(--neon-dim)] p-6 text-center">
          <p className={`${df} text-sm font-bold text-[var(--neon)] text-glow`}>
            All 12 glyphs decoded. The monument recognizes you.
          </p>
        </div>
      )}
    </>
  );
}
