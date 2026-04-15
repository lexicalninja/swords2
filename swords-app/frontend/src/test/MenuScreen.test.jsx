import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuScreen } from "../screens/MenuScreen.jsx";

describe("MenuScreen", () => {
  it("renders the game title", () => {
    render(<MenuScreen onStartDaily={vi.fn()} onStartEndless={vi.fn()} />);
    expect(screen.getByText("WORD")).toBeInTheDocument();
  });

  it("renders Daily 3 and Endless buttons", () => {
    render(<MenuScreen onStartDaily={vi.fn()} onStartEndless={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Daily 3/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Endless/i })).toBeInTheDocument();
  });

  it("calls onStartDaily when Daily 3 is clicked", async () => {
    const onStartDaily = vi.fn();
    render(<MenuScreen onStartDaily={onStartDaily} onStartEndless={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /Daily 3/i }));
    expect(onStartDaily).toHaveBeenCalledOnce();
  });

  it("calls onStartEndless when Endless is clicked", async () => {
    const onStartEndless = vi.fn();
    render(<MenuScreen onStartDaily={vi.fn()} onStartEndless={onStartEndless} />);
    await userEvent.click(screen.getByRole("button", { name: /Endless/i }));
    expect(onStartEndless).toHaveBeenCalledOnce();
  });

  it("renders how-to-play card", () => {
    render(<MenuScreen onStartDaily={vi.fn()} onStartEndless={vi.fn()} />);
    expect(screen.getByText(/How to play/i)).toBeInTheDocument();
  });

  it("shows all four hint cost chips", () => {
    render(<MenuScreen onStartDaily={vi.fn()} onStartEndless={vi.fn()} />);
    expect(screen.getByText("Vague (−2)")).toBeInTheDocument();
    expect(screen.getByText("Warm (−3)")).toBeInTheDocument();
    expect(screen.getByText("Warmer (−4)")).toBeInTheDocument();
    expect(screen.getByText("Obvious (−6)")).toBeInTheDocument();
  });
});
