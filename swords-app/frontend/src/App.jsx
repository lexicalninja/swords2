import { useState } from "react";
import "./App.css";
import { MenuScreen } from "./screens/MenuScreen.jsx";
import { GameScreen } from "./screens/GameScreen.jsx";
import { ResultsScreen } from "./screens/ResultsScreen.jsx";

export default function App() {
  const [mode, setMode] = useState(null); // null=menu | "daily" | "endless" | "results"
  const [results, setResults] = useState(null);

  function handleFinish(gameState) {
    setResults({
      score: gameState.score,
      completedPuzzleResults: gameState.completedPuzzleResults,
    });
    setMode("results");
  }

  if (!mode || mode === "menu") {
    return (
      <MenuScreen
        onStartDaily={() => setMode("daily")}
        onStartEndless={() => setMode("endless")}
      />
    );
  }

  if (mode === "daily" || mode === "endless") {
    return (
      <GameScreen
        mode={mode}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <ResultsScreen
      mode="daily"
      score={results?.score ?? 0}
      completedPuzzleResults={results?.completedPuzzleResults ?? []}
      onMenu={() => setMode("menu")}
    />
  );
}
