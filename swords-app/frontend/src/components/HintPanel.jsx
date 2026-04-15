import { HintDots } from "./HintDots.jsx";
import s from "./HintPanel.module.css";

const TIER_LABELS = ["Vague", "Warm", "Warmer", "Obvious"];

export function HintPanel({ hints, hintLevel, nextHintCost, onReveal, solved, revealed }) {
  return (
    <>
      {hintLevel > 0 && (
        <div className={s.hints}>
          {hints.slice(0, hintLevel).map((text, i) => (
            <div key={i} className={s.hint} data-tier={i}>
              <span className={s.label}>{TIER_LABELS[i]}</span>
              <span className={s.text}>{text}</span>
            </div>
          ))}
        </div>
      )}

      {!solved && !revealed && (
        <div className={s.btnWrapper}>
          {hintLevel < 4 ? (
            <button className={s.btn} onClick={onReveal}>
              <span>
                {hintLevel === 0 ? "Need a hint?" : "More help?"}
                <span className={s.cost}>−{nextHintCost}</span>
              </span>
              <HintDots level={hintLevel} total={4} />
            </button>
          ) : (
            <span className={s.exhausted}>All hints revealed</span>
          )}
        </div>
      )}
    </>
  );
}
