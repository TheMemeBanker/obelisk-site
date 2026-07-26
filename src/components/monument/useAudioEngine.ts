"use client";

import { useRef, useCallback, useState } from "react";

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const init = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
  }, []);

  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) => {
      if (muted || !ctxRef.current) return;
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    },
    [muted],
  );

  const playSuccess = useCallback(() => {
    playTone(523, 0.3, "sine", 0.12);
    setTimeout(() => playTone(659, 0.3, "sine", 0.12), 80);
    setTimeout(() => playTone(784, 0.4, "sine", 0.15), 160);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(80, 0.3, "sawtooth", 0.1);
    playTone(83, 0.3, "sawtooth", 0.1);
  }, [playTone]);

  const playDescend = useCallback(() => {
    if (muted || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  }, [muted]);

  const playReveal = useCallback(() => {
    playTone(1200, 0.5, "sine", 0.06);
    setTimeout(() => playTone(1600, 0.4, "sine", 0.04), 100);
  }, [playTone]);

  const playPillarTone = useCallback(
    (index: number) => {
      const freqs = [262, 330, 392, 523];
      playTone(freqs[index] || 262, 0.4, "triangle", 0.15);
    },
    [playTone],
  );

  const playStep = useCallback(() => {
    playTone(200, 0.08, "square", 0.04);
  }, [playTone]);

  const playWallHit = useCallback(() => {
    playTone(60, 0.15, "sawtooth", 0.08);
  }, [playTone]);

  return {
    init,
    muted,
    setMuted,
    playSuccess,
    playError,
    playDescend,
    playReveal,
    playPillarTone,
    playStep,
    playWallHit,
    playTone,
  };
}
