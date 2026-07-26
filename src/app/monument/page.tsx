"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  CHAMBERS,
  CHAMBER_NAMES,
  CHAMBER_GLYPHS,
  DEXSCREENER,
  df,
  type Chamber,
} from "@/components/monument/constants";
import { useMonumentScore } from "@/components/monument/useMonumentScore";
import { useAudioEngine } from "@/components/monument/useAudioEngine";
import { ParticleCanvas } from "@/components/monument/ParticleCanvas";
import { ChamberEntrance } from "@/components/monument/ChamberEntrance";
import { ChamberEchoes } from "@/components/monument/ChamberEchoes";
import { ChamberCipher } from "@/components/monument/ChamberCipher";
import { ChamberSequence } from "@/components/monument/ChamberSequence";
import { ChamberMirror } from "@/components/monument/ChamberMirror";
import { ChamberLabyrinth } from "@/components/monument/ChamberLabyrinth";
import { ChamberHeart } from "@/components/monument/ChamberHeart";
import { ChamberVoid } from "@/components/monument/ChamberVoid";

type View = Chamber | "void";

export default function MonumentPage() {
  const [view, setView] = useState<View>("entrance");
  const [transitioning, setTransitioning] = useState(false);
  const [effect, setEffect] = useState<"" | "shake" | "flash-success" | "flash-error">("");
  const [elapsed, setElapsed] = useState(0);
  const effectTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scoring = useMonumentScore();
  const audio = useAudioEngine();

  const chamber: Chamber = view === "void" ? "heart" : view;
  const depth = CHAMBERS.indexOf(chamber);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(scoring.getElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, [scoring]);

  // Konami code easter egg
  useEffect(() => {
    const seq = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
    ];
    let idx = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          scoring.addSecret("konami-code");
          triggerEffect("flash-success");
          idx = 0;
        }
      } else {
        idx = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [scoring]);

  const triggerEffect = useCallback(
    (type: "shake" | "flash-success" | "flash-error") => {
      if (effectTimerRef.current) clearTimeout(effectTimerRef.current);
      setEffect(type);
      effectTimerRef.current = setTimeout(() => setEffect(""), 500);
    },
    [],
  );

  const advance = useCallback(
    (next: View) => {
      if (next !== "void") {
        scoring.endChamberTimer(view === "void" ? "heart" : view);
      }
      setTransitioning(true);
      audio.playDescend();
      setTimeout(() => {
        setView(next);
        setTransitioning(false);
        if (next !== "void") scoring.startChamberTimer();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 600);
    },
    [audio, scoring, view],
  );

  const handleError = useCallback(() => {
    triggerEffect("shake");
    audio.playError();
    scoring.recordAttempt(view === "void" ? "void" : view);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
  }, [audio, scoring, triggerEffect, view]);

  const handleSuccess = useCallback(() => {
    triggerEffect("flash-success");
    audio.playSuccess();
  }, [audio, triggerEffect]);

  const handleSecret = useCallback(
    (id: string) => {
      scoring.addSecret(id);
      audio.playReveal();
    },
    [audio, scoring],
  );

  const handleHint = useCallback(() => {
    scoring.recordHint();
  }, [scoring]);

  const handleHeartComplete = useCallback(() => {
    scoring.endChamberTimer("heart");
    scoring.finishRun();
  }, [scoring]);

  // Init audio on first entrance click
  const handleEntranceComplete = useCallback(() => {
    audio.init();
    advance("echoes");
  }, [audio, advance]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Depth-based neon color shift (yellow -> gold)
  const neonShift = depth <= 0 ? "#c8ff00" : depth <= 2 ? "#d0f020" : depth <= 4 ? "#d8e830" : "#e0d830";

  if (view === "void") {
    return <ChamberVoid onSecret={handleSecret} onSuccess={handleSuccess} />;
  }

  return (
    <div
      className={`min-h-screen bg-[var(--bg)] text-[var(--ink)] relative overflow-hidden ${effect} ${depth >= 3 ? "vignette-deep" : ""}`}
      style={{ "--neon": neonShift } as React.CSSProperties}
    >
      {/* Background — intensifies with depth */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: "url(/images/Obelisk3.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12 + depth * 0.07,
          zIndex: 0,
        }}
      />

      {/* Particles */}
      <ParticleCanvas depth={depth} />

      {/* ── Desktop Header ── */}
      <header className="relative z-10 hidden sm:flex items-center justify-between px-10 py-5">
        <a href="/" className="flex items-center gap-2 transition hover:opacity-80">
          <Image src="/images/Obelisk1.png" alt="Obelisk" width={28} height={28} className="pulse-glow" />
          <span className={`${df} text-xs font-bold tracking-[0.2em] uppercase text-[var(--neon)]`}>
            Obelisk
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href={DEXSCREENER}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-[var(--neon)] font-bold tracking-wide transition hover:opacity-80"
          >
            $PRELODE
          </a>
          <span className="font-mono text-[10px] text-[var(--ink-faint)] tabular-nums">
            {formatTime(elapsed)}
          </span>
          <div className="flex items-center gap-1">
            {CHAMBERS.map((c, i) => (
              <div
                key={c}
                className={`rounded-md w-7 h-7 flex items-center justify-center font-mono transition-all duration-500 ${
                  i < depth
                    ? "bg-[var(--neon)]"
                    : i === depth
                      ? "bg-[var(--neon)] animate-pulse shadow-[0_0_6px_rgba(200,255,0,0.4)]"
                      : "bg-[var(--ink-faint)]/40"
                }`}
                title={CHAMBER_NAMES[c]}
              >
                <span className="text-xs text-[var(--bg)]">{i <= depth ? CHAMBER_GLYPHS[c] : ""}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => audio.setMuted(!audio.muted)}
            className="text-[var(--ink-faint)] hover:text-[var(--neon)] transition text-sm"
            title={audio.muted ? "Unmute" : "Mute"}
          >
            {audio.muted ? "🔇" : "🔊"}
          </button>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header className="relative z-10 sm:hidden px-5 pt-4 pb-2">
        {/* Logo row */}
        <div className="flex items-center justify-between mb-3">
          <a href="/" className="flex items-center gap-2 transition hover:opacity-80">
            <Image src="/images/Obelisk1.png" alt="Obelisk" width={24} height={24} className="pulse-glow" />
            <span className={`${df} text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--neon)]`}>
              Obelisk
            </span>
          </a>
          <button
            onClick={() => audio.setMuted(!audio.muted)}
            className="text-[var(--ink-faint)] hover:text-[var(--neon)] transition text-sm"
            title={audio.muted ? "Unmute" : "Mute"}
          >
            {audio.muted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* HUD bar */}
        <div className="flex items-center justify-between rounded-lg border border-[var(--hairline)] bg-[var(--bg-card)] px-4 py-2.5">
          <span className="font-mono text-xs text-[var(--ink-soft)] tabular-nums">
            {formatTime(elapsed)}
          </span>
          <div className="flex items-center gap-2">
            {CHAMBERS.map((c, i) => (
              <div
                key={c}
                className={`rounded-full w-2 h-2 transition-all duration-500 ${
                  i < depth
                    ? "bg-[var(--neon)]"
                    : i === depth
                      ? "bg-[var(--neon)] animate-pulse shadow-[0_0_6px_rgba(200,255,0,0.4)]"
                      : "bg-[var(--ink-faint)]/40"
                }`}
              />
            ))}
          </div>
          <span className={`${df} text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]`}>
            {CHAMBER_NAMES[chamber]}
          </span>
        </div>
      </header>

      {/* Chamber content */}
      <main
        className={`relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-10 sm:py-10 transition-opacity duration-500 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {view === "entrance" && (
          <ChamberEntrance
            onComplete={handleEntranceComplete}
            onError={handleError}
            onSuccess={handleSuccess}
            onSecret={handleSecret}
          />
        )}
        {view === "echoes" && (
          <ChamberEchoes
            onComplete={() => advance("cipher")}
            onError={handleError}
            onSuccess={handleSuccess}
            onSecret={handleSecret}
          />
        )}
        {view === "cipher" && (
          <ChamberCipher
            onComplete={() => advance("sequence")}
            onError={handleError}
            onSuccess={handleSuccess}
            onHint={handleHint}
          />
        )}
        {view === "sequence" && (
          <ChamberSequence
            onComplete={() => advance("mirror")}
            onError={handleError}
            onSuccess={handleSuccess}
            playPillarTone={audio.playPillarTone}
          />
        )}
        {view === "mirror" && (
          <ChamberMirror
            onComplete={() => advance("labyrinth")}
            onError={handleError}
            onSuccess={handleSuccess}
          />
        )}
        {view === "labyrinth" && (
          <ChamberLabyrinth
            onComplete={() => {
              handleHeartComplete();
              advance("heart");
            }}
            onError={handleError}
            onSuccess={handleSuccess}
            onSecret={handleSecret}
            playStep={audio.playStep}
            playWallHit={audio.playWallHit}
          />
        )}
        {view === "heart" && (
          <ChamberHeart
            score={scoring.score}
            hasPrelodeSecret={scoring.hasSecret("preloded-word")}
            voidUnlocked={scoring.hasSecret("labyrinth-glyph")}
            onVoidEnter={() => setView("void")}
          />
        )}
      </main>
    </div>
  );
}
