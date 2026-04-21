// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — General Utilities
// ================================================================

// ---- DOM helpers -------------------------------------------------

/**
 * $ — typed querySelector shorthand.
 * @throws never — returns null (caller must check).
 */
export function $<T extends HTMLElement = HTMLElement>(
  selector: string,
  root: Document | HTMLElement = document
): T | null {
  return root.querySelector<T>(selector);
}

/**
 * $$ — typed querySelectorAll shorthand, returns array.
 */
export function $$<T extends HTMLElement = HTMLElement>(
  selector: string,
  root: Document | HTMLElement = document
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/**
 * el — typed createElement shorthand.
 *
 * @example
 * const div = el('div', 'nn-card', { role: 'region' });
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string>
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  }
  return node;
}

// ---- Timing helpers -----------------------------------------------

/**
 * debounce — returns a debounced version of `fn` that delays
 * execution until `wait` ms have passed since the last call.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/**
 * throttle — returns a throttled version of `fn` that fires at most
 * once every `wait` ms.
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

// ---- Math helpers ------------------------------------------------

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Map a value from one range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

// ---- Color helpers -----------------------------------------------

/**
 * hexToRgb — converts #RRGGBB / #RGB to { r, g, b }.
 * Returns null for invalid input.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * hexToRgbString — converts #RRGGBB to "R,G,B" for use in rgba().
 */
export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgb ? `${rgb.r},${rgb.g},${rgb.b}` : '0,0,0';
}

// ---- Event helpers -----------------------------------------------

/**
 * once — attaches an event listener that fires only once.
 */
export function once<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void
): void {
  const wrapper = (e: HTMLElementEventMap[K]) => {
    handler(e);
    el.removeEventListener(event, wrapper);
  };
  el.addEventListener(event, wrapper);
}

/**
 * onReady — runs a callback when the DOM is ready.
 */
export function onReady(fn: () => void): void {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  }
}

// ---- Storage helpers (no localStorage — uses sessionStorage safely) --

/**
 * sessionGet — safely reads from sessionStorage.
 * Returns null on failure or missing key.
 */
export function sessionGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * sessionSet — safely writes to sessionStorage.
 * Returns false if storage is unavailable.
 */
export function sessionSet(key: string, value: unknown): boolean {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// ---- Unique ID ---------------------------------------------------

/**
 * uid — generates a short random string ID, safe for use as element IDs.
 */
export function uid(prefix = 'nn'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
