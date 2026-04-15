import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PointsBar } from "../components/PointsBar.jsx";

describe("PointsBar", () => {
  it("displays current / max points", () => {
    render(<PointsBar pointsAvailable={13} />);
    expect(screen.getByText("13 / 15")).toBeInTheDocument();
  });

  it("fill data-level is 'high' when > 10 pts", () => {
    const { container } = render(<PointsBar pointsAvailable={11} />);
    expect(container.querySelector("[data-level='high']")).toBeInTheDocument();
  });

  it("fill data-level is 'mid' when 6–10 pts", () => {
    const { container } = render(<PointsBar pointsAvailable={8} />);
    expect(container.querySelector("[data-level='mid']")).toBeInTheDocument();
  });

  it("fill data-level is 'low' when ≤ 5 pts", () => {
    const { container } = render(<PointsBar pointsAvailable={5} />);
    expect(container.querySelector("[data-level='low']")).toBeInTheDocument();
  });

  it("fill width reflects proportion of MAX_POINTS", () => {
    const { container } = render(<PointsBar pointsAvailable={15} />);
    const fill = container.querySelector("[data-level]");
    expect(fill.style.width).toBe("100%");
  });

  it("fill width is 0% at 0 pts", () => {
    const { container } = render(<PointsBar pointsAvailable={0} />);
    const fill = container.querySelector("[data-level]");
    expect(fill.style.width).toBe("0%");
  });
});
