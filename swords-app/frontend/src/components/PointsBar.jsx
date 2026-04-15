import { MAX_POINTS } from "../utils/gameLogic.js";
import s from "./PointsBar.module.css";

export function PointsBar({ pointsAvailable }) {
  const pct = (pointsAvailable / MAX_POINTS) * 100;
  const level = pointsAvailable > 10 ? "high" : pointsAvailable > 5 ? "mid" : "low";

  return (
    <div className={s.wrapper}>
      <div className={s["label-row"]}>
        <span className={s.label}>Points available</span>
        <span className={s.value}>{pointsAvailable} / {MAX_POINTS}</span>
      </div>
      <div className={s.track}>
        <div className={s.fill} data-level={level} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
