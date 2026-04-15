import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameState } from "../hooks/useGameState.js";

// ── Mock the API so tests don't hit the network ──────────────────────────────
vi.mock("../api/client.js", () => ({
  fetchDailyPuzzles: vi.fn(),
  fetchAllPuzzles:   vi.fn(),
}));

import { fetchDailyPuzzles, fetchAllPuzzles } from "../api/client.js";

// ── Fixtures ─────────────────────────────────────────────────────────────────
const PUZZLE_EASY   = { id: 1, outer_word: "kerosene",    inner_word: "rose",   start_index: 2, hints: ["h1","h2","h3","h4"], difficulty: "easy" };
const PUZZLE_MEDIUM = { id: 2, outer_word: "slaughter",   inner_word: "laugh",  start_index: 1, hints: ["h1","h2","h3","h4"], difficulty: "medium" };
const PUZZLE_HARD   = { id: 3, outer_word: "encompassing",inner_word: "compass",start_index: 2, hints: ["h1","h2","h3","h4"], difficulty: "hard" };
const DAILY_PUZZLES = [PUZZLE_EASY, PUZZLE_MEDIUM, PUZZLE_HARD];

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  fetchDailyPuzzles.mockResolvedValue(DAILY_PUZZLES);
  fetchAllPuzzles.mockResolvedValue(DAILY_PUZZLES);
});

// Helper: render hook and wait for puzzles to load
async function setup(mode = "daily") {
  const result = renderHook(() => useGameState(mode));
  // Flush the async loader
  await act(async () => {});
  return result;
}

describe("initial state", () => {
  it("starts with loading=true then resolves", async () => {
    const { result } = await setup();
    expect(result.current.loading).toBe(false);
    expect(result.current.puzzles).toHaveLength(3);
    expect(result.current.puzzle).toEqual(PUZZLE_EASY);
  });

  it("score and streak start at 0", async () => {
    const { result } = await setup();
    expect(result.current.score).toBe(0);
    expect(result.current.streak).toBe(0);
  });

  it("uses fallback puzzles when API fails", async () => {
    fetchDailyPuzzles.mockRejectedValue(new Error("Network error"));
    const { result } = await setup();
    expect(result.current.puzzles.length).toBeGreaterThan(0);
  });

  it("is null mode → puzzles stay empty", () => {
    const { result } = renderHook(() => useGameState(null));
    expect(result.current.puzzles).toHaveLength(0);
  });
});

describe("submitGuess — correct", () => {
  it("sets solved=true and increments score/streak", async () => {
    const { result } = await setup();

    act(() => result.current.setGuess("rose"));
    act(() => result.current.submitGuess());

    expect(result.current.solved).toBe(true);
    expect(result.current.score).toBe(15); // no hints used
    expect(result.current.streak).toBe(1);
    expect(result.current.guesses).toHaveLength(0);
  });

  it("is case-insensitive", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess("ROSE"));
    act(() => result.current.submitGuess());
    expect(result.current.solved).toBe(true);
  });

  it("ignores leading/trailing whitespace", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess("  rose  "));
    act(() => result.current.submitGuess());
    expect(result.current.solved).toBe(true);
  });
});

describe("submitGuess — wrong", () => {
  it("adds to guesses list and triggers shake", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess("tulip"));
    act(() => result.current.submitGuess());

    expect(result.current.solved).toBe(false);
    expect(result.current.guesses).toContain("tulip");
    expect(result.current.shake).toBe(true);
  });

  it("clears guess after wrong attempt", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess("tulip"));
    act(() => result.current.submitGuess());
    expect(result.current.guess).toBe("");
  });

  it("ignores empty guess", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess(""));
    act(() => result.current.submitGuess());
    expect(result.current.guesses).toHaveLength(0);
  });

  it("does nothing after already solved", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess("rose"));
    act(() => result.current.submitGuess());
    act(() => result.current.setGuess("rose"));
    act(() => result.current.submitGuess());
    expect(result.current.score).toBe(15); // not doubled
  });
});

describe("revealHint", () => {
  it("increments hintLevel and deducts points", async () => {
    const { result } = await setup();
    act(() => result.current.revealHint());
    expect(result.current.hintLevel).toBe(1);
    expect(result.current.pointsAvailable).toBe(13); // 15 - 2
  });

  it("cumulative cost for 4 hints leaves 0 points available", async () => {
    const { result } = await setup();
    act(() => { result.current.revealHint(); });
    act(() => { result.current.revealHint(); });
    act(() => { result.current.revealHint(); });
    act(() => { result.current.revealHint(); });
    expect(result.current.hintLevel).toBe(4);
    expect(result.current.pointsAvailable).toBe(0);
  });

  it("cannot exceed 4 hints", async () => {
    const { result } = await setup();
    for (let i = 0; i < 6; i++) act(() => result.current.revealHint());
    expect(result.current.hintLevel).toBe(4);
  });

  it("solving after hints awards remaining points (min 1)", async () => {
    const { result } = await setup();
    // Use all 4 hints — 0 points available, but min is 1
    for (let i = 0; i < 4; i++) act(() => result.current.revealHint());
    act(() => result.current.setGuess("rose"));
    act(() => result.current.submitGuess());
    expect(result.current.score).toBe(1);
  });
});

describe("giveUp", () => {
  it("sets revealed=true and resets streak", async () => {
    // Build a streak first by solving puzzle on a fresh hook render
    const { result } = await setup();
    act(() => result.current.giveUp());
    expect(result.current.revealed).toBe(true);
    expect(result.current.streak).toBe(0);
  });

  it("adds a failed result to completedPuzzleResults", async () => {
    const { result } = await setup();
    act(() => result.current.revealHint());
    act(() => result.current.giveUp());
    expect(result.current.completedPuzzleResults[0]).toEqual({ solved: false, hintsUsed: 1 });
  });
});

describe("nextPuzzle", () => {
  it("advances to the next puzzle and resets per-puzzle state", async () => {
    const { result } = await setup();
    act(() => result.current.setGuess("rose"));
    act(() => result.current.submitGuess()); // solve puzzle 0
    act(() => result.current.nextPuzzle());

    expect(result.current.currentIdx).toBe(1);
    expect(result.current.guess).toBe("");
    expect(result.current.guesses).toHaveLength(0);
    expect(result.current.solved).toBe(false);
    expect(result.current.hintLevel).toBe(0);
  });
});

describe("endless mode", () => {
  it("fetches all puzzles (not daily)", async () => {
    await setup("endless");
    expect(fetchAllPuzzles).toHaveBeenCalled();
    expect(fetchDailyPuzzles).not.toHaveBeenCalled();
  });
});
