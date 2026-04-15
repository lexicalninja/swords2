import s from "./MenuScreen.module.css";

const HINT_CHIPS = ["Vague (−2)", "Warm (−3)", "Warmer (−4)", "Obvious (−6)"];

export function MenuScreen({ onStartDaily, onStartEndless }) {
  return (
    <div className={s.screen}>
      <div className={s.inner}>
        <div className={s.eyebrow}>Word Game</div>

        <h1 className={s.title}>
          <span className={s["title-muted"]}>s</span>
          <span className={s["title-main"]}>WORD</span>
          <span className={s["title-muted"]}>s</span>
        </h1>

        <div className={s.buttons}>
          <button className={`${s.btn} ${s["btn-primary"]}`} onClick={onStartDaily}>
            Daily 3
          </button>
          <button className={`${s.btn} ${s["btn-secondary"]}`} onClick={onStartEndless}>
            Endless
          </button>
        </div>

        <div className={s["how-to"]}>
          <div className={s["how-to-label"]}>How to play</div>
          <p className={s["how-to-text"]}>
            A smaller word is hiding inside a bigger word. Some letters are replaced with{" "}
            <strong>?</strong> marks — those missing letters spell the hidden word. Figure out what it is.
          </p>
          <p className={s["how-to-text"]}>
            Stuck? Reveal up to <strong>4 hints</strong>, each more obvious than the last — but each costs points:
          </p>
          <div className={s["hint-costs"]}>
            {HINT_CHIPS.map((label, i) => (
              <span key={i} className={`${s["hint-cost-chip"]} ${s[`chip-${i}`]}`}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
