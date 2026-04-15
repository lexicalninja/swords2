import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HintDots } from "../components/HintDots.jsx";

// Select individual dots by their data-used attribute (excludes the wrapper div)
function getDots(container) {
  return [...container.querySelectorAll("[data-used]")];
}

describe("HintDots", () => {
  it("renders the correct number of dots", () => {
    const { container } = render(<HintDots level={0} total={4} />);
    expect(getDots(container)).toHaveLength(4);
  });

  it("marks dots as used up to level", () => {
    const { container } = render(<HintDots level={2} total={4} />);
    const dots = getDots(container);
    expect(dots[0].dataset.used).toBe("true");
    expect(dots[1].dataset.used).toBe("true");
    expect(dots[2].dataset.used).toBe("false");
    expect(dots[3].dataset.used).toBe("false");
  });

  it("all dots used when level === total", () => {
    const { container } = render(<HintDots level={4} total={4} />);
    getDots(container).forEach(d => expect(d.dataset.used).toBe("true"));
  });

  it("no dots used when level === 0", () => {
    const { container } = render(<HintDots level={0} total={4} />);
    getDots(container).forEach(d => expect(d.dataset.used).toBe("false"));
  });

  it("respects custom total", () => {
    const { container } = render(<HintDots level={1} total={6} />);
    expect(getDots(container)).toHaveLength(6);
  });
});
