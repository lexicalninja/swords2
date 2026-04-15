import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsScreen } from "../screens/ResultsScreen.jsx";

const RESULTS = [
  { solved: true,  hintsUsed: 0 },
  { solved: true,  hintsUsed: 2 },
  { solved: false, hintsUsed: 1 },
];

describe("ResultsScreen", () => {
  it("renders the total score", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getByText("28")).toBeInTheDocument();
  });

  it("shows max possible score", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getByText(`out of ${RESULTS.length * 15} possible`)).toBeInTheDocument();
  });

  it("shows one row per completed puzzle", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getAllByText(/Puzzle \d/)).toHaveLength(RESULTS.length);
  });

  it("shows ✓ Solved for solved puzzles", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getAllByText("✓ Solved")).toHaveLength(2);
  });

  it("shows ✗ Gave up for failed puzzles", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getByText("✗ Gave up")).toBeInTheDocument();
  });

  it("shows hint count when hints were used", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getByText(/2 hints/)).toBeInTheDocument();
    expect(screen.getByText(/1 hint\b/)).toBeInTheDocument();
  });

  it("shows Share button for daily mode", () => {
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Share/i })).toBeInTheDocument();
  });

  it("does not show Share button for endless mode", () => {
    render(<ResultsScreen mode="endless" score={28} completedPuzzleResults={RESULTS} onMenu={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /Share/i })).not.toBeInTheDocument();
  });

  it("calls onMenu when Menu button is clicked", async () => {
    const onMenu = vi.fn();
    render(<ResultsScreen mode="daily" score={28} completedPuzzleResults={RESULTS} onMenu={onMenu} />);
    await userEvent.click(screen.getByRole("button", { name: /Menu/i }));
    expect(onMenu).toHaveBeenCalledOnce();
  });
});
