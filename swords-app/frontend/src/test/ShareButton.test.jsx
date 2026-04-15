import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareButton } from "../components/ShareButton.jsx";

const TEXT = "sWORDs 2026-04-06\nPuzzle 1: ⬜✅";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ShareButton", () => {
  it("renders with 'Share' label initially", () => {
    render(<ShareButton text={TEXT} />);
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("copies text to clipboard and shows 'Copied!'", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<ShareButton text={TEXT} />);
    await userEvent.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith(TEXT);
    expect(await screen.findByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("falls back to window.prompt when clipboard is unavailable", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("No clipboard")) } });
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);

    render(<ShareButton text={TEXT} />);
    await userEvent.click(screen.getByRole("button"));

    expect(promptSpy).toHaveBeenCalledWith("Copy your results:", TEXT);
  });

  it("sets data-copied=true after click", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

    const { container } = render(<ShareButton text={TEXT} />);
    await userEvent.click(screen.getByRole("button"));

    expect(container.querySelector("[data-copied='true']")).toBeInTheDocument();
  });
});
