import { describe, it, expect } from "vitest";
import {
  getDifficulty,
  seededShuffle,
  getDailyPuzzles,
  computeShareEmoji,
  formatShareText,
  MAX_POINTS,
  HINT_COSTS,
} from "../utils/gameLogic.js";

// Minimal puzzle fixtures for single-puzzle tests
const EASY_PUZZLE   = { inner: "rose",    outer: "kerosene",    start: 2 };
const MEDIUM_PUZZLE = { inner: "laugh",   outer: "slaughter",   start: 1 };
const HARD_PUZZLE   = { inner: "compass", outer: "encompassing",start: 2 };

// Larger pool used by getDailyPuzzles tests (8 per tier → dates reliably diverge)
const LARGE_POOL = [
  // easy (≤4 letters)
  { inner: "rose",  outer: "kerosene",     start: 2 },
  { inner: "gnat",  outer: "stagnated",    start: 3 },
  { inner: "iron",  outer: "environments", start: 3 },
  { inner: "lack",  outer: "blackened",    start: 1 },
  { inner: "flat",  outer: "deflation",    start: 2 },
  { inner: "dent",  outer: "identical",    start: 1 },
  { inner: "know",  outer: "acknowledge",  start: 2 },
  { inner: "hand",  outer: "manhandling",  start: 3 },
  // medium (5 letters)
  { inner: "laugh",  outer: "slaughter",   start: 1 },
  { inner: "earth",  outer: "unearths",    start: 2 },
  { inner: "total",  outer: "teetotalers", start: 3 },
  { inner: "fresh",  outer: "refreshed",   start: 2 },
  { inner: "stall",  outer: "installed",   start: 2 },
  { inner: "offer",  outer: "proffers",    start: 2 },
  { inner: "place",  outer: "displacement",start: 3 },
  { inner: "track",  outer: "sidetracked", start: 4 },
  // hard (≥6 letters)
  { inner: "compass", outer: "encompassing",start: 2 },
  { inner: "ripple",  outer: "cripples",    start: 1 },
  { inner: "hasten",  outer: "chastens",    start: 1 },
  { inner: "diction", outer: "addictions",  start: 2 },
  { inner: "interest",outer: "uninterested",start: 2 },
  { inner: "resident",outer: "presidents",  start: 1 },
  { inner: "phrase",  outer: "paraphrased", start: 4 },
  { inner: "stress",  outer: "distressing", start: 2 },
];

describe("constants", () => {
  it("MAX_POINTS is 15", () => expect(MAX_POINTS).toBe(15));
  it("HINT_COSTS sums to 15", () => expect(HINT_COSTS.reduce((a, b) => a + b, 0)).toBe(15));
});

describe("getDifficulty", () => {
  it("3-letter inner → easy",  () => expect(getDifficulty("cat")).toBe("easy"));
  it("4-letter inner → easy",  () => expect(getDifficulty("rose")).toBe("easy"));
  it("5-letter inner → medium",() => expect(getDifficulty("laugh")).toBe("medium"));
  it("6-letter inner → hard",  () => expect(getDifficulty("ripple")).toBe("hard"));
  it("8-letter inner → hard",  () => expect(getDifficulty("resident")).toBe("hard"));
});

describe("seededShuffle", () => {
  it("returns a new array of the same length", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = seededShuffle(arr, 12345);
    expect(result).toHaveLength(arr.length);
    expect(result).not.toBe(arr); // new reference
  });

  it("contains the same elements", () => {
    const arr = ["a", "b", "c", "d"];
    const result = seededShuffle(arr, 42);
    expect(result.sort()).toEqual([...arr].sort());
  });

  it("is deterministic — same seed produces same order", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(seededShuffle(arr, 9999)).toEqual(seededShuffle(arr, 9999));
  });

  it("different seeds produce different orders (for non-trivial arrays)", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(seededShuffle(arr, 1)).not.toEqual(seededShuffle(arr, 2));
  });

  it("handles a single-element array", () => {
    expect(seededShuffle([42], 1)).toEqual([42]);
  });

  it("handles an empty array", () => {
    expect(seededShuffle([], 1)).toEqual([]);
  });
});

