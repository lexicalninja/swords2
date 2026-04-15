import { useState, useCallback, useEffect, useRef } from "react";
import { fetchDailyPuzzles, fetchAllPuzzles } from "../api/client.js";
import FALLBACK_PUZZLES from "../data/puzzles.js";
import { MAX_POINTS, HINT_COSTS, seededShuffle } from "../utils/gameLogic.js";
import { loadDailyProgress, saveDailyProgress } from "../utils/storage.js";

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function useGameState(mode) {
  // mode: "daily" | "endless" | null (menu)

  const [puzzles, setPuzzles]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Per-puzzle state
  const [guess, setGuess]           = useState("");
  const [guesses, setGuesses]       = useState([]);      // wrong guesses this round
  const [solved, setSolved]         = useState(false);
  const [revealed, setRevealed]     = useState(false);
  const [hintLevel, setHintLevel]   = useState(0);
  const [hintCostSoFar, setHintCostSoFar] = useState(0);
  const [shake, setShake]           = useState(false);
  const [celebration, setCelebration] = useState(false);

  // Session totals
  const [score, setScore]   = useState(0);
  const [streak, setStreak] = useState(0);

  // Completed puzzle results for share feature
  const [completedPuzzleResults, setCompletedPuzzleResults] = useState([]);

  // Guard against double-init from React StrictMode double-invoke
  const initializedRef = useRef(false);

  const puzzle = puzzles[currentIdx] ?? null;
  const pointsAvailable = MAX_POINTS - hintCostSoFar;
  const nextHintCost = hintLevel < 4 ? HINT_COSTS[hintLevel] : 0;

  // ── Load puzzles on mode change ──────────────────────────────────────────
  useEffect(() => {
    if (!mode) return;
    initializedRef.current = false;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const loader = mode === "daily" ? fetchDailyPuzzles : fetchAllPuzzles;

    loader()
      .then(data => {
        if (cancelled) return;
        const list = mode === "endless" ? shuffled(data) : data;
        setPuzzles(list);
      })
      .catch(() => {
        if (cancelled) return;
        // Fall back to static data
        const list = mode === "endless"
          ? shuffled(FALLBACK_PUZZLES)
          : FALLBACK_PUZZLES.slice(0, 3); // approximate daily set
        setPuzzles(list);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [mode]);

  // ── Restore localStorage on first puzzle load (daily only) ──────────────
  useEffect(() => {
    if (mode !== "daily" || puzzles.length === 0 || initializedRef.current) return;
    initializedRef.current = true;

    const saved = loadDailyProgress();
    if (!saved) {
      resetSession();
      return;
    }
    setScore(saved.score ?? 0);
    setStreak(saved.streak ?? 0);
    setCurrentIdx(saved.currentIdx ?? 0);
    setCompletedPuzzleResults(saved.completedPuzzleResults ?? []);
    // Restore per-puzzle state if mid-puzzle
    if (saved.puzzleState) {
      setGuesses(saved.puzzleState.guesses ?? []);
      setSolved(saved.puzzleState.solved ?? false);
      setRevealed(saved.puzzleState.revealed ?? false);
      setHintLevel(saved.puzzleState.hintLevel ?? 0);
      setHintCostSoFar(saved.puzzleState.hintCostSoFar ?? 0);
    }
  }, [mode, puzzles]);

  // ── Persist state to localStorage on changes (daily only) ───────────────
  useEffect(() => {
    if (mode !== "daily" || !initializedRef.current) return;
    saveDailyProgress({
      score, streak, currentIdx,
      completedPuzzleResults,
      puzzleState: { guesses, solved, revealed, hintLevel, hintCostSoFar },
    });
  }, [mode, score, streak, currentIdx, completedPuzzleResults, guesses, solved, revealed, hintLevel, hintCostSoFar]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  function resetPuzzle() {
    setGuess("");
    setGuesses([]);
    setSolved(false);
    setRevealed(false);
    setHintLevel(0);
    setHintCostSoFar(0);
    setShake(false);
    setCelebration(false);
  }

  function resetSession() {
    resetPuzzle();
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setCompletedPuzzleResults([]);
  }

  // ── Actions ─────────────────────────────────────────────────────────────
  const revealHint = useCallback(() => {
    if (hintLevel >= 4 || solved || revealed) return;
    setHintCostSoFar(c => c + HINT_COSTS[hintLevel]);
    setHintLevel(l => l + 1);
  }, [hintLevel, solved, revealed]);

  const submitGuess = useCallback(() => {
    if (!puzzle || solved || revealed) return;
    const g = guess.trim().toLowerCase();
    if (!g) return;

    const answer = puzzle.inner_word ?? puzzle.inner;

    if (g === answer) {
      const earned = Math.max(1, pointsAvailable);
      setSolved(true);
      setCelebration(true);
      setScore(s => s + earned);
      setStreak(s => s + 1);
      setCompletedPuzzleResults(r => [...r, { solved: true, hintsUsed: hintLevel }]);
      setTimeout(() => setCelebration(false), 1200);
    } else {
      setGuesses(prev => [...prev, g]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setGuess("");
  }, [guess, puzzle, solved, revealed, pointsAvailable, hintLevel]);

  const giveUp = useCallback(() => {
    if (!puzzle || solved || revealed) return;
    setRevealed(true);
    setStreak(0);
    setCompletedPuzzleResults(r => [...r, { solved: false, hintsUsed: hintLevel }]);
  }, [puzzle, solved, revealed, hintLevel]);

  const nextPuzzle = useCallback(() => {
    if (currentIdx + 1 < puzzles.length) {
      setCurrentIdx(i => i + 1);
      resetPuzzle();
    } else if (mode === "endless") {
      setPuzzles(shuffled(puzzles));
      setCurrentIdx(0);
      resetPuzzle();
    }
    // Caller (screen component) handles switching to results view when puzzles exhausted
  }, [currentIdx, puzzles, mode]);

  const isFinished = !loading && puzzles.length > 0 && currentIdx >= puzzles.length - 1 && (solved || revealed);

  return {
    // Data
    puzzle,
    puzzles,
    loading,
    error,
    currentIdx,
    // Per-puzzle
    guess,
    setGuess,
    guesses,
    solved,
    revealed,
    hintLevel,
    hintCostSoFar,
    pointsAvailable,
    nextHintCost,
    shake,
    celebration,
    // Session
    score,
    streak,
    completedPuzzleResults,
    isFinished,
    // Actions
    revealHint,
    submitGuess,
    giveUp,
    nextPuzzle,
    resetSession,
  };
}
