// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-terminal component
// Terminal typing animation + command simulation
// ================================================================

import { escapeHtml } from '../security/index.js';

// ---- Typing Animation --------------------------------------------

export interface TypingOptions {
  /** Delay between characters in ms. Default 32. */
  charDelay?: number;
  /** Initial delay before typing starts in ms. Default 0. */
  startDelay?: number;
  /** Called when typing is complete. */
  onComplete?: () => void;
}

/**
 * typeText — animates text character by character into an element.
 * Returns a cancel function.
 *
 * @example
 * const cancel = typeText(el, 'SYSTEM ONLINE', { charDelay: 40 });
 */
export function typeText(
  el: HTMLElement,
  text: string,
  opts: TypingOptions = {}
): () => void {
  const { charDelay = 32, startDelay = 0, onComplete } = opts;
  const safe = escapeHtml(text);
  let j = 0;
  let iv: ReturnType<typeof setInterval> | null = null;

  const to = setTimeout(() => {
    el.textContent = '';
    iv = setInterval(() => {
      el.textContent = safe.substring(0, j++);
      if (j > safe.length) {
        if (iv) clearInterval(iv);
        onComplete?.();
      }
    }, charDelay);
  }, startDelay);

  return () => {
    clearTimeout(to);
    if (iv) clearInterval(iv);
  };
}

/**
 * initTerminalTyping — finds all terminal prompt/status elements in a
 * root and animates them sequentially with staggered delays.
 *
 * Targets: `.terminal-prompt:not(.terminal-cursor)`,
 *          `.terminal-ok`, `.terminal-warn`, `.terminal-err`
 *
 * @example
 * initTerminalTyping(document.getElementById('my-terminal')!);
 */
export function initTerminalTyping(
  root: HTMLElement | Document = document,
  opts: TypingOptions = {}
): Array<() => void> {
  const selector = [
    '.terminal-prompt:not(.terminal-cursor)',
    '.terminal-ok',
    '.terminal-warn',
    '.terminal-err',
  ].join(',');

  const cancels: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
    const raw = el.textContent ?? '';
    const cancel = typeText(el, raw, {
      charDelay:  opts.charDelay  ?? 32,
      startDelay: (opts.startDelay ?? 600) + i * 380,
      onComplete: opts.onComplete,
    });
    cancels.push(cancel);
  });

  return cancels; // call each to abort animations
}

// ---- Terminal Component ------------------------------------------

export interface TerminalLine {
  type: 'prompt' | 'ok' | 'warn' | 'err' | 'comment' | 'raw';
  text: string;
}

export interface TerminalOptions {
  /** Window title shown in the terminal bar. Default 'SYSTEM_TERMINAL'. */
  title?: string;
  /** Lines to pre-render. */
  lines?: TerminalLine[];
  /** Animate lines with typing effect. Default true. */
  animate?: boolean;
  /** Show blinking cursor at end. Default true. */
  cursor?: boolean;
}

/**
 * NNTerminal — builds a full terminal panel component.
 *
 * @example
 * const term = new NNTerminal(container, {
 *   title: 'BOOT_SEQUENCE',
 *   lines: [
 *     { type: 'prompt',  text: 'Initialising necro-neon...' },
 *     { type: 'ok',      text: 'Core systems loaded' },
 *     { type: 'warn',    text: 'District sync pending' },
 *   ],
 * });
 * term.push({ type: 'ok', text: 'Ready.' });
 */
export class NNTerminal {
  private readonly panel: HTMLElement;
  private readonly body: HTMLElement;
  private _cancels: Array<() => void> = [];

  constructor(root: HTMLElement, opts: TerminalOptions = {}) {
    const { title = 'SYSTEM_TERMINAL', lines = [], animate = true, cursor = true } = opts;

    // Wrapper panel
    const panel = document.createElement('div');
    panel.className = 'nn-panel terminal-panel';

    // Title bar
    const bar = document.createElement('div');
    bar.className = 'terminal-bar';

    const dots = document.createElement('div');
    dots.className = 'terminal-dots';
    for (const cls of ['dot-r', 'dot-y', 'dot-g']) {
      const d = document.createElement('span');
      d.className = cls;
      dots.appendChild(d);
    }

    const titleEl = document.createElement('span');
    titleEl.className   = 'terminal-title nn-mono nn-micro';
    titleEl.textContent = escapeHtml(title);

    bar.appendChild(dots);
    bar.appendChild(titleEl);
    panel.appendChild(bar);

    // Body
    const body = document.createElement('div');
    body.className = 'terminal-body';
    panel.appendChild(body);
    this.body  = body;
    this.panel = panel;
    root.appendChild(panel);

    // Render initial lines
    lines.forEach((line, i) => {
      const el = this._makeLine(line);
      body.appendChild(el);

      if (animate) {
        const raw = el.textContent ?? '';
        const cancel = typeText(el, raw, {
          charDelay:  32,
          startDelay: 600 + i * 380,
        });
        this._cancels.push(cancel);
      }
    });

    // Blinking cursor
    if (cursor) {
      const cur = document.createElement('span');
      cur.className = 'terminal-cursor';
      cur.setAttribute('aria-hidden', 'true');
      body.appendChild(cur);
    }
  }

  /** Append a new line (with optional animation). */
  push(line: TerminalLine, animate = false): void {
    const el = this._makeLine(line);
    // Insert before cursor if present
    const cursor = this.body.querySelector<HTMLElement>('.terminal-cursor');
    if (cursor) {
      this.body.insertBefore(el, cursor);
    } else {
      this.body.appendChild(el);
    }
    if (animate) {
      const raw = el.textContent ?? '';
      const cancel = typeText(el, raw, { charDelay: 28 });
      this._cancels.push(cancel);
    }
  }

  /** Clear all lines. */
  clear(): void {
    this._cancels.forEach((c) => c());
    this._cancels = [];
    const cursor = this.body.querySelector<HTMLElement>('.terminal-cursor');
    this.body.innerHTML = '';
    if (cursor) this.body.appendChild(cursor);
  }

  /** Cancel all animations and remove from DOM. */
  destroy(): void {
    this._cancels.forEach((c) => c());
    this.panel.remove();
  }

  private _makeLine(line: TerminalLine): HTMLElement {
    const el = document.createElement('span');
    el.className = this._classFor(line.type);
    el.textContent = escapeHtml(line.text);
    return el;
  }

  private _classFor(type: TerminalLine['type']): string {
    const map: Record<TerminalLine['type'], string> = {
      prompt:  'terminal-prompt',
      ok:      'terminal-ok',
      warn:    'terminal-warn',
      err:     'terminal-err',
      comment: 'terminal-comment nn-mono',
      raw:     'terminal-raw nn-mono',
    };
    return map[type];
  }
}