describe("getDailyPuzzles", () => {
  it("returns exactly 3 puzzles", () => {
    expect(getDailyPuzzles(LARGE_POOL)).toHaveLength(3);
  });

  it("returns one of each difficulty", () => {
    const [e, m, h] = getDailyPuzzles(LARGE_POOL);
    expect(getDifficulty(e.inner)).toBe("easy");
    expect(getDifficulty(m.inner)).toBe("medium");
    expect(getDifficulty(h.inner)).toBe("hard");
  });

  it("is deterministic — same date returns same puzzles", () => {
    // Use plain date-like objects to avoid fake-timer / timezone interference
    const date = { getFullYear: () => 2026, getMonth: () => 3, getDate: () => 6 };
    expect(getDailyPuzzles(LARGE_POOL, date)).toEqual(getDailyPuzzles(LARGE_POOL, date));
  });

  it("returns different puzzles on different dates", () => {
    // Verified empirically: seeds 20260406 and 20260407 produce different shuffles
    const apr6 = { getFullYear: () => 2026, getMonth: () => 3, getDate: () => 6 };
    const apr7 = { getFullYear: () => 2026, getMonth: () => 3, getDate: () => 7 };
    expect(getDailyPuzzles(LARGE_POOL, apr6)).not.toEqual(getDailyPuzzles(LARGE_POOL, apr7));
  });

  it("falls back gracefully when a tier has only one puzzle", () => {
    const tinyPool = [
      { inner: "rose",   outer: "kerosene", start: 2 },
      { inner: "laugh",  outer: "slaughter",start: 1 },
      { inner: "ripple", outer: "cripples", start: 1 },
    ];
    expect(getDailyPuzzles(tinyPool)).toHaveLength(3);
  });
});

describe("computeShareEmoji", () => {
  it("0 hints solved → ⬜✅", () => expect(computeShareEmoji(0, true)).toBe("⬜✅"));
  it("1 hint solved  → 🟨✅", () => expect(computeShareEmoji(1, true)).toBe("🟨✅"));
  it("2 hints solved → 🟧✅", () => expect(computeShareEmoji(2, true)).toBe("🟧✅"));
  it("3 hints solved → 🟥✅", () => expect(computeShareEmoji(3, true)).toBe("🟥✅"));
  it("4 hints solved → 🟥✅ (capped)", () => expect(computeShareEmoji(4, true)).toBe("🟥✅"));
  it("0 hints failed → ⬜❌", () => expect(computeShareEmoji(0, false)).toBe("⬜❌"));
  it("2 hints failed → 🟧❌", () => expect(computeShareEmoji(2, false)).toBe("🟧❌"));
});

describe("formatShareText", () => {
  const date = new Date("2026-04-06");
  const results = [
    { solved: true,  hintsUsed: 0 },
    { solved: true,  hintsUsed: 2 },
    { solved: false, hintsUsed: 1 },
  ];

  it("includes the date", () => {
    expect(formatShareText(results, date)).toContain("2026-04-06");
  });

  it("includes sWORDs header", () => {
    expect(formatShareText(results, date)).toContain("sWORDs");
  });

  it("has one line per puzzle", () => {
    const lines = formatShareText(results, date).split("\n");
    expect(lines.filter(l => l.startsWith("Puzzle"))).toHaveLength(3);
  });

  it("correct emojis per result", () => {
    const text = formatShareText(results, date);
    expect(text).toContain("⬜✅"); // puzzle 1: 0 hints, solved
    expect(text).toContain("🟧✅"); // puzzle 2: 2 hints, solved
    expect(text).toContain("🟨❌"); // puzzle 3: 1 hint, failed
  });
});
