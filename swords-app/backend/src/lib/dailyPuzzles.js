// Deterministic daily puzzle selection — must stay in sync with frontend gameLogic.js

function seededShuffle(arr, seed) {
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

function getDifficulty(innerWord) {
  if (innerWord.length <= 4) return "easy";
  if (innerWord.length <= 5) return "medium";
  return "hard";
}

export function getDailyPuzzles(allPuzzles, date = new Date()) {
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate();

  const easy   = seededShuffle(allPuzzles.filter(p => getDifficulty(p.inner_word) === "easy"),   seed);
  const medium = seededShuffle(allPuzzles.filter(p => getDifficulty(p.inner_word) === "medium"), seed);
  const hard   = seededShuffle(allPuzzles.filter(p => getDifficulty(p.inner_word) === "hard"),   seed);

  return [easy[0], medium[0], hard[0]].filter(Boolean);
}
