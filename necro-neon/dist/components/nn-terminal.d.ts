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
export declare function typeText(el: HTMLElement, text: string, opts?: TypingOptions): () => void;
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
export declare function initTerminalTyping(root?: HTMLElement | Document, opts?: TypingOptions): Array<() => void>;
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
export declare class NNTerminal {
    private readonly panel;
    private readonly body;
    private _cancels;
    constructor(root: HTMLElement, opts?: TerminalOptions);
    /** Append a new line (with optional animation). */
    push(line: TerminalLine, animate?: boolean): void;
    /** Clear all lines. */
    clear(): void;
    /** Cancel all animations and remove from DOM. */
    destroy(): void;
    private _makeLine;
    private _classFor;
}
//# sourceMappingURL=nn-terminal.d.ts.map