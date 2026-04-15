const BASE = "/api";

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} returned ${res.status}`);
  return res.json();
}

export function fetchDailyPuzzles() {
  return request("/puzzles/daily");
}

export function fetchAllPuzzles() {
  return request("/puzzles");
}
