import { Hono } from "hono";
import { cors } from "hono/cors";
import sql from "../db/client.js";
import { getDailyPuzzles } from "./lib/dailyPuzzles.js";

const app = new Hono();

app.use("*", cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  allowMethods: ["GET"],
}));

// ── Health ───────────────────────────────────────────────────────────────────
app.get("/api/health", (c) => c.json({ ok: true }));

// ── Daily puzzles (deterministic, date-seeded) ───────────────────────────────
app.get("/api/puzzles/daily", async (c) => {
  const dateParam = c.req.query("date"); // optional override: YYYY-MM-DD

  // Parse YYYY-MM-DD as plain components to avoid UTC-vs-local timezone shifting.
  // getDailyPuzzles only calls getFullYear/getMonth/getDate, so a plain object works.
  let date;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const [y, m, d] = dateParam.split("-").map(Number);
    date = { getFullYear: () => y, getMonth: () => m - 1, getDate: () => d };
  } else {
    date = new Date();
  }

  const all = await sql`SELECT * FROM puzzles ORDER BY id`;
  const daily = getDailyPuzzles(all, date);
  return c.json(daily);
});

// ── All puzzles (for endless mode) ───────────────────────────────────────────
app.get("/api/puzzles", async (c) => {
  const puzzles = await sql`SELECT * FROM puzzles ORDER BY id`;
  return c.json(puzzles);
});

export default app;
