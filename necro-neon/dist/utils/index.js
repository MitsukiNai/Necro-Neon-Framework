// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — General Utilities
// ================================================================
// ---- DOM helpers -------------------------------------------------
/**
 * $ — typed querySelector shorthand.
 * @throws never — returns null (caller must check).
 */
export function $(selector, root = document) {
    return root.querySelector(selector);
}
/**
 * $$ — typed querySelectorAll shorthand, returns array.
 */
export function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}
/**
 * el — typed createElement shorthand.
 *
 * @example
 * const div = el('div', 'nn-card', { role: 'region' });
 */
export function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className)
        node.className = className;
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
export function debounce(fn, wait) {
    let timer = null;
    return (...args) => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
}
/**
 * throttle — returns a throttled version of `fn` that fires at most
 * once every `wait` ms.
 */
export function throttle(fn, wait) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn(...args);
        }
    };
}
// ---- Math helpers ------------------------------------------------
/** Clamp a number between min and max. */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
/** Linear interpolation. */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
/** Map a value from one range to another. */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
// ---- Color helpers -----------------------------------------------
/**
 * hexToRgb — converts #RRGGBB / #RGB to { r, g, b }.
 * Returns null for invalid input.
 */
export function hexToRgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3)
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length !== 6)
        return null;
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
/**
 * hexToRgbString — converts #RRGGBB to "R,G,B" for use in rgba().
 */
export function hexToRgbString(hex) {
    const rgb = hexToRgb(hex);
    return rgb ? `${rgb.r},${rgb.g},${rgb.b}` : '0,0,0';
}
// ---- Event helpers -----------------------------------------------
/**
 * once — attaches an event listener that fires only once.
 */
export function once(el, event, handler) {
    const wrapper = (e) => {
        handler(e);
        el.removeEventListener(event, wrapper);
    };
    el.addEventListener(event, wrapper);
}
/**
 * onReady — runs a callback when the DOM is ready.
 */
export function onReady(fn) {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
}
// ---- Storage helpers (no localStorage — uses sessionStorage safely) --
/**
 * sessionGet — safely reads from sessionStorage.
 * Returns null on failure or missing key.
 */
export function sessionGet(key) {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
/**
 * sessionSet — safely writes to sessionStorage.
 * Returns false if storage is unavailable.
 */
export function sessionSet(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch {
        return false;
    }
}
// ---- Unique ID ---------------------------------------------------
/**
 * uid — generates a short random string ID, safe for use as element IDs.
 */
export function uid(prefix = 'nn') {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
//# sourceMappingURL=index.js.map