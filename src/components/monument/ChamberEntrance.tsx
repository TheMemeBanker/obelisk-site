"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { df } from "./constants";

const DECOYS = [
  { label: "Power", rejection: "Power crumbles. The monument does not." },
  { label: "Truth", rejection: "Truth is found, not given. Try again." },
  { label: "Wealth", rejection: "Wealth corrodes. The monument is patient." },
];

interface Props {
  onComplete: () => void;
  onError: () => void;
  onSuccess: () => void;
  onSecret: (id: string) => void;
}

export function ChamberEntrance({ onComplete, onError, onSuccess, onSecret }: Props) {
  const [opacity, setOpacity] = useState(0);
  const [entered, setEntered] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [rejection, setRejection] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [guess, setGuess] = useState("");
  const [wrongGuess, setWrongGuess] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setOpacity(1), 100);
    return () => clearTimeout(t);
  }, []);

  const handleDecoy = (d: (typeof DECOYS)[number]) => {
    setRejection(d.rejection);
    setWrongCount((c) => c + 1);
    onError();
    if (wrongCount >= 1) {
      setTimeout(() => setShowInput(true), 1200);
    }
  };

  const handleSubmit = () => {
    const norm = guess.trim().toLowerCase();
    if (norm === "knowledge") {
      setEntered(true);
      onSuccess();
    } else {
      setWrongGuess(true);
      onError();
    }
  };

  const handleInscriptionHover = () => {
    hoverTimerRef.current = setTimeout(() => {
      onSecret("entrance-inscription");
    }, 2000);
  };

  const handleInscriptionLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[70vh] text-center transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div
        className="relative w-24 h-24 mb-8"
        onMouseEnter={handleInscriptionHover}
        onMouseLeave={handleInscriptionLeave}
      >
        <Image src="/images/Obelisk4.png" alt="Obelisk" fill className="object-contain pulse-glow" />
        {/* Hidden inscription easter egg */}
        <span
          className="absolute inset-0 flex items-end justify-center text-[8px] font-mono tracking-[0.3em] text-[var(--neon)] pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        >
          KNOWLEDGE
        </span>
      </div>

      {!entered ? (
        <>
          <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
            Depth: Surface
          </p>
          <h2 className={`${df} text-2xl sm:text-4xl text-[var(--ink)] mb-4`}>The Entrance</h2>
          <p className="text-sm text-[var(--ink-soft)] max-w-md mb-8 leading-relaxed">
            You stand before the monument. Its surface is warm to the touch. Glyphs pulse faintly in
            the stone. There is no door — only a question.
          </p>
          <p className="text-base italic text-[var(--ink-soft)] mb-6">
            &ldquo;What do you seek inside a structure that has no rooms?&rdquo;
          </p>

          {/* How it works — collapsible */}
          <details className="mb-6 max-w-md w-full text-left rounded-xl border border-[var(--hairline)] bg-[var(--bg-card)] px-5 py-3 group">
            <summary className={`${df} text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] cursor-pointer list-none flex items-center justify-between`}>
              <span>How does this work?</span>
              <span className="text-[var(--neon)] text-xs group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="mt-3 space-y-2 text-xs text-[var(--ink-soft)] leading-relaxed">
              <p>The monument is a <span className="text-[var(--neon)]">7-chamber descent</span>. Each chamber has a puzzle you must solve to go deeper.</p>
              <p>You&apos;ll face riddles, ciphers, pattern memory, spatial puzzles, and a dark maze. Answer wrong and the monument pushes back. Answer right and you descend.</p>
              <p>Your <span className="text-[var(--neon)]">time, mistakes, and hints</span> are tracked. At the bottom, you&apos;ll receive a rank based on how you performed.</p>
              <p>There are also <span className="text-[var(--neon)]">4 hidden secrets</span> scattered throughout. Find them all for the highest rank.</p>
              <p className="text-[var(--ink-faint)] italic">Good luck. The monument is watching.</p>
            </div>
          </details>

          {rejection && (
            <p className="text-sm text-red-400/80 italic mb-6 animate-fade-in">{rejection}</p>
          )}

          {!showInput ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {DECOYS.map((d) => (
                <button
                  key={d.label}
                  onClick={() => handleDecoy(d)}
                  className={`btn-outline ${df} text-xs`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-fade-in max-w-sm w-full">
              <p className="text-xs text-[var(--ink-faint)] mb-4 font-mono">
                The monument does not offer choices. It asks what you seek.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => {
                    setGuess(e.target.value);
                    setWrongGuess(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && guess.trim()) handleSubmit();
                  }}
                  placeholder="Speak..."
                  autoComplete="off"
                  className="w-full rounded-xl border border-[var(--hairline-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-mono text-[var(--ink)] outline-none transition focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/20 placeholder:text-[var(--ink-faint)]"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!guess.trim()}
                  className="btn-neon whitespace-nowrap text-xs disabled:opacity-40"
                >
                  Speak
                </button>
              </div>
              {wrongGuess && (
                <p className={`mt-3 ${df} text-xs text-red-400`}>
                  The stone is silent. That is not the word.
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="animate-fade-in">
          <p className="text-[var(--neon)] text-lg mb-4">The stone parts.</p>
          <p className="text-sm text-[var(--ink-soft)] mb-8">
            You step inside. The air is colder here.
          </p>
          <button onClick={onComplete} className={`btn-outline ${df} text-xs`}>
            Descend
          </button>
        </div>
      )}
    </div>
  );
}
