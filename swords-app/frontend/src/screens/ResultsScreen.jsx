import { MAX_POINTS } from "../utils/gameLogic.js";
import { formatShareText } from "../utils/gameLogic.js";
import { ShareButton } from "../components/ShareButton.jsx";
import s from "./ResultsScreen.module.css";

const DIFFICULTY_LABELS = ["Easy", "Medium", "Hard"];

export function ResultsScreen({ mode, score, completedPuzzleResults, onMenu }) {
  const maxScore = completedPuzzleResults.length * MAX_POINTS;

  const shareText = mode === "daily"
    ? formatShareText(completedPuzzleResults, new Date())
    : null;

  return (
    <div className={s.screen}>
      <div className={s.inner}>
        <div className={s.eyebrow}>Complete</div>
        <div className={s.score}>{score}</div>
        <div className={s.of}>out of {maxScore} possible</div>

        {completedPuzzleResults.length > 0 && (
          <div className={s.breakdown}>
            {completedPuzzleResults.map((r, i) => (
              <div key={i} className={s.row}>
                <span className={s["puzzle-label"]}>
                  Puzzle {i + 1} — {DIFFICULTY_LABELS[i] ?? `#${i + 1}`}
                  {r.hintsUsed > 0 && ` · ${r.hintsUsed} hint${r.hintsUsed > 1 ? "s" : ""}`}
                </span>
                <span className={s.outcome} data-solved={r.solved ? "true" : "false"}>
                  {r.solved ? "✓ Solved" : "✗ Gave up"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={s.actions}>
          {shareText && <ShareButton text={shareText} />}
          <button className={s["menu-btn"]} onClick={onMenu}>Menu</button>
        </div>
      </div>
    </div>
  );
}
