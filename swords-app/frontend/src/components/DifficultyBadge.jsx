import { getDifficulty } from "../utils/gameLogic.js";
import s from "./DifficultyBadge.module.css";

export function DifficultyBadge({ innerWord }) {
  const difficulty = getDifficulty(innerWord);
  return (
    <span className={s.badge} data-difficulty={difficulty}>
      {difficulty}
    </span>
  );
}
