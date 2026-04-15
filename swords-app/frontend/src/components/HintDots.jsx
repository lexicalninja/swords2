import s from "./HintDots.module.css";

export function HintDots({ level, total = 4 }) {
  return (
    <div className={s.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={s.dot} data-used={i < level ? "true" : "false"} />
      ))}
    </div>
  );
}
