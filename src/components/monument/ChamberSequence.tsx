"use client";

import { useState, useEffect } from "react";
import { df, SEQUENCE_LABELS, SEQUENCE_PATTERN } from "./constants";

interface Props {
  onComplete: () => void;
  onError: () => void;
  onSuccess: () => void;
  playPillarTone: (index: number) => void;
}

const ROUND_SPEEDS = [600, 500, 400];
const ROUND_LENGTHS = [4, 5, 7];

export function ChamberSequence({ onComplete, onError, onSuccess, playPillarTone }: Props) {
  const [showing, setShowing] = useState(true);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [result, setResult] = useState<"none" | "wrong" | "correct">("none");
  const [round, setRound] = useState(0);
  const [pulseIdx, setPulseIdx] = useState(-1);
  const [roundFlash, setRoundFlash] = useState(false);

  const currentLength = ROUND_LENGTHS[round] || 7;
  const currentSpeed = ROUND_SPEEDS[round] || 400;
  const currentPattern = SEQUENCE_PATTERN.slice(0, currentLength);

  useEffect(() => {
    if (!showing) return;
    let i = 0;
    setHighlightIdx(-1);
    const interval = setInterval(() => {
      if (i < currentPattern.length) {
        setHighlightIdx(currentPattern[i]);
        playPillarTone(currentPattern[i]);
        i++;
      } else {
        setHighlightIdx(-1);
        setShowing(false);
        clearInterval(interval);
      }
    }, currentSpeed);
    return () => clearInterval(interval);
  }, [showing, round, currentPattern.length, currentSpeed, playPillarTone, currentPattern]);

  const handlePillarClick = (idx: number) => {
    if (showing || result === "correct") return;
    playPillarTone(idx);

    // Pulse ring effect
    setPulseIdx(idx);
    setTimeout(() => setPulseIdx(-1), 400);

    const next = [...playerInput, idx];
    setPlayerInput(next);

    if (next[next.length - 1] !== currentPattern[next.length - 1]) {
      setResult("wrong");
      onError();
      setTimeout(() => {
        setPlayerInput([]);
        setResult("none");
        setShowing(true);
      }, 1200);
      return;
    }

    if (next.length === currentPattern.length) {
      // Round complete flash
      setRoundFlash(true);
      setTimeout(() => setRoundFlash(false), 400);

      if (round >= 2) {
        setResult("correct");
        onSuccess();
      } else {
        setTimeout(() => {
          setPlayerInput([]);
          setRound((r) => r + 1);
          setShowing(true);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
        Depth: -3
      </p>
      <h2 className={`${df} text-2xl sm:text-4xl text-[var(--ink)] mb-4`}>The Pillar Chamber</h2>
      <p className="text-sm text-[var(--ink-soft)] max-w-md mb-4 leading-relaxed">
        Four pillars stand in a circle. They illuminate in sequence. Repeat the pattern to prove
        your memory is worthy of the monument.
      </p>

      <div className="flex items-center gap-2 mb-6">
        {[0, 1, 2].map((r) => (
          <div
            key={r}
            className={`w-2 h-2 rounded-full transition-all ${
              r < round
                ? "bg-[var(--neon)]"
                : r === round
                  ? "bg-[var(--neon)] animate-pulse"
                  : "bg-[var(--ink-faint)]"
            }`}
          />
        ))}
        <span className="font-mono text-[10px] text-[var(--ink-faint)] ml-2">
          Round {round + 1}/3
        </span>
      </div>

      <p className={`${df} text-xs text-[var(--ink-faint)] mb-6`}>
        {showing
          ? "Watch the sequence..."
          : `Repeat it (${playerInput.length}/${currentPattern.length})`}
      </p>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8">
        {SEQUENCE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => handlePillarClick(i)}
            disabled={showing || result === "correct"}
            className={`relative w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-200 ${
              highlightIdx === i || roundFlash
                ? "border-[var(--neon)] bg-[var(--neon)] text-[var(--bg)] scale-110 shadow-[0_0_20px_rgba(200,255,0,0.4)]"
                : result === "wrong"
                  ? "border-red-500/40 bg-[var(--bg-card)] text-red-400 brightness-50"
                  : "border-[var(--hairline-strong)] bg-[var(--bg-card)] text-[var(--neon)] hover:border-[var(--neon)] cursor-pointer"
            } disabled:cursor-default`}
          >
            {label}
            {/* Pulse ring */}
            {pulseIdx === i && (
              <span className="absolute inset-0 rounded-xl border-2 border-[var(--neon)] animate-ping opacity-40" />
            )}
          </button>
        ))}
      </div>

      {result === "wrong" && (
        <p className={`${df} text-xs text-red-400 animate-fade-in`}>
          Wrong sequence. The pillars reset.
        </p>
      )}

      {result === "correct" && (
        <div className="animate-fade-in">
          <p className="text-sm text-[var(--neon)] mb-6">
            The pillars bow. A hidden passage reveals itself.
          </p>
          <button onClick={onComplete} className={`btn-outline ${df} text-xs`}>
            Descend deeper
          </button>
        </div>
      )}
    </div>
  );
}
