import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DifficultyBadge } from "../components/DifficultyBadge.jsx";

describe("DifficultyBadge", () => {
  it("shows 'easy' for 4-letter word", () => {
    render(<DifficultyBadge innerWord="rose" />);
    expect(screen.getByText("easy")).toBeInTheDocument();
  });

  it("shows 'medium' for 5-letter word", () => {
    render(<DifficultyBadge innerWord="laugh" />);
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("shows 'hard' for 6-letter word", () => {
    render(<DifficultyBadge innerWord="ripple" />);
    expect(screen.getByText("hard")).toBeInTheDocument();
  });

  it("sets data-difficulty attribute correctly", () => {
    const { container } = render(<DifficultyBadge innerWord="rose" />);
    expect(container.querySelector("[data-difficulty='easy']")).toBeInTheDocument();
  });

  it("data-difficulty is 'hard' for 8-letter word", () => {
    const { container } = render(<DifficultyBadge innerWord="resident" />);
    expect(container.querySelector("[data-difficulty='hard']")).toBeInTheDocument();
  });
});
