import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadDailyProgress, saveDailyProgress, clearDailyProgress } from "../utils/storage.js";

const FIXED_DATE = "2026-04-06";

const SAMPLE = {
  score: 30,
  streak: 2,
  currentIdx: 1,
  completedPuzzleResults: [{ solved: true, hintsUsed: 0 }],
  puzzleState: { guesses: [], solved: false, revealed: false, hintLevel: 0, hintCostSoFar: 0 },
};

beforeEach(() => {
  // Freeze the clock so "today" is deterministic.
  // Restored in afterEach so fake timers don't leak into other test files.
  vi.useFakeTimers();
  vi.setSystemTime(new Date(FIXED_DATE));
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("saveDailyProgress / loadDailyProgress", () => {
  it("round-trips data correctly", () => {
    saveDailyProgress(SAMPLE);
    const loaded = loadDailyProgress();
    expect(loaded.score).toBe(30);
    expect(loaded.streak).toBe(2);
    expect(loaded.currentIdx).toBe(1);
    expect(loaded.completedPuzzleResults).toEqual(SAMPLE.completedPuzzleResults);
  });

  it("stores today's date alongside the data", () => {
    saveDailyProgress(SAMPLE);
    const raw = JSON.parse(localStorage.getItem("swords_daily_progress"));
    expect(raw.date).toBe(FIXED_DATE);
  });

  it("returns null when nothing is saved", () => {
    expect(loadDailyProgress()).toBeNull();
  });

  it("returns null when saved data is for a different date", () => {
    localStorage.setItem(
      "swords_daily_progress",
      JSON.stringify({ ...SAMPLE, date: "2025-01-01" })
    );
    expect(loadDailyProgress()).toBeNull();
  });

  it("returns null for corrupt JSON", () => {
    localStorage.setItem("swords_daily_progress", "not-json{{");
    expect(loadDailyProgress()).toBeNull();
  });
});

describe("clearDailyProgress", () => {
  it("removes stored data", () => {
    saveDailyProgress(SAMPLE);
    clearDailyProgress();
    expect(loadDailyProgress()).toBeNull();
  });

  it("is a no-op when nothing is stored", () => {
    expect(() => clearDailyProgress()).not.toThrow();
  });
});

describe("Safari private mode (localStorage throws)", () => {
  it("save swallows the error silently", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => saveDailyProgress(SAMPLE)).not.toThrow();
  });

  it("load returns null when getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(loadDailyProgress()).toBeNull();
  });

  it("clear swallows the error silently", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(() => clearDailyProgress()).not.toThrow();
  });
});
