"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { df, DEXSCREENER } from "./constants";
import type { MonumentScore } from "./useMonumentScore";

interface Props {
  score: MonumentScore;
  hasPrelodeSecret: boolean;
  onVoidEnter: () => void;
  voidUnlocked: boolean;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function hashScore(s: MonumentScore) {
  const str = `${s.totalTime}-${s.completions}-${s.secretsFound.length}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).toUpperCase().padStart(8, "0");
}

export function ChamberHeart({ score, hasPrelodeSecret, onVoidEnter, voidUnlocked }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showRank, setShowRank] = useState(false);
  const [rankChars, setRankChars] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showPrelode, setShowPrelode] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullText =
    "You reached the heart of the monument. Few have stood here. The stone knows your presence now. But every monument needs a power source — an energy that was loaded before the first stone was placed.";

  // Variable-speed typewriter
  useEffect(() => {
    if (!revealed || charCount >= fullText.length) return;
    const char = fullText[charCount];
    const delay = char === "." || char === "—" ? 120 : char === "," ? 60 : 25;
    const t = setTimeout(() => setCharCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [revealed, charCount, fullText]);

  // Show rank after typewriter
  useEffect(() => {
    if (charCount >= fullText.length && revealed && !showRank) {
      const t = setTimeout(() => setShowRank(true), 1000);
      return () => clearTimeout(t);
    }
  }, [charCount, fullText.length, revealed, showRank]);

  // Rank letter-by-letter reveal
  useEffect(() => {
    if (!showRank || rankChars >= score.rank.length) return;
    const t = setTimeout(() => setRankChars((c) => c + 1), 80);
    return () => clearTimeout(t);
  }, [showRank, rankChars, score.rank.length]);

  // Show score breakdown after rank
  useEffect(() => {
    if (rankChars >= score.rank.length && showRank && !showScore) {
      const t = setTimeout(() => setShowScore(true), 600);
      return () => clearTimeout(t);
    }
  }, [rankChars, score.rank.length, showRank, showScore]);

  // Show $PRELODE after score
  useEffect(() => {
    if (showScore && !showPrelode) {
      const t = setTimeout(() => setShowPrelode(true), 1200);
      return () => clearTimeout(t);
    }
  }, [showScore, showPrelode]);

  const totalAttempts = Object.values(score.attempts).reduce((a, b) => a + b, 0);
  const monumentId = hashScore(score);

  const shareText = `I reached the Heart of the Monument in ${formatTime(score.totalTime)} | Rank: ${score.rank} | Secrets: ${score.secretsFound.length}/4 | obelisk.fund/monument`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
        Depth: -6 — The Core
      </p>
      <h2 className={`${df} text-2xl sm:text-4xl text-[var(--neon)] mb-8 text-glow`}>
        The Heart of the Monument
      </h2>

      {!revealed ? (
        <>
          <div className="relative w-32 h-32 mb-8">
            <Image src="/images/Obelisk4.png" alt="Core" fill className="object-contain pulse-glow" />
          </div>
          <p className="text-sm text-[var(--ink-soft)] max-w-md mb-8 leading-relaxed">
            A single stone floats in the center of the chamber, radiating light. Touch it to receive
            the monument&apos;s message.
          </p>
          <button onClick={() => setRevealed(true)} className={`btn-neon ${df} text-xs`}>
            Touch the stone
          </button>
        </>
      ) : (
        <div className="max-w-lg w-full">
          {/* Typewriter text */}
          <p className="text-base sm:text-lg leading-relaxed text-[var(--ink-soft)] mb-8 min-h-[4rem]">
            {fullText.slice(0, charCount)}
            {charCount < fullText.length && (
              <span className="animate-pulse text-[var(--neon)]">|</span>
            )}
          </p>

          {/* Rank reveal */}
          {showRank && (
            <div className="animate-fade-in space-y-4 mb-6">
              <div className="rounded-xl border border-[var(--neon)] bg-[var(--neon-dim)] p-6">
                <p
                  className={`${df} text-xs uppercase tracking-[0.2em] text-[var(--neon-deep)] mb-3`}
                >
                  Monument Status
                </p>
                <p className={`${df} text-2xl text-[var(--neon)] text-glow`}>
                  {score.rank
                    .split("")
                    .map((c, i) => (
                      <span
                        key={i}
                        className={`inline-block transition-all duration-300 ${i < rankChars ? "opacity-100" : "opacity-0"}`}
                      >
                        {c}
                      </span>
                    ))}
                </p>
                <p className="font-mono text-[10px] text-[var(--ink-faint)] mt-2">
                  Monument ID: #{monumentId}
                </p>
              </div>
            </div>
          )}

          {/* Score breakdown */}
          {showScore && (
            <div className="animate-fade-in space-y-3 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--bg-card)] p-3">
                  <p className="font-mono text-lg text-[var(--neon)]">
                    {formatTime(score.totalTime)}
                  </p>
                  <p className="text-[10px] text-[var(--ink-faint)]">Total Time</p>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--bg-card)] p-3">
                  <p className="font-mono text-lg text-[var(--neon)]">{totalAttempts}</p>
                  <p className="text-[10px] text-[var(--ink-faint)]">Wrong Answers</p>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--bg-card)] p-3">
                  <p className="font-mono text-lg text-[var(--neon)]">{score.hintsUsed}</p>
                  <p className="text-[10px] text-[var(--ink-faint)]">Hints Used</p>
                </div>
                <div className="rounded-lg border border-[var(--hairline)] bg-[var(--bg-card)] p-3">
                  <p className="font-mono text-lg text-[var(--neon)]">
                    {score.secretsFound.length}/4
                  </p>
                  <p className="text-[10px] text-[var(--ink-faint)]">Secrets</p>
                </div>
              </div>

              {score.bestTime !== null && score.completions > 1 && (
                <p className="text-xs text-[var(--ink-faint)] font-mono">
                  Best time: {formatTime(score.bestTime)} ({score.completions} completions)
                </p>
              )}

              {hasPrelodeSecret && (
                <p className="text-xs text-[var(--neon-deep)] italic animate-fade-in">
                  You noticed the word before it was spoken. The monument saw that.
                </p>
              )}

              {/* Share button */}
              <button
                onClick={handleCopy}
                className="font-mono text-[10px] text-[var(--ink-faint)] transition hover:text-[var(--neon)] underline underline-offset-2"
              >
                {copied ? "Copied!" : "Copy results to clipboard"}
              </button>
            </div>
          )}

          {/* $PRELODE reveal */}
          {showPrelode && (
            <div className="animate-fade-in space-y-6">
              <div className="rounded-xl border border-[var(--hairline-strong)] bg-[var(--bg-card)] p-6">
                <p
                  className={`${df} text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)] mb-3`}
                >
                  The monument&apos;s power source
                </p>
                <p className="font-mono text-2xl text-[var(--neon)] text-glow mb-3">$PRELODE</p>
                <p className="text-sm text-[var(--ink-soft)] mb-5 leading-relaxed">
                  Every monument must be preloded before it can stand. This is the energy that was
                  here before you arrived — and will remain long after.
                </p>
                <a
                  href={DEXSCREENER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-neon ${df} text-xs`}
                >
                  View $PRELODE
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://x.com/monolith774"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-outline ${df} text-xs`}
                >
                  Follow on X
                </a>
                <a href="/" className={`btn-outline ${df} text-xs`}>
                  Return to surface
                </a>
              </div>

              {/* Secret void entrance */}
              {voidUnlocked && (
                <div className="mt-4 animate-fade-in">
                  <button
                    onClick={onVoidEnter}
                    className="font-mono text-xs text-purple-400/60 transition hover:text-purple-300 animate-pulse"
                  >
                    The void calls to you...
                  </button>
                </div>
              )}

              {/* Replay incentive */}
              {score.secretsFound.length < 4 && (
                <p className="text-[10px] text-[var(--ink-faint)] font-mono">
                  {4 - score.secretsFound.length} secret
                  {4 - score.secretsFound.length > 1 ? "s" : ""} remain hidden in the monument.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
