"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const STORAGE_KEY = "obelisk_monument_score";

export interface MonumentScore {
  totalTime: number;
  chamberTimes: Record<string, number>;
  attempts: Record<string, number>;
  hintsUsed: number;
  secretsFound: string[];
  completions: number;
  bestTime: number | null;
  rank: string;
}

function defaultScore(): MonumentScore {
  return {
    totalTime: 0,
    chamberTimes: {},
    attempts: {},
    hintsUsed: 0,
    secretsFound: [],
    completions: 0,
    bestTime: null,
    rank: "Pilgrim",
  };
}

function loadScore(): MonumentScore {
  if (typeof window === "undefined") return defaultScore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultScore(), ...JSON.parse(raw) };
  } catch {}
  return defaultScore();
}

function computeRank(s: MonumentScore): string {
  const totalAttempts = Object.values(s.attempts).reduce((a, b) => a + b, 0);
  const secrets = s.secretsFound.length;

  if (s.secretsFound.includes("void-solved")) return "Void Walker";
  if (s.totalTime < 120 && s.hintsUsed === 0 && secrets >= 3) return "Monument Keeper";
  if (s.totalTime < 180 && s.hintsUsed === 0 && secrets >= 2) return "Architect";
  if (s.totalTime < 300 && totalAttempts < 3) return "Seeker";
  return "Pilgrim";
}

export function useMonumentScore() {
  const [score, setScore] = useState<MonumentScore>(defaultScore);
  const startRef = useRef<number>(Date.now());
  const chamberStartRef = useRef<number>(Date.now());

  useEffect(() => {
    setScore(loadScore());
  }, []);

  const save = useCallback((s: MonumentScore) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }, []);

  const resetRun = useCallback(() => {
    startRef.current = Date.now();
    setScore((prev) => {
      const next: MonumentScore = {
        ...defaultScore(),
        completions: prev.completions,
        bestTime: prev.bestTime,
        secretsFound: prev.secretsFound,
      };
      save(next);
      return next;
    });
  }, [save]);

  const startChamberTimer = useCallback(() => {
    chamberStartRef.current = Date.now();
  }, []);

  const endChamberTimer = useCallback(
    (chamber: string) => {
      const elapsed = (Date.now() - chamberStartRef.current) / 1000;
      setScore((prev) => {
        const next = {
          ...prev,
          chamberTimes: { ...prev.chamberTimes, [chamber]: elapsed },
        };
        save(next);
        return next;
      });
    },
    [save],
  );

  const recordAttempt = useCallback(
    (chamber: string) => {
      setScore((prev) => {
        const next = {
          ...prev,
          attempts: {
            ...prev.attempts,
            [chamber]: (prev.attempts[chamber] || 0) + 1,
          },
        };
        save(next);
        return next;
      });
    },
    [save],
  );

  const recordHint = useCallback(() => {
    setScore((prev) => {
      const next = { ...prev, hintsUsed: prev.hintsUsed + 1 };
      save(next);
      return next;
    });
  }, [save]);

  const addSecret = useCallback(
    (id: string) => {
      setScore((prev) => {
        if (prev.secretsFound.includes(id)) return prev;
        const next = { ...prev, secretsFound: [...prev.secretsFound, id] };
        save(next);
        return next;
      });
    },
    [save],
  );

  const finishRun = useCallback(() => {
    const total = (Date.now() - startRef.current) / 1000;
    setScore((prev) => {
      const next: MonumentScore = {
        ...prev,
        totalTime: total,
        completions: prev.completions + 1,
        bestTime: prev.bestTime === null ? total : Math.min(prev.bestTime, total),
      };
      next.rank = computeRank(next);
      save(next);
      return next;
    });
  }, [save]);

  const hasSecret = useCallback(
    (id: string) => score.secretsFound.includes(id),
    [score.secretsFound],
  );

  const getElapsed = useCallback(() => {
    return (Date.now() - startRef.current) / 1000;
  }, []);

  return {
    score,
    resetRun,
    startChamberTimer,
    endChamberTimer,
    recordAttempt,
    recordHint,
    addSecret,
    finishRun,
    hasSecret,
    getElapsed,
    startRef,
  };
}
