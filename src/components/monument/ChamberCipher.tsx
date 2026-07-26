"use client";

import { useState } from "react";
import { df, CIPHER_PLAINTEXT, CIPHER_ENCODED } from "./constants";

interface Props {
  onComplete: () => void;
  onError: () => void;
  onSuccess: () => void;
  onHint: () => void;
}

export function ChamberCipher({ onComplete, onError, onSuccess, onHint }: Props) {
  const [guess, setGuess] = useState("");
  const [wrong, setWrong] = useState(false);
  const [phase, setPhase] = useState<"cipher" | "sequence" | "done">("cipher");
  const [hintLevel, setHintLevel] = useState(0);
  const [lockedChars, setLockedChars] = useState(0);
  const [seqGuess, setSeqGuess] = useState("");
  const [seqWrong, setSeqWrong] = useState(false);
  const [scrambled, setScrambled] = useState(false);

  const checkCipher = () => {
    if (guess.trim().toLowerCase() === CIPHER_PLAINTEXT) {
      // Lock-in animation
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setLockedChars(i);
        if (i >= CIPHER_PLAINTEXT.length) {
          clearInterval(interval);
          onSuccess();
          setTimeout(() => setPhase("sequence"), 800);
        }
      }, 40);
    } else {
      setWrong(true);
      onError();
      // Scramble effect
      setScrambled(true);
      setTimeout(() => setScrambled(false), 600);
    }
  };

  const checkSequence = () => {
    if (seqGuess.trim() === "6") {
      onSuccess();
      setPhase("done");
      setTimeout(onComplete, 800);
    } else {
      setSeqWrong(true);
      onError();
    }
  };

  const useHint = () => {
    setHintLevel((h) => h + 1);
    onHint();
  };

  const scrambleText = (text: string) => {
    const chars = "zyxwvutsrqponmlkjihgfedcba ";
    return text
      .split("")
      .map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * 26)]))
      .join("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
        Depth: -2
      </p>
      <h2 className={`${df} text-2xl sm:text-4xl text-[var(--ink)] mb-4`}>The Cipher Room</h2>

      {phase === "cipher" && (
        <>
          <p className="text-sm text-[var(--ink-soft)] max-w-md mb-8 leading-relaxed">
            An inscription glows on the floor, but the letters are reversed. Decode the message to
            proceed.
          </p>
          <div className="rounded-xl border border-[var(--neon)] bg-[var(--bg-card)] p-6 mb-6 max-w-md w-full">
            <p
              className={`font-mono text-lg sm:text-xl tracking-[0.15em] text-[var(--neon)] text-glow select-all transition-all ${scrambled ? "blur-[2px]" : ""}`}
            >
              {scrambled ? scrambleText(CIPHER_ENCODED) : CIPHER_ENCODED}
            </p>
          </div>

          {/* Lock-in display */}
          {lockedChars > 0 && (
            <div className="mb-4 font-mono text-lg tracking-[0.15em]">
              {CIPHER_PLAINTEXT.split("").map((c, i) => (
                <span
                  key={i}
                  className={`transition-all duration-200 ${i < lockedChars ? "text-[var(--neon)] text-glow" : "text-[var(--ink-faint)]"}`}
                >
                  {i < lockedChars ? c : "·"}
                </span>
              ))}
            </div>
          )}

          {hintLevel >= 1 && (
            <p className="text-xs text-[var(--ink-faint)] mb-2 font-mono">
              Hint: A becomes Z, B becomes Y, C becomes X...
            </p>
          )}
          {hintLevel >= 2 && (
            <p className="text-xs text-[var(--ink-faint)] mb-2 font-mono">
              Hint: The alphabet is reversed. &quot;gsv&quot; = &quot;the&quot;
            </p>
          )}
          {hintLevel >= 3 && (
            <p className="text-xs text-[var(--ink-faint)] mb-4 font-mono">
              Hint: gsv = the, nlmfnvmg = monument, ivnvnyvih = remembers
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md w-full">
            <input
              type="text"
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                setWrong(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && guess.trim()) checkCipher();
              }}
              placeholder="Decode the inscription..."
              autoComplete="off"
              className="w-full rounded-xl border border-[var(--hairline-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-mono text-[var(--ink)] outline-none transition focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/20 placeholder:text-[var(--ink-faint)]"
            />
            <button
              onClick={checkCipher}
              disabled={!guess.trim()}
              className="btn-neon whitespace-nowrap text-xs disabled:opacity-40"
            >
              Submit
            </button>
          </div>
          {wrong && (
            <p className={`mt-3 ${df} text-xs text-red-400`}>
              The stone rejects your translation.
            </p>
          )}
          {hintLevel < 3 && (
            <button
              onClick={useHint}
              className="mt-4 font-mono text-[10px] text-[var(--ink-faint)] transition hover:text-[var(--ink-soft)] underline underline-offset-2"
            >
              I need a hint
            </button>
          )}
        </>
      )}

      {phase === "sequence" && (
        <div className="animate-fade-in">
          <div className="rounded-xl border border-[var(--neon)] bg-[var(--neon-dim)] p-4 mb-8 max-w-md">
            <p className={`${df} text-sm text-[var(--neon)]`}>
              &ldquo;{CIPHER_PLAINTEXT}&rdquo; — Decoded.
            </p>
          </div>
          <p className="text-sm text-[var(--ink-soft)] max-w-md mb-6 leading-relaxed">
            A second inscription appears beneath the first — a sequence etched in stone.
          </p>
          <div className="rounded-xl border border-[var(--hairline-strong)] bg-[var(--bg-card)] p-6 mb-6 max-w-md w-full">
            <p className="font-mono text-2xl tracking-[0.2em] text-[var(--neon)] text-glow">
              3, 1, 4, 1, 5, 9, 2, ?
            </p>
          </div>
          <p className="text-xs text-[var(--ink-faint)] mb-4 font-mono">
            What comes next?
          </p>
          <div className="flex items-center justify-center gap-3 max-w-xs w-full mx-auto">
            <input
              type="text"
              value={seqGuess}
              onChange={(e) => {
                setSeqGuess(e.target.value);
                setSeqWrong(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && seqGuess.trim()) checkSequence();
              }}
              placeholder="?"
              autoComplete="off"
              className="w-full sm:w-20 text-center rounded-xl border border-[var(--hairline-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-lg font-mono text-[var(--ink)] outline-none transition focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/20 placeholder:text-[var(--ink-faint)]"
            />
            <button
              onClick={checkSequence}
              disabled={!seqGuess.trim()}
              className="btn-neon whitespace-nowrap text-xs disabled:opacity-40"
            >
              Submit
            </button>
          </div>
          {seqWrong && (
            <p className={`mt-3 ${df} text-xs text-red-400`}>
              The numbers do not agree.
            </p>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="animate-fade-in">
          <p className="text-sm text-[var(--neon)] mb-6">
            Both inscriptions glow bright. The floor shifts. A staircase spirals downward.
          </p>
          <button onClick={onComplete} className={`btn-outline ${df} text-xs`}>
            Descend deeper
          </button>
        </div>
      )}
    </div>
  );
}
