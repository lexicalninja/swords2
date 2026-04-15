import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WordTiles } from "../components/WordTiles.jsx";

// "kerosene" with "rose" at index 2
const BASE = { outer: "kerosene", inner: "rose", start: 2 };

function tiles() {
  return screen.getAllByRole("generic").filter(el =>
    el.tagName === "SPAN" && el.textContent.length === 1
  );
}

describe("WordTiles", () => {
  it("renders the correct number of tiles", () => {
    const { container } = render(<WordTiles {...BASE} solved={false} revealed={false} celebration={false} />);
    const spans = container.querySelectorAll("span");
    expect(spans).toHaveLength(BASE.outer.length);
  });

  it("shows ? for hidden letters when not solved/revealed", () => {
    const { container } = render(<WordTiles {...BASE} solved={false} revealed={false} celebration={false} />);
    const spans = [...container.querySelectorAll("span")];
    // indices 2,3,4,5 are buried (rose = 4 letters)
    expect(spans[2].textContent).toBe("?");
    expect(spans[3].textContent).toBe("?");
    expect(spans[4].textContent).toBe("?");
    expect(spans[5].textContent).toBe("?");
  });

  it("shows visible letters for non-buried tiles", () => {
    const { container } = render(<WordTiles {...BASE} solved={false} revealed={false} celebration={false} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[0].textContent).toBe("k");
    expect(spans[1].textContent).toBe("e");
  });

  it("reveals letters on solve", () => {
    const { container } = render(<WordTiles {...BASE} solved={true} revealed={false} celebration={false} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[2].textContent).toBe("r");
    expect(spans[3].textContent).toBe("o");
    expect(spans[4].textContent).toBe("s");
    expect(spans[5].textContent).toBe("e");
  });

  it("reveals letters on give-up (revealed)", () => {
    const { container } = render(<WordTiles {...BASE} solved={false} revealed={true} celebration={false} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[2].textContent).toBe("r");
  });

  it("applies solved CSS class to buried tiles when solved", () => {
    const { container } = render(<WordTiles {...BASE} solved={true} revealed={false} celebration={false} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[2].className).toMatch(/solved/);
  });

  it("applies failed CSS class to buried tiles when revealed (gave up)", () => {
    const { container } = render(<WordTiles {...BASE} solved={false} revealed={true} celebration={false} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[2].className).toMatch(/failed/);
  });

  it("applies celebrate class when celebration=true and solved", () => {
    const { container } = render(<WordTiles {...BASE} solved={true} revealed={false} celebration={true} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[2].className).toMatch(/celebrate/);
  });

  it("does not apply celebrate class when not solved", () => {
    const { container } = render(<WordTiles {...BASE} solved={false} revealed={false} celebration={true} />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans[2].className).not.toMatch(/celebrate/);
  });
});
