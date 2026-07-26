"use client";

import { useState, useEffect, useCallback } from "react";
import { df, FRAGMENTS } from "./constants";

interface Props {
  onComplete: () => void;
  onError: () => void;
  onSuccess: () => void;
  onSecret: (id: string) => void;
}

export function ChamberEchoes({ onComplete, onError, onSuccess, onSecret }: Props) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [ordering, setOrdering] = useState(false);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [wrongOrder, setWrongOrder] = useState(false);

  // Fog patches — user clicks to reveal
  const fogPositions = FRAGMENTS.map((_, i) => i);

  const revealFragment = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(i);
      if (next.size === FRAGMENTS.length) {
        setTimeout(() => setOrdering(true), 800);
      }
      return next;
    });
  };

  const handlePrelodeClick = useCallback(() => {
    onSecret("preloded-word");
  }, [onSecret]);

  const addToOrder = (i: number) => {
    if (userOrder.includes(i)) return;
    const next = [...userOrder, i];
    setUserOrder(next);

    if (next.length === FRAGMENTS.length) {
      // Check if order matches 0,1,2,3,4,5,6
      const correct = next.every((v, idx) => v === idx);
      if (correct) {
        onSuccess();
        setTimeout(onComplete, 1000);
      } else {
        setWrongOrder(true);
        onError();
        setTimeout(() => {
          setUserOrder([]);
          setWrongOrder(false);
        }, 1200);
      }
    }
  };

  const removeFromOrder = (orderIdx: number) => {
    setUserOrder((prev) => prev.filter((_, i) => i !== orderIdx));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <p className={`${df} text-xs uppercase tracking-[0.3em] text-[var(--neon)] mb-4`}>
        Depth: -1
      </p>
      <h2 className={`${df} text-2xl sm:text-4xl text-[var(--ink)] mb-4`}>The Hall of Echoes</h2>

      {!ordering ? (
        <>
          <p className="text-sm text-[var(--ink-soft)] max-w-md mb-10 leading-relaxed">
            Ancient words hide behind a veil of fog. Touch each patch to reveal what the monument
            remembers.
          </p>
          <div className="grid gap-3 max-w-lg w-full">
            {fogPositions.map((i) => (
              <div key={i} className="relative">
                {revealed.has(i) ? (
                  <p className="text-base sm:text-lg italic text-[var(--ink-soft)] animate-fade-in py-3 px-4 rounded-xl border border-[var(--hairline)] bg-[var(--bg-card)]">
                    &ldquo;
                    {i === FRAGMENTS.length - 1 ? (
                      <>
                        Every monument must be{" "}
                        <span
                          onClick={handlePrelodeClick}
                          className="cursor-pointer"
                          style={{ letterSpacing: "0.08em" }}
                        >
                          preloded
                        </span>{" "}
                        before it can stand.
                      </>
                    ) : (
                      FRAGMENTS[i]
                    )}
                    &rdquo;
                  </p>
                ) : (
                  <button
                    onClick={() => revealFragment(i)}
                    className="w-full py-4 px-4 rounded-xl border border-[var(--hairline)] bg-[var(--bg-elevated)] cursor-pointer transition hover:border-[var(--neon)] hover:bg-[var(--neon-dim)] group"
                    style={{
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span className="text-sm text-[var(--ink-faint)] group-hover:text-[var(--neon)] font-mono">
                      ░░░ Touch to reveal ░░░
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className={`mt-6 ${df} text-xs text-[var(--ink-faint)]`}>
            {revealed.size}/{FRAGMENTS.length} echoes uncovered
          </p>
        </>
      ) : (
        <div className="animate-fade-in max-w-lg w-full">
          <p className="text-sm text-[var(--ink-soft)] max-w-md mx-auto mb-6 leading-relaxed">
            The echoes are scattered. Arrange them in the correct order — as the monument intended.
          </p>

          {/* Current ordering */}
          <div className="space-y-2 mb-6 min-h-[200px]">
            {userOrder.map((fragIdx, orderIdx) => (
              <button
                key={orderIdx}
                onClick={() => removeFromOrder(orderIdx)}
                className={`w-full text-left py-2 px-4 rounded-lg border text-sm italic transition ${
                  wrongOrder
                    ? "border-red-500/40 bg-red-500/5 text-red-400"
                    : "border-[var(--neon)]/30 bg-[var(--neon-dim)] text-[var(--ink-soft)] hover:border-red-400/40"
                }`}
              >
                <span className="font-mono text-[10px] text-[var(--ink-faint)] mr-2">
                  {orderIdx + 1}.
                </span>
                &ldquo;{FRAGMENTS[fragIdx]}&rdquo;
              </button>
            ))}
            {userOrder.length < FRAGMENTS.length && (
              <div className="py-2 px-4 rounded-lg border border-dashed border-[var(--hairline)] text-xs text-[var(--ink-faint)]">
                Tap a fragment below to place it here...
              </div>
            )}
          </div>

          {/* Available fragments */}
          <p className={`${df} text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] mb-3`}>
            Available fragments
          </p>
          <div className="space-y-2">
            {FRAGMENTS.map((f, i) => {
              if (userOrder.includes(i)) return null;
              return (
                <button
                  key={i}
                  onClick={() => addToOrder(i)}
                  className="w-full text-left py-2 px-4 rounded-lg border border-[var(--hairline)] bg-[var(--bg-card)] text-sm italic text-[var(--ink-soft)] transition hover:border-[var(--neon)] hover:bg-[var(--neon-dim)] cursor-pointer"
                >
                  &ldquo;{f}&rdquo;
                </button>
              );
            })}
          </div>

          {wrongOrder && (
            <p className={`mt-4 ${df} text-xs text-red-400 animate-fade-in`}>
              The echoes resist. That is not the order they were spoken.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
