const DAILY_KEY = "swords_daily_progress";

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Shape: { date, score, puzzleResults: [{ solved, hintsUsed, revealed }] }

export function loadDailyProgress() {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date !== today()) return null; // stale — different day
    return data;
  } catch {
    return null;
  }
}

export function saveDailyProgress(progress) {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify({ ...progress, date: today() }));
  } catch {
    // Safari private mode — ignore write failures silently
  }
}

export function clearDailyProgress() {
  try {
    localStorage.removeItem(DAILY_KEY);
  } catch {
    // ignore
  }
}
