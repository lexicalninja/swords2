import { describe, it, expect } from "vitest";
import { getDailyPuzzles } from "../lib/dailyPuzzles.js";

// Pool with several entries at each difficulty
const pool = [
  { id: 1,  inner_word: "cat",     outer_word: "cats",         start_index: 0 },
  { id: 2,  inner_word: "rose",    outer_word: "kerosene",     start_index: 2 },
  { id: 3,  inner_word: "gnat",    outer_word: "stagnated",    start_index: 3 },
  { id: 4,  inner_word: "iron",    outer_word: "environments", start_index: 3 },
  { id: 5,  inner_word: "lack",    outer_word: "blackened",    start_index: 1 },
  { id: 6,  inner_word: "laugh",   outer_word: "slaughter",    start_index: 1 },
  { id: 7,  inner_word: "earth",   outer_word: "unearths",     start_index: 2 },
  { id: 8,  inner_word: "total",   outer_word: "teetotalers",  start_index: 3 },
  { id: 9,  inner_word: "fresh",   outer_word: "refreshed",    start_index: 2 },
  { id: 10, inner_word: "stall",   outer_word: "installed",    start_index: 2 },
  { id: 11, inner_word: "compass", outer_word: "encompassing", start_index: 2 },
  { id: 12, inner_word: "ripple",  outer_word: "cripples",     start_index: 1 },
  { id: 13, inner_word: "hasten",  outer_word: "chastens",     start_index: 1 },
  { id: 14, inner_word: "diction", outer_word: "addictions",   start_index: 2 },
];

describe("getDailyPuzzles", () => {
  it("returns exactly 3 puzzles", () => {
    expect(getDailyPuzzles(pool)).toHaveLength(3);
  });

  it("returns easy, medium, hard — in that order", () => {
    const [e, m, h] = getDailyPuzzles(pool);
    expect(e.inner_word.length).toBeLessThanOrEqual(4);
    expect(m.inner_word.length).toBe(5);
    expect(h.inner_word.length).toBeGreaterThanOrEqual(6);
  });

  it("is deterministic — same date always yields same 3 puzzles", () => {
    const date = new Date("2026-04-06");
    expect(getDailyPuzzles(pool, date)).toEqual(getDailyPuzzles(pool, date));
  });

  it("different dates yield different selections", () => {
    const d1 = getDailyPuzzles(pool, new Date("2026-04-06"));
    const d2 = getDailyPuzzles(pool, new Date("2026-04-07"));
    expect(d1).not.toEqual(d2);
  });

  it("uses current date when none provided", () => {
    const result = getDailyPuzzles(pool);
    expect(result).toHaveLength(3);
  });

  it("does not mutate the input array", () => {
    const copy = [...pool];
    getDailyPuzzles(pool, new Date("2026-04-06"));
    expect(pool).toEqual(copy);
  });
});
