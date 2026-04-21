/**
 * $ — typed querySelector shorthand.
 * @throws never — returns null (caller must check).
 */
export declare function $<T extends HTMLElement = HTMLElement>(selector: string, root?: Document | HTMLElement): T | null;
/**
 * $$ — typed querySelectorAll shorthand, returns array.
 */
export declare function $$<T extends HTMLElement = HTMLElement>(selector: string, root?: Document | HTMLElement): T[];
/**
 * el — typed createElement shorthand.
 *
 * @example
 * const div = el('div', 'nn-card', { role: 'region' });
 */
export declare function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, attrs?: Record<string, string>): HTMLElementTagNameMap[K];
/**
 * debounce — returns a debounced version of `fn` that delays
 * execution until `wait` ms have passed since the last call.
 */
export declare function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number): (...args: Parameters<T>) => void;
/**
 * throttle — returns a throttled version of `fn` that fires at most
 * once every `wait` ms.
 */
export declare function throttle<T extends (...args: unknown[]) => void>(fn: T, wait: number): (...args: Parameters<T>) => void;
/** Clamp a number between min and max. */
export declare function clamp(value: number, min: number, max: number): number;
/** Linear interpolation. */
export declare function lerp(a: number, b: number, t: number): number;
/** Map a value from one range to another. */
export declare function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
/**
 * hexToRgb — converts #RRGGBB / #RGB to { r, g, b }.
 * Returns null for invalid input.
 */
export declare function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
} | null;
/**
 * hexToRgbString — converts #RRGGBB to "R,G,B" for use in rgba().
 */
export declare function hexToRgbString(hex: string): string;
/**
 * once — attaches an event listener that fires only once.
 */
export declare function once<K extends keyof HTMLElementEventMap>(el: HTMLElement, event: K, handler: (e: HTMLElementEventMap[K]) => void): void;
/**
 * onReady — runs a callback when the DOM is ready.
 */
export declare function onReady(fn: () => void): void;
/**
 * sessionGet — safely reads from sessionStorage.
 * Returns null on failure or missing key.
 */
export declare function sessionGet<T>(key: string): T | null;
/**
 * sessionSet — safely writes to sessionStorage.
 * Returns false if storage is unavailable.
 */
export declare function sessionSet(key: string, value: unknown): boolean;
/**
 * uid — generates a short random string ID, safe for use as element IDs.
 */
export declare function uid(prefix?: string): string;
//# sourceMappingURL=index.d.ts.map