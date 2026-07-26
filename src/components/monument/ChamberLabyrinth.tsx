"use client";

import { useState, useEffect, useCallback } from "react";
import { df } from "./constants";

interface Props {
  onComplete: () => void;
  onError: () => void;
  onSuccess: () => void;
  onSecret: (id: string) => void;
  playStep: () => void;
  playWallHit: () => void;
}

// 7x7 maze: 0 = open, 1 = wall, 2 = exit, 3 = secret
const MAZE: number[][] = [
  [0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 3, 1, 0],
  [1, 1, 0, 0, 0, 0, 2],
];

const SIZE = 7;

export function ChamberLabyrinth({
  onComplete,
  onError,
  onSuccess,
  onSecret,
  playStep,
  playWallHit,
}: Props) {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [visited, setVisited] = useState<Set<string>>(new Set(["0,0"]));
  const [foundSecret, setFoundSecret] = useState(false);
  const [reached, setReached] = useState(false);
  const [secretMsg, setSecretMsg] = useState(false);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (reached) return;
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;

      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || MAZE[nr][nc] === 1) {
        playWallHit();
        onError();
        return;
      }

      playStep();
      const key = `${nr},${nc}`;
      setPos([nr, nc]);
      setVisited((prev) => new Set(prev).add(key));

      if (MAZE[nr][nc] === 3 && !foundSecret) {
        setFoundSecret(true);
        setSecretMsg(true);
        onSecret("labyrinth-glyph");
        setTimeout(() => setSecretMsg(false), 3000);
      }

      if (MAZE[nr][nc] === 2) {
        setReached(true);
        onSuccess();
      }
    },
    [pos, reached, foundSecret, playStep, playWallHit, onError, onSecret, onSuccess],
  );

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
        w: [-1, 0],
        s: [1, 0],
        a: [0, -1],
        d: [0, 1],
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        move(dir[0], dir[1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [move]);

  // Touch/swipe
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < 30) return;
      if (absDx > absDy) {
        move(0, dx > 0 ? 1 : -1);
      } else {
        move(dy > 0 ? 1 : -1, 0);
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [move]);

  // Visibility: show cells within 1.5 manhattan distance of player
  const isVisible = (r: number, c: number) => {
    const dist = Math.abs(r - pos[0]) + Math.abs(c - pos[1]);
    return dist <= 2 || visited.has(`${r},${c}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
        Depth: -5
      </p>
      <h2 className={`${df} text-2xl sm:text-4xl text-[var(--ink)] mb-4`}>The Labyrinth</h2>
      <p className="text-sm text-[var(--ink-soft)] max-w-md mb-6 leading-relaxed">
        Darkness surrounds you. Only the cells near you are visible. Find the exit — the faint glow
        in the distance.
      </p>

      {/* Maze grid */}
      <div className="grid gap-1 mb-6" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {MAZE.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = r === pos[0] && c === pos[1];
            const visible = isVisible(r, c);
            const isExit = cell === 2;
            const isSecretCell = cell === 3;

            return (
              <div
                key={`${r}-${c}`}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                  isPlayer
                    ? "bg-[var(--neon)] text-[var(--bg)] shadow-[0_0_12px_rgba(200,255,0,0.5)]"
                    : !visible
                      ? "bg-[var(--bg)]"
                      : cell === 1
                        ? "bg-[var(--ink-faint)]/30 border border-[var(--ink-faint)]/20"
                        : isExit
                          ? "bg-[var(--neon-dim)] border border-[var(--neon)]/30 shadow-[0_0_8px_rgba(200,255,0,0.2)]"
                          : isSecretCell && foundSecret
                            ? "bg-purple-900/30 border border-purple-500/30"
                            : "bg-[var(--bg-card)] border border-[var(--hairline)]"
                }`}
              >
                {isPlayer && "◉"}
                {!isPlayer && visible && isExit && (
                  <span className="text-[var(--neon)] animate-pulse">◎</span>
                )}
                {!isPlayer && visible && isSecretCell && foundSecret && (
                  <span className="text-purple-400 text-[10px]">⟡</span>
                )}
              </div>
            );
          }),
        )}
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 mb-6 sm:hidden">
        <div />
        <button onClick={() => move(-1, 0)} className="maze-arrow">
          ↑
        </button>
        <div />
        <button onClick={() => move(0, -1)} className="maze-arrow">
          ←
        </button>
        <button onClick={() => move(1, 0)} className="maze-arrow">
          ↓
        </button>
        <button onClick={() => move(0, 1)} className="maze-arrow">
          →
        </button>
      </div>

      <p className="text-[10px] font-mono text-[var(--ink-faint)] mb-4 hidden sm:block">
        Arrow keys or WASD to move
      </p>

      {secretMsg && (
        <div className="animate-fade-in rounded-xl border border-purple-500/40 bg-purple-900/20 p-4 mb-4 max-w-sm">
          <p className="text-sm text-purple-300 italic">
            &ldquo;The void remembers...&rdquo;
          </p>
          <p className="text-[10px] text-purple-400/60 font-mono mt-1">Secret discovered</p>
        </div>
      )}

      {reached && (
        <div className="animate-fade-in">
          <p className="text-sm text-[var(--neon)] mb-6">
            Light floods the exit. You emerge into the final chamber.
          </p>
          <button onClick={onComplete} className={`btn-outline ${df} text-xs`}>
            Enter the heart
          </button>
        </div>
      )}
    </div>
  );
}
