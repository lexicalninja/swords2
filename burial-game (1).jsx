import { useState, useEffect, useCallback, useRef } from "react";

// Each puzzle has 4 hints: vague → obvious. Costs escalate: 2, 3, 4, 6
const PUZZLES = [
  { outer: "slaughter", inner: "laugh", start: 1, hints: [
    "Something joyful hides here", "A sound you make when amused", "Rhymes with 'calf'", "Express amusement out loud"
  ]},
  { outer: "encompassing", inner: "compass", start: 2, hints: [
    "It helps you find your way", "Used for navigation", "Has a needle that points north", "_ _ M P A S S"
  ]},
  { outer: "intoxicate", inner: "toxic", start: 2, hints: [
    "Something dangerous", "Related to poison", "5 letters, means harmful", "_ O X I _"
  ]},
  { outer: "sweepstake", inner: "weeps", start: 1, hints: [
    "An emotional reaction", "Involves tears", "What someone does when very sad", "_ E E P S"
  ]},
  { outer: "acquaintance", inner: "quaint", start: 2, hints: [
    "A positive adjective", "Describes a charming cottage", "Old-fashioned in an appealing way", "_ U A I N _"
  ]},
  { outer: "demoralizing", inner: "moral", start: 2, hints: [
    "Related to right and wrong", "A lesson from a fable", "Ethics, principles", "_ O R A _"
  ]},
  { outer: "displacement", inner: "place", start: 3, hints: [
    "Could be anywhere", "A location or spot", "5 letters", "_ L A C _"
  ]},
  { outer: "uninterested", inner: "interest", start: 2, hints: [
    "Banks charge this", "Curiosity or a rate", "8 letters — a long one!", "Starts with I, ends with T"
  ]},
  { outer: "acknowledge", inner: "know", start: 2, hints: [
    "Related to understanding", "Very common 4-letter word", "The opposite of ignorance", "_ N O _"
  ]},
  { outer: "presidents", inner: "resident", start: 1, hints: [
    "Someone who lives somewhere", "An occupant or inhabitant", "8 letters long", "Starts with R"
  ]},
  { outer: "kerosene", inner: "rose", start: 2, hints: [
    "Found in a garden", "A classic romantic gift", "A type of flower", "_ O S _"
  ]},
  { outer: "chambers", inner: "amber", start: 2, hints: [
    "Think of color or gemstones", "A warm golden hue", "Fossilized tree resin", "_ M B E _"
  ]},
  { outer: "stagnated", inner: "gnat", start: 3, hints: [
    "A tiny creature", "Buzzes around your face in summer", "A small flying insect", "_ N A _"
  ]},
  { outer: "factorial", inner: "actor", start: 1, hints: [
    "Works in entertainment", "Seen on stage or screen", "Plays a role", "_ C T O _"
  ]},
  { outer: "lotteries", inner: "otter", start: 1, hints: [
    "An adorable animal", "Loves to swim and play", "Holds hands while sleeping", "_ T T E _"
  ]},
  { outer: "overheard", inner: "hear", start: 4, hints: [
    "One of the five senses", "Done with your ears", "4 letters", "_ E A _"
  ]},
  { outer: "sidetracked", inner: "track", start: 4, hints: [
    "Found at a train station", "A path or course", "Athletes run on one", "_ R A C _"
  ]},
  { outer: "paraphrased", inner: "phrase", start: 4, hints: [
    "A unit of language", "A group of words", "Shorter than a sentence", "_ H R A S _"
  ]},
  { outer: "frankfurter", inner: "rank", start: 1, hints: [
    "Related to order or position", "Military people have one", "Rhymes with 'bank'", "_ A N _"
  ]},
  { outer: "cripples", inner: "ripple", start: 1, hints: [
    "Seen on water", "A small wave or disturbance", "Drop a stone in a pond", "_ I P P L _"
  ]},
  { outer: "unearths", inner: "earth", start: 2, hints: [
    "Beneath your feet", "The third planet", "Soil or our world", "_ A R T _"
  ]},
  { outer: "teetotalers", inner: "total", start: 3, hints: [
    "Related to numbers", "A complete sum", "Add everything up", "_ O T A _"
  ]},
  { outer: "courageously", inner: "rage", start: 3, hints: [
    "A powerful emotion", "More intense than anger", "4 letters, fiery", "_ A G _"
  ]},
  { outer: "porpoises", inner: "poise", start: 3, hints: [
    "A quality of elegance", "Grace under pressure", "Balance and composure", "_ O I S _"
  ]},
  { outer: "installed", inner: "stall", start: 2, hints: [
    "Can mean to delay", "Found in a barn or market", "A booth or compartment", "_ T A L _"
  ]},
  { outer: "debunking", inner: "bunk", start: 2, hints: [
    "Can be a type of bed", "Also means nonsense", "4 letters", "_ U N _"
  ]},
  { outer: "proffers", inner: "offer", start: 2, hints: [
    "Something you might accept", "A proposal or deal", "To present something", "_ F F E _"
  ]},
  { outer: "refreshed", inner: "fresh", start: 2, hints: [
    "The opposite of stale", "Newly made or clean", "5 letters", "_ R E S _"
  ]},
  { outer: "distressing", inner: "stress", start: 2, hints: [
    "A modern epidemic", "Pressure or tension", "What deadlines cause", "_ T R E S _"
  ]},
  { outer: "sustained", inner: "stain", start: 2, hints: [
    "Hard to remove from clothes", "A mark or blemish", "Wine makes a red one", "_ T A I _"
  ]},
  { outer: "pinpointed", inner: "point", start: 3, hints: [
    "A sharp end", "A score in a game", "Can mean a location", "_ O I N _"
  ]},
  { outer: "environments", inner: "iron", start: 3, hints: [
    "A metal element", "Used to press clothes", "Strong as ___", "_ R O _"
  ]},
  { outer: "blackened", inner: "lack", start: 1, hints: [
    "An absence", "To be without", "4 letters, means deficit", "_ A C _"
  ]},
  { outer: "chastens", inner: "hasten", start: 1, hints: [
    "To do something quickly", "Speed up!", "Means to hurry", "_ A S T E _"
  ]},
  { outer: "addictions", inner: "diction", start: 2, hints: [
    "Related to speech", "How you pronounce words", "Style of speaking", "_ I C T I O _"
  ]},
  { outer: "deflation", inner: "flat", start: 2, hints: [
    "Level, no bumps", "Like a pancake", "The opposite of hilly", "_ L A _"
  ]},
  { outer: "identical", inner: "dent", start: 1, hints: [
    "Damage to a car", "A small depression", "What a fender bender leaves", "_ E N _"
  ]},
  { outer: "gravelling", inner: "ravel", start: 1, hints: [
    "To untangle or come apart", "The opposite of knitting together", "5 letters", "_ A V E _"
  ]},
  { outer: "equipping", inner: "quip", start: 1, hints: [
    "A type of humor", "A clever one-liner", "A witty remark", "_ U I _"
  ]},
  { outer: "manhandling", inner: "hand", start: 3, hints: [
    "At the end of your arm", "You wave with it", "Has five fingers", "_ A N _"
  ]},
];

const MAX_POINTS = 15;
const HINT_COSTS = [2, 3, 4, 6];

function seededShuffle(arr, seed) {
  let shuffled = [...arr], m = shuffled.length, t, i, s = seed;
  while (m) { s = (s * 1103515245 + 12345) & 0x7fffffff; i = s % m--; t = shuffled[m]; shuffled[m] = shuffled[i]; shuffled[i] = t; }
  return shuffled;
}

function getDailyPuzzles() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const easy = seededShuffle(PUZZLES.filter(p => p.inner.length <= 4), seed);
  const medium = seededShuffle(PUZZLES.filter(p => p.inner.length === 5), seed);
  const hard = seededShuffle(PUZZLES.filter(p => p.inner.length >= 6), seed);
  return [easy[0], medium[0], hard[0]];
}

function getDifficulty(inner) {
  if (inner.length <= 4) return "easy";
  if (inner.length <= 5) return "medium";
  return "hard";
}

function DifficultyBadge({ inner }) {
  const d = getDifficulty(inner);
  const colors = { easy: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" }, medium: { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" }, hard: { bg: "#fce4ec", color: "#c62828", border: "#ef9a9a" } };
  const c = colors[d];
  return <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, padding: "3px 10px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: "'DM Mono', monospace" }}>{d}</span>;
}

function HintDots({ level, total }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: i < level ? "#c9b99a" : "#2a2a4a",
          border: `1px solid ${i < level ? "#c9b99a" : "#3a3a5e"}`,
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

export default function BurialGame() {
  const [mode, setMode] = useState("menu");
  const [puzzles, setPuzzles] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintCostSoFar, setHintCostSoFar] = useState(0);
  const [shake, setShake] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const inputRef = useRef(null);

  const puzzle = puzzles[currentIdx];
  const pointsAvailable = MAX_POINTS - hintCostSoFar;
  const nextHintCost = hintLevel < 4 ? HINT_COSTS[hintLevel] : 0;

  const startDaily = () => { setPuzzles(getDailyPuzzles()); setCurrentIdx(0); reset(); setScore(0); setStreak(0); setMode("daily"); };
  const startEndless = () => { setPuzzles([...PUZZLES].sort(() => Math.random() - 0.5)); setCurrentIdx(0); reset(); setScore(0); setStreak(0); setMode("endless"); };
  const reset = () => { setGuess(""); setGuesses([]); setSolved(false); setRevealed(false); setHintLevel(0); setHintCostSoFar(0); setShake(false); setCelebration(false); };

  const revealHint = () => {
    if (hintLevel >= 4 || solved || revealed) return;
    setHintCostSoFar(p => p + HINT_COSTS[hintLevel]);
    setHintLevel(p => p + 1);
  };

  const handleSubmit = useCallback(() => {
    if (!puzzle || solved || revealed) return;
    const g = guess.trim().toLowerCase();
    if (!g) return;
    if (g === puzzle.inner) {
      setSolved(true); setCelebration(true);
      setScore(s => s + Math.max(1, pointsAvailable));
      setStreak(s => s + 1);
      setTimeout(() => setCelebration(false), 1200);
    } else {
      setGuesses(prev => [...prev, g]);
      setShake(true); setTimeout(() => setShake(false), 500);
    }
    setGuess("");
  }, [guess, puzzle, solved, revealed, pointsAvailable]);

  const handleNext = () => {
    if (currentIdx + 1 < puzzles.length) { setCurrentIdx(i => i + 1); reset(); }
    else if (mode === "endless") { setPuzzles([...PUZZLES].sort(() => Math.random() - 0.5)); setCurrentIdx(0); reset(); }
    else setMode("results");
  };

  useEffect(() => { if (mode !== "menu" && mode !== "results" && inputRef.current) inputRef.current.focus(); }, [currentIdx, mode]);

  const renderWord = () => {
    if (!puzzle) return null;
    const { outer, inner, start } = puzzle;
    const end = start + inner.length;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {outer.split("").map((ch, i) => {
          const buried = i >= start && i < end;
          const show = solved || revealed;
          return (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 38, height: 46, margin: 2, borderRadius: 6,
              fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase", letterSpacing: 1,
              background: buried ? (show ? (solved ? "#c8e6c9" : "#ffcdd2") : "#1a1a2e") : "#f5f5f0",
              color: buried ? (show ? (solved ? "#1b5e20" : "#b71c1c") : "#7c7c8a") : "#1a1a2e",
              border: buried ? `2px solid ${show ? (solved ? "#66bb6a" : "#ef5350") : "#3a3a5e"}` : "2px solid #ddd",
              transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
              transform: celebration && buried ? "scale(1.15)" : "scale(1)",
            }}>{buried ? (show ? ch : "?") : ch}</span>
          );
        })}
      </div>
    );
  };

  const base = {
    minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
    padding: "32px 16px",
    background: "linear-gradient(170deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)",
    fontFamily: "'DM Sans', sans-serif", color: "#f5f5f0",
  };

  if (mode === "menu") {
    return (
      <div style={{ ...base, justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: "#7c7c8a", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>Word Game</div>
          <h1 style={{ fontSize: 68, fontWeight: 800, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1 }}>
            <span style={{ color: "#7c7c8a" }}>s</span>
            <span style={{ background: "linear-gradient(135deg, #f5f5f0, #c9b99a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WORD</span>
            <span style={{ color: "#7c7c8a" }}>s</span>
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center", marginTop: 40 }}>
            {[["Daily 3", startDaily, "#c9b99a", "#c9b99a"], ["Endless", startEndless, "#4a4a6a", "#9a9ab0"]].map(([label, fn, border, clr]) => (
              <button key={label} onClick={fn} style={{
                width: 240, padding: "16px 0", borderRadius: 10, border: `1px solid ${border}`,
                background: "transparent", color: clr, fontSize: 16, fontWeight: 600,
                cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
                fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
              }} onMouseEnter={e => { e.target.style.background = border; e.target.style.color = "#0d0d1a"; }}
                 onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = clr; }}
              >{label}</button>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: 24, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid #2a2a4a", textAlign: "left" }}>
            <div style={{ fontSize: 13, color: "#7c7c8a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14, fontFamily: "'DM Mono', monospace" }}>How to play</div>
            <p style={{ color: "#b0b0c8", fontSize: 15, lineHeight: 1.7, margin: "0 0 12px" }}>
              A smaller word is hiding inside a bigger word. Some letters are replaced with <strong style={{ color: "#f5f5f0" }}>?</strong> marks — those missing letters spell the hidden word. Figure out what it is.
            </p>
            <p style={{ color: "#b0b0c8", fontSize: 15, lineHeight: 1.7, margin: "0 0 12px" }}>
              Stuck? You can reveal up to <strong style={{ color: "#c9b99a" }}>4 hints</strong>, each one more obvious than the last — but each one costs you points:
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {["Vague (−2)", "Warm (−3)", "Warmer (−4)", "Obvious (−6)"].map((label, i) => {
                const bg = ["#1e293b", "#2a2520", "#33271a", "#3d2010"][i];
                const clr = ["#64748b", "#a0896a", "#c9a050", "#e8943a"][i];
                return <span key={i} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: bg, color: clr, fontFamily: "'DM Mono', monospace" }}>{label}</span>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "results") {
    return (
      <div style={{ ...base, justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, letterSpacing: 4, color: "#7c7c8a", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Complete</div>
          <div style={{ fontSize: 64, fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", margin: "12px 0", color: "#c9b99a" }}>{score}</div>
          <div style={{ fontSize: 16, color: "#9a9ab0" }}>out of {puzzles.length * MAX_POINTS} possible</div>
          <button onClick={() => setMode("menu")} style={{
            marginTop: 32, padding: "14px 48px", borderRadius: 10, border: "1px solid #c9b99a",
            background: "transparent", color: "#c9b99a", fontSize: 15, fontWeight: 600,
            cursor: "pointer", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Mono', monospace"
          }}>Menu</button>
        </div>
      </div>
    );
  }

  const hintLabels = ["Vague", "Warm", "Warmer", "Obvious"];
  const hintColors = ["#64748b", "#a0896a", "#c9a050", "#e8943a"];
  const hintBgs = ["#1e293b", "#2a2520", "#33271a", "#3d2010"];

  return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}} @keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 480, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#7c7c8a", fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>
          {mode === "daily" ? `${currentIdx + 1} / ${puzzles.length}` : `#${currentIdx + 1}`}
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
          <span style={{ color: "#c9b99a" }}>{score} pts</span>
          {streak > 0 && <span style={{ color: streak >= 3 ? "#66bb6a" : "#7c7c8a" }}>{streak}x</span>}
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.03)",
        borderRadius: 16, border: "1px solid #2a2a4a", padding: "28px 24px",
        animation: shake ? "shake 0.5s" : undefined,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: "#7c7c8a", fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase" }}>Find the hidden word</span>
          {puzzle && <DifficultyBadge inner={puzzle.inner} />}
        </div>

        <div style={{ marginBottom: 24 }}>{renderWord()}</div>

        {/* Points bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#7c7c8a", fontFamily: "'DM Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>Points available</span>
            <span style={{ fontSize: 14, color: "#c9b99a", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{pointsAvailable} / {MAX_POINTS}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#1a1a2e", overflow: "hidden", border: "1px solid #2a2a4a" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              width: `${(pointsAvailable / MAX_POINTS) * 100}%`,
              background: pointsAvailable > 10 ? "#66bb6a" : pointsAvailable > 5 ? "#ffa726" : "#ef5350",
              transition: "all 0.5s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>
        </div>

        {/* Hints */}
        {puzzle && hintLevel > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {puzzle.hints.slice(0, hintLevel).map((h, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "center", padding: "8px 12px",
                borderRadius: 8, background: hintBgs[i], border: `1px solid ${hintColors[i]}22`,
                animation: "slideIn 0.4s ease",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: hintColors[i], fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", minWidth: 52 }}>{hintLabels[i]}</span>
                <span style={{ fontSize: 14, color: "#d0d0e0" }}>{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hint button */}
        {!solved && !revealed && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {hintLevel < 4 ? (
              <button onClick={revealHint} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "none", border: "1px solid #3a3a5e", borderRadius: 8,
                color: "#9a9ab0", fontSize: 13, padding: "8px 18px", cursor: "pointer",
                fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
              }}>
                <span>{hintLevel === 0 ? "Need a hint?" : "More help?"}<span style={{ color: "#ef5350", marginLeft: 6 }}>−{nextHintCost}</span></span>
                <HintDots level={hintLevel} total={4} />
              </button>
            ) : (
              <span style={{ fontSize: 12, color: "#5a5a7a", fontFamily: "'DM Mono', monospace" }}>All hints revealed</span>
            )}
          </div>
        )}

        {(solved || revealed) && hintLevel === 0 && (
          <div style={{ textAlign: "center", marginBottom: 12, fontSize: 13, color: "#66bb6a", fontFamily: "'DM Mono', monospace" }}>No hints needed — full points!</div>
        )}

        {/* Wrong guesses */}
        {guesses.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            {guesses.map((g, i) => (
              <span key={i} style={{
                fontSize: 13, padding: "4px 12px", borderRadius: 6,
                background: "rgba(239,83,80,0.1)", color: "#ef5350", border: "1px solid rgba(239,83,80,0.2)",
                fontFamily: "'DM Mono', monospace", textDecoration: "line-through",
              }}>{g}</span>
            ))}
          </div>
        )}

        {/* Input or result */}
        {!solved && !revealed ? (
          <div style={{ display: "flex", gap: 8 }}>
            <input ref={inputRef} value={guess}
              onChange={e => setGuess(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Type your guess..."
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 8,
                border: "1px solid #3a3a5e", background: "#0d0d1a", color: "#f5f5f0",
                fontSize: 16, fontFamily: "'DM Mono', monospace", outline: "none",
              }}
            />
            <button onClick={handleSubmit} style={{
              padding: "12px 24px", borderRadius: 8, border: "none",
              background: "#c9b99a", color: "#0d0d1a", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Mono', monospace",
            }}>Go</button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, marginBottom: 16, fontFamily: "'DM Mono', monospace", color: solved ? "#66bb6a" : "#ef5350" }}>
              {solved ? `Found it! +${Math.max(1, pointsAvailable)} pts` : `The answer was "${puzzle.inner}"`}
            </div>
            <button onClick={handleNext} style={{
              padding: "12px 32px", borderRadius: 8, border: "1px solid #c9b99a",
              background: "transparent", color: "#c9b99a", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 1,
            }}>{currentIdx + 1 < puzzles.length || mode === "endless" ? "Next →" : "See Results"}</button>
          </div>
        )}

        {!solved && !revealed && guesses.length >= 2 && (
          <button onClick={() => { setRevealed(true); setStreak(0); }} style={{
            display: "block", margin: "16px auto 0", background: "none", border: "none",
            color: "#5a5a7a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace",
          }}>Give up</button>
        )}
      </div>
    </div>
  );
}
