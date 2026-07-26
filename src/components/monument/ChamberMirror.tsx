"use client";

import { useState, useMemo } from "react";
import { df, GLYPH_SYMBOLS } from "./constants";

interface Props {
  onComplete: () => void;
  onError: () => void;
  onSuccess: () => void;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function ChamberMirror({ onComplete, onError, onSuccess }: Props) {
  // Daily seed so puzzle changes each day
  const seed = useMemo(() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }, []);

  const leftSide = useMemo(() => {
    const rng = seededRandom(seed);
    return Array.from({ length: 8 }, () => {
      const idx = Math.floor(rng() * GLYPH_SYMBOLS.length);
      return GLYPH_SYMBOLS[idx];
    });
  }, [seed]);

  // Mirror means row-reversed: row 0 = [left[0], left[1], left[1], left[0]], etc.
  const solution = useMemo(() => {
    const sol: string[] = [];
    for (let row = 0; row < 4; row++) {
      // Left side for this row: leftSide[row*2], leftSide[row*2+1]
      // Mirror: right side = leftSide[row*2+1], leftSide[row*2]
      sol.push(leftSide[row * 2 + 1]);
      sol.push(leftSide[row * 2]);
    }
    return sol;
  }, [leftSide]);

  const [placed, setPlaced] = useState<(string | null)[]>(Array(8).fill(null));
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [wrongCells, setWrongCells] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);

  const handleCellClick = (cellIdx: number) => {
    if (solved) return;
    if (selected) {
      setPlaced((prev) => {
        const next = [...prev];
        next[cellIdx] = selected;
        return next;
      });
      setSelected(null);
      setChecked(false);
      setWrongCells(new Set());
    } else if (placed[cellIdx]) {
      // Remove placed glyph
      setPlaced((prev) => {
        const next = [...prev];
        next[cellIdx] = null;
        return next;
      });
    }
  };

  const handleCheck = () => {
    const wrong = new Set<number>();
    placed.forEach((g, i) => {
      if (g !== solution[i]) wrong.add(i);
    });

    if (wrong.size === 0 && placed.every((g) => g !== null)) {
      setSolved(true);
      onSuccess();
      setTimeout(onComplete, 1000);
    } else {
      setWrongCells(wrong);
      setChecked(true);
      onError();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
        Depth: -4
      </p>
      <h2 className={`${df} text-2xl sm:text-4xl text-[var(--ink)] mb-4`}>The Mirror Chamber</h2>
      <p className="text-sm text-[var(--ink-soft)] max-w-md mb-8 leading-relaxed">
        A wall of glyphs stands before you, split down the middle. The right side is empty. Fill it
        so it perfectly mirrors the left.
      </p>

      {/* Grid: 4 rows x 4 cols. Left 2 cols filled, right 2 cols editable */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Array.from({ length: 16 }, (_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const isLeft = col < 2;
          const leftIdx = row * 2 + col;
          const rightIdx = row * 2 + (col - 2);

          if (isLeft) {
            return (
              <div
                key={i}
                className="w-[3.25rem] h-[3.25rem] sm:w-16 sm:h-16 rounded-lg border border-[var(--neon)]/30 bg-[var(--neon-dim)] flex items-center justify-center font-mono text-lg sm:text-xl text-[var(--neon)]"
              >
                {leftSide[leftIdx]}
              </div>
            );
          }

          // Divider at col 2
          const isWrong = checked && wrongCells.has(rightIdx);
          const isCorrect = solved || (checked && !wrongCells.has(rightIdx) && placed[rightIdx]);

          return (
            <button
              key={i}
              onClick={() => handleCellClick(rightIdx)}
              className={`w-[3.25rem] h-[3.25rem] sm:w-16 sm:h-16 rounded-lg border-2 flex items-center justify-center font-mono text-lg sm:text-xl transition-all cursor-pointer ${
                isWrong
                  ? "border-red-500 bg-red-500/10 text-red-400 shake"
                  : isCorrect
                    ? "border-[var(--neon)] bg-[var(--neon-dim)] text-[var(--neon)]"
                    : placed[rightIdx]
                      ? "border-[var(--hairline-strong)] bg-[var(--bg-card)] text-[var(--ink)]"
                      : "border-dashed border-[var(--hairline)] bg-[var(--bg-elevated)] text-[var(--ink-faint)]"
              }`}
            >
              {placed[rightIdx] || (selected ? "·" : "")}
            </button>
          );
        })}
      </div>

      {/* Mirror axis indicator */}
      <p className="text-[10px] font-mono text-[var(--ink-faint)] mb-6">
        ← left │ mirror axis │ right →
      </p>

      {/* Glyph palette */}
      {!solved && (
        <>
          <p
            className={`${df} text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] mb-3`}
          >
            {selected ? `Placing: ${selected} — tap a cell` : "Select a glyph"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-sm">
            {GLYPH_SYMBOLS.map((g) => (
              <button
                key={g}
                onClick={() => setSelected(selected === g ? null : g)}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center font-mono text-sm transition cursor-pointer ${
                  selected === g
                    ? "border-[var(--neon)] bg-[var(--neon)] text-[var(--bg)]"
                    : "border-[var(--hairline)] bg-[var(--bg-card)] text-[var(--neon)] hover:border-[var(--neon)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={handleCheck}
            disabled={placed.some((g) => g === null)}
            className="btn-neon text-xs disabled:opacity-40"
          >
            Check mirror
          </button>
        </>
      )}

      {solved && (
        <div className="animate-fade-in mt-4">
          <p className="text-sm text-[var(--neon)] mb-6">
            Perfect symmetry. The wall splits open, revealing a dark corridor.
          </p>
          <button onClick={onComplete} className={`btn-outline ${df} text-xs`}>
            Enter the corridor
          </button>
        </div>
      )}
    </div>
  );
}
