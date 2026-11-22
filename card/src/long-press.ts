export const LONG_PRESS_MS = 500;
const MOVE_TOLERANCE_PX = 10;

type PointerLike = { clientX: number; clientY: number; button?: number };

export type LongPress = {
  start(e: PointerLike): void;
  move(e: PointerLike): void;
  cancel(): void;
  /** True once, right after a long press fired: use to swallow the click. */
  consumeFired(): boolean;
};

/** Fires `onFire` when a press is held for `delay` ms without moving. */
export function createLongPress(onFire: () => void, delay = LONG_PRESS_MS): LongPress {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let origin: PointerLike | undefined;
  let fired = false;
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    origin = undefined;
  };
  return {
    start(e) {
      if (e.button !== undefined && e.button !== 0) return;
      cancel();
      fired = false;
      origin = e;
      timer = setTimeout(() => {
        timer = undefined;
        origin = undefined;
        fired = true;
        onFire();
      }, delay);
    },
    move(e) {
      if (!origin) return;
      if (Math.hypot(e.clientX - origin.clientX, e.clientY - origin.clientY) > MOVE_TOLERANCE_PX) {
        cancel();
      }
    },
    cancel,
    consumeFired() {
      const f = fired;
      fired = false;
      return f;
    },
  };
}

/** Ask Home Assistant to open the more-info dialog for an entity. */
export function fireMoreInfo(el: HTMLElement, entityId: string): void {
  el.dispatchEvent(
    new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
  );
}
