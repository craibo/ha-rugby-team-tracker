import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLongPress, LONG_PRESS_MS } from "../src/long-press";

const at = (x: number, y: number, button = 0) => ({ clientX: x, clientY: y, button });

describe("createLongPress", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires after the hold delay and swallows the following click once", () => {
    const fire = vi.fn();
    const lp = createLongPress(fire);
    lp.start(at(0, 0));
    vi.advanceTimersByTime(LONG_PRESS_MS - 1);
    expect(fire).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fire).toHaveBeenCalledTimes(1);
    expect(lp.consumeFired()).toBe(true);
    expect(lp.consumeFired()).toBe(false);
  });
  it("does not fire on a short press", () => {
    const fire = vi.fn();
    const lp = createLongPress(fire);
    lp.start(at(0, 0));
    vi.advanceTimersByTime(200);
    lp.cancel();
    vi.advanceTimersByTime(1000);
    expect(fire).not.toHaveBeenCalled();
    expect(lp.consumeFired()).toBe(false);
  });
  it("cancels when the pointer moves (scroll)", () => {
    const fire = vi.fn();
    const lp = createLongPress(fire);
    lp.start(at(0, 0));
    lp.move(at(3, 3));
    lp.move(at(0, 30));
    vi.advanceTimersByTime(1000);
    expect(fire).not.toHaveBeenCalled();
  });
  it("ignores non-primary buttons", () => {
    const fire = vi.fn();
    const lp = createLongPress(fire);
    lp.start(at(0, 0, 2));
    vi.advanceTimersByTime(1000);
    expect(fire).not.toHaveBeenCalled();
  });
});
