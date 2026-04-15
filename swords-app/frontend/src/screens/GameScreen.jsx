import { useEffect, useRef } from "react";
import { useGameState } from "../hooks/useGameState.js";
import { WordTiles } from "../components/WordTiles.jsx";
import { PointsBar } from "../components/PointsBar.jsx";
import { DifficultyBadge } from "../components/DifficultyBadge.jsx";
import { HintPanel } from "../components/HintPanel.jsx";
import s from "./GameScreen.module.css";

export function GameScreen({ mode, onFinish }) {
  const inputRef = useRef(null);
  const game = useGameState(mode);

  const {
    puzzle, puzzles, loading, error,
    currentIdx, guess, setGuess,
    guesses, solved, revealed,
    hintLevel, nextHintCost,
    pointsAvailable, shake, celebration,
    score, streak,
    revealHint, submitGuess, giveUp, nextPuzzle,
    isFinished,
  } = game;

  // Auto-focus input at round start
  useEffect(() => {
    if (!loading && puzzle && !solved && !revealed) {
      inputRef.current?.focus();
    }
  }, [currentIdx, loading, puzzle, solved, revealed]);

  // Transition to results when all done
  useEffect(() => {
    if (isFinished && mode === "daily") {
      // Small delay so player sees the final puzzle result
      const t = setTimeout(() => onFinish(game), 1200);
      return () => clearTimeout(t);
    }
  }, [isFinished, mode]);

  if (loading) return <div className={s.screen} style={{ justifyContent: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Loading…</div>;
  if (error || !puzzle) return null;

  const inner = puzzle.inner_word ?? puzzle.inner;
  const hints = Array.isArray(puzzle.hints) ? puzzle.hints : JSON.parse(puzzle.hints);

  const progressLabel = mode === "daily"
    ? `${currentIdx + 1} / ${puzzles.length}`
    : `#${currentIdx + 1}`;

  return (
    <div className={s.screen}>
      <div className={s.header}>
        <div className={s.progress}>{progressLabel}</div>
        <div className={s.stats}>
          <span className={s.score}>{score} pts</span>
          {streak > 0 && (
            <span className={streak >= 3 ? s["streak-high"] : s["streak-low"]}>
              {streak}x
            </span>
          )}
        </div>
      </div>

      <div className={`${s.card}${shake ? ` ${s.shake}` : ""}`}>
        <div className={s["card-header"]}>
          <span className={s["card-label"]}>Find the hidden word</span>
          <DifficultyBadge innerWord={inner} />
        </div>

        <div className={s["tiles-wrapper"]}>
          <WordTiles
            outer={puzzle.outer_word ?? puzzle.outer}
            inner={inner}
            start={puzzle.start_index ?? puzzle.start}
            solved={solved}
            revealed={revealed}
            celebration={celebration}
          />
        </div>

        <div className={s["bar-wrapper"]}>
          <PointsBar pointsAvailable={pointsAvailable} />
        </div>

        <HintPanel
          hints={hints}
          hintLevel={hintLevel}
          nextHintCost={nextHintCost}
          onReveal={revealHint}
          solved={solved}
          revealed={revealed}
        />

        {(solved || revealed) && hintLevel === 0 && (
          <div className={s["no-hints-msg"]}>No hints needed — full points!</div>
        )}

        {guesses.length > 0 && (
          <div className={s["wrong-guesses"]}>
            {guesses.map((g, i) => (
              <span key={i} className={s["wrong-guess"]}>{g}</span>
            ))}
          </div>
        )}

        {!solved && !revealed ? (
          <div className={s["input-row"]}>
            <input
              ref={inputRef}
              className={s.input}
              value={guess}
              onChange={e => setGuess(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              onKeyDown={e => e.key === "Enter" && submitGuess()}
              placeholder="Type your guess…"
            />
            <button className={s["submit-btn"]} onClick={submitGuess}>Go</button>
          </div>
        ) : (
          <div className={s.result}>
            <div className={s["result-msg"]} data-outcome={solved ? "solved" : "failed"}>
              {solved
                ? `Found it! +${Math.max(1, pointsAvailable)} pts`
                : `The answer was "${inner}"`
              }
            </div>
            <button className={s["next-btn"]} onClick={nextPuzzle}>
              {currentIdx + 1 < puzzles.length || mode === "endless" ? "Next →" : "See Results"}
            </button>
          </div>
        )}

        {!solved && !revealed && guesses.length >= 2 && (
          <button className={s["give-up-btn"]} onClick={giveUp}>Give up</button>
        )}
      </div>
    </div>
  );
}
