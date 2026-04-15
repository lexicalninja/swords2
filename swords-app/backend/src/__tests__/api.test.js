import { describe, it, expect, vi } from "vitest";

// ── Mock the DB client before importing the app ──────────────────────────────
// Pool has enough puzzles at each tier for getDailyPuzzles to pick from
const DB_PUZZLES = [
  // easy (≤4-letter inner)
  { id: 1,  outer_word: "kerosene",     inner_word: "rose",    start_index: 2, hints: ["h1","h2","h3","h4"], difficulty: "easy" },
  { id: 2,  outer_word: "stagnated",    inner_word: "gnat",    start_index: 3, hints: ["h1","h2","h3","h4"], difficulty: "easy" },
  { id: 3,  outer_word: "environments", inner_word: "iron",    start_index: 3, hints: ["h1","h2","h3","h4"], difficulty: "easy" },
  // medium (5-letter inner)
  { id: 4,  outer_word: "slaughter",    inner_word: "laugh",   start_index: 1, hints: ["h1","h2","h3","h4"], difficulty: "medium" },
  { id: 5,  outer_word: "unearths",     inner_word: "earth",   start_index: 2, hints: ["h1","h2","h3","h4"], difficulty: "medium" },
  { id: 6,  outer_word: "teetotalers",  inner_word: "total",   start_index: 3, hints: ["h1","h2","h3","h4"], difficulty: "medium" },
  // hard (≥6-letter inner)
  { id: 7,  outer_word: "encompassing", inner_word: "compass", start_index: 2, hints: ["h1","h2","h3","h4"], difficulty: "hard" },
  { id: 8,  outer_word: "cripples",     inner_word: "ripple",  start_index: 1, hints: ["h1","h2","h3","h4"], difficulty: "hard" },
  { id: 9,  outer_word: "chastens",     inner_word: "hasten",  start_index: 1, hints: ["h1","h2","h3","h4"], difficulty: "hard" },
];

vi.mock("../../db/client.js", () => ({
  default: Object.assign(
    vi.fn().mockImplementation(async () => DB_PUZZLES),
    { end: vi.fn() }
  ),
}));

// Import app AFTER mocking
const { default: app } = await import("../index.js");

// ── Tests ─────────────────────────────────────────────────────────────────────
describe("GET /api/health", () => {
  it("returns 200 with ok:true", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});

describe("GET /api/puzzles", () => {
  it("returns 200 with all puzzles", async () => {
    const res = await app.request("/api/puzzles");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(DB_PUZZLES.length);
  });

  it("each puzzle has required fields", async () => {
    const res = await app.request("/api/puzzles");
    const body = await res.json();
    for (const p of body) {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("outer_word");
      expect(p).toHaveProperty("inner_word");
      expect(p).toHaveProperty("start_index");
      expect(p).toHaveProperty("hints");
    }
  });
});

describe("GET /api/puzzles/daily", () => {
  it("returns 200 with exactly 3 puzzles", async () => {
    const res = await app.request("/api/puzzles/daily");
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(3);
  });

  it("returns one puzzle per difficulty tier (easy, medium, hard)", async () => {
    const res = await app.request("/api/puzzles/daily");
    const [e, m, h] = await res.json();
    expect(e.inner_word.length).toBeLessThanOrEqual(4);
    expect(m.inner_word.length).toBe(5);
    expect(h.inner_word.length).toBeGreaterThanOrEqual(6);
  });

  it("is deterministic for the same date param", async () => {
    const r1 = await (await app.request("/api/puzzles/daily?date=2026-04-06")).json();
    const r2 = await (await app.request("/api/puzzles/daily?date=2026-04-06")).json();
    expect(r1).toEqual(r2);
  });

  it("returns different puzzles for different dates", async () => {
    // Verified empirically: these two dates produce different selections with the test fixture
    const r1 = await (await app.request("/api/puzzles/daily?date=2026-04-07")).json();
    const r2 = await (await app.request("/api/puzzles/daily?date=2026-04-08")).json();
    expect(r1).not.toEqual(r2);
  });
});
