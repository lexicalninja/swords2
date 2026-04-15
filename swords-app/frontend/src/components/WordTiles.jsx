import s from "./WordTiles.module.css";

export function WordTiles({ outer, inner, start, solved, revealed, celebration }) {
  const end = start + inner.length;

  return (
    <div className={s.row}>
      {outer.split("").map((ch, i) => {
        const buried = i >= start && i < end;
        const show = solved || revealed;

        let tileClass = s.tile;
        if (!buried) {
          tileClass += ` ${s.visible}`;
        } else if (!show) {
          tileClass += ` ${s.hidden}`;
        } else if (solved) {
          tileClass += ` ${s.solved}${celebration ? ` ${s.celebrate}` : ""}`;
        } else {
          tileClass += ` ${s.failed}`;
        }

        return (
          <span key={i} className={tileClass}>
            {buried && !show ? "?" : ch}
          </span>
        );
      })}
    </div>
  );
}
