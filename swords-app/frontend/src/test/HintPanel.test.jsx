import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HintPanel } from "../components/HintPanel.jsx";

const HINTS = ["Something joyful", "A sound you make", "Rhymes with calf", "_ A U G _"];

function setup(overrides = {}) {
  const onReveal = vi.fn();
  const props = {
    hints: HINTS,
    hintLevel: 0,
    nextHintCost: 2,
    onReveal,
    solved: false,
    revealed: false,
    ...overrides,
  };
  return { onReveal, ...render(<HintPanel {...props} />) };
}

describe("HintPanel", () => {
  it("shows hint button when level=0 and not solved/revealed", () => {
    setup();
    expect(screen.getByText(/Need a hint/)).toBeInTheDocument();
  });

  it("shows hint cost on the button", () => {
    setup({ hintLevel: 0, nextHintCost: 2 });
    expect(screen.getByText("−2")).toBeInTheDocument();
  });

  it("calls onReveal when hint button is clicked", async () => {
    const { onReveal } = setup();
    await userEvent.click(screen.getByRole("button"));
    expect(onReveal).toHaveBeenCalledOnce();
  });

  it("shows 'More help?' after first hint is revealed", () => {
    setup({ hintLevel: 1, nextHintCost: 3 });
    expect(screen.getByText(/More help/)).toBeInTheDocument();
  });

  it("shows revealed hints as labelled rows", () => {
    setup({ hintLevel: 2 });
    expect(screen.getByText("Vague")).toBeInTheDocument();
    expect(screen.getByText("Warm")).toBeInTheDocument();
    expect(screen.queryByText("Warmer")).not.toBeInTheDocument();
  });

  it("hint text is visible for revealed tiers", () => {
    setup({ hintLevel: 1 });
    expect(screen.getByText(HINTS[0])).toBeInTheDocument();
  });

  it("shows 'All hints revealed' when level=4", () => {
    setup({ hintLevel: 4, nextHintCost: 0 });
    expect(screen.getByText("All hints revealed")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides button when solved", () => {
    setup({ solved: true });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides button when revealed (gave up)", () => {
    setup({ revealed: true });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("tier labels have correct data-tier attributes", () => {
    const { container } = setup({ hintLevel: 4 });
    [0, 1, 2, 3].forEach(i => {
      expect(container.querySelector(`[data-tier="${i}"]`)).toBeInTheDocument();
    });
  });
});
