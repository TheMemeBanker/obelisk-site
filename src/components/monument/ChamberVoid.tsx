"use client";

import { useState } from "react";
import { df, DEXSCREENER } from "./constants";

interface Props {
  onSecret: (id: string) => void;
  onSuccess: () => void;
}

const ACCEPTED = ["nothing", "void", "emptiness", "empty space", "the void", "space", "absence"];

export function ChamberVoid({ onSecret, onSuccess }: Props) {
  const [guess, setGuess] = useState("");
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);

  const check = () => {
    const norm = guess.trim().toLowerCase();
    if (ACCEPTED.includes(norm)) {
      setSolved(true);
      onSecret("void-solved");
      onSuccess();
    } else {
      setWrong(true);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      style={{ background: "#020202" }}
    >
      {!solved ? (
        <div className="max-w-md">
          <p
            className="text-base sm:text-lg leading-relaxed italic mb-8"
            style={{ color: "rgba(255,255,255,0.06)" }}
          >
            &ldquo;I am the space between the stones. I am what makes the monument not a wall.
            Without me, there is only mass. What am I?&rdquo;
          </p>

          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                setWrong(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && guess.trim()) check();
              }}
              placeholder=""
              autoComplete="off"
              className="w-full max-w-48 text-center rounded-xl border border-white/5 bg-transparent px-4 py-3 text-sm font-mono text-white/10 outline-none transition focus:border-white/10 focus:text-white/20 placeholder:text-white/3"
            />
            <button
              onClick={check}
              disabled={!guess.trim()}
              className="text-white/5 font-mono text-xs transition hover:text-white/10 disabled:opacity-0"
            >
              →
            </button>
          </div>
          {wrong && (
            <p className="mt-3 font-mono text-[10px]" style={{ color: "rgba(255,60,60,0.15)" }}>
              Silence.
            </p>
          )}
          <a
            href="/monument"
            className="mt-8 inline-block font-mono text-[10px]"
            style={{ color: "rgba(255,255,255,0.04)" }}
          >
            Return to the light
          </a>
        </div>
      ) : (
        <div className="animate-fade-in max-w-md">
          {/* Explosion to brightness */}
          <div
            className="fixed inset-0 pointer-events-none transition-all duration-1000"
            style={{
              background:
                "radial-gradient(circle, rgba(200,255,0,0.15) 0%, transparent 70%)",
            }}
          />
          <h2 className={`${df} text-3xl text-[var(--neon)] text-glow mb-6`}>VOID WALKER</h2>
          <p className="text-sm text-[var(--ink-soft)] mb-8 leading-relaxed">
            You found the space between. The monument has no more secrets for you. You are the
            silence that gives the stone meaning.
          </p>
          <div className="rounded-xl border border-purple-500/40 bg-purple-900/10 p-6 mb-6">
            <p className="text-xs text-purple-300/60 font-mono mb-2">TRUE RANK ACHIEVED</p>
            <p className={`${df} text-xl text-purple-300 mb-3`}>Void Walker</p>
            <p className="text-xs text-purple-400/40 italic">
              The highest rank. Beyond the monument itself.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={DEXSCREENER}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-neon ${df} text-xs`}
            >
              View $PRELODE
            </a>
            <a href="/" className={`btn-outline ${df} text-xs`}>
              Return to surface
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
