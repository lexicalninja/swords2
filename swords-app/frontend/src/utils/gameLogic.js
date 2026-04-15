export const MAX_POINTS = 15;
export const HINT_COSTS = [2, 3, 4, 6]; // cost of each successive hint

export function getDifficulty(innerWord) {
  if (innerWord.length <= 4) return "easy";
  if (innerWord.length <= 5) return "medium";
  return "hard";
}

// LCG-based shuffle — deterministic given the same seed.
export function seededShuffle(arr, seed) {
  const shuffled = [...arr];
  let m = shuffled.length;
  let s = seed;
  while (m) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const i = s % m--;
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }
  return shuffled;
}

export function getDailyPuzzles(allPuzzles, date = new Date()) {
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate();

  const easy   = seededShuffle(allPuzzles.filter(p => getDifficulty(p.inner_word ?? p.inner) === "easy"),   seed);
  const medium = seededShuffle(allPuzzles.filter(p => getDifficulty(p.inner_word ?? p.inner) === "medium"), seed);
  const hard   = seededShuffle(allPuzzles.filter(p => getDifficulty(p.inner_word ?? p.inner) === "hard"),   seed);

  return [easy[0], medium[0], hard[0]].filter(Boolean);
}

// Build a spoiler-free share string (Wordle-style).
// hintsUsed: number of hints revealed; solved: boolean
export function computeShareEmoji(hintsUsed, solved) {
  const hint = ["⬜", "🟨", "🟧", "🟥"][Math.min(hintsUsed, 3)];
  return solved ? hint + "✅" : hint + "❌";
}

export function formatShareText(results, date) {
  const dateStr = date.toISOString().slice(0, 10);
  const lines = results.map(
    (r, i) => `Puzzle ${i + 1}: ${computeShareEmoji(r.hintsUsed, r.solved)}`
  );
  return `sWORDs ${dateStr}\n${lines.join("\n")}`;
}
