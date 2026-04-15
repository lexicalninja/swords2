import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchDailyPuzzles, fetchAllPuzzles } from "../api/client.js";

const DAILY = [{ id: 1, outer_word: "kerosene", inner_word: "rose" }];
const ALL   = [{ id: 1 }, { id: 2 }, { id: 3 }];

function makeFetch(data, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("fetchDailyPuzzles", () => {
  it("calls /api/puzzles/daily and returns JSON", async () => {
    vi.stubGlobal("fetch", makeFetch(DAILY));
    const result = await fetchDailyPuzzles();
    expect(fetch).toHaveBeenCalledWith("/api/puzzles/daily");
    expect(result).toEqual(DAILY);
  });

  it("throws when the server returns a non-OK status", async () => {
    vi.stubGlobal("fetch", makeFetch(null, 500));
    await expect(fetchDailyPuzzles()).rejects.toThrow("500");
  });
});

describe("fetchAllPuzzles", () => {
  it("calls /api/puzzles and returns JSON", async () => {
    vi.stubGlobal("fetch", makeFetch(ALL));
    const result = await fetchAllPuzzles();
    expect(fetch).toHaveBeenCalledWith("/api/puzzles");
    expect(result).toEqual(ALL);
  });

  it("throws when the server returns a non-OK status", async () => {
    vi.stubGlobal("fetch", makeFetch(null, 404));
    await expect(fetchAllPuzzles()).rejects.toThrow("404");
  });
});
