import type { ProgressOptions, SpinnerOptions, AvatarOptions, NNColor } from '../types/index.js';
/**
 * NNProgress — creates and controls a neon progress bar.
 *
 * @example
 * const bar = new NNProgress(container, { label: 'Loading', value: 0, color: 'primary' });
 * bar.setValue(72);
 */
export declare class NNProgress {
    private readonly fill;
    private readonly valueLabel?;
    private _value;
    constructor(root: HTMLElement, opts: ProgressOptions);
    setValue(value: number): void;
    get value(): number;
}
/**
 * NNSpinner — creates a neon loading spinner.
 *
 * @example
 * const spinner = new NNSpinner(container, { size: 'md', color: 'primary', label: 'Loading...' });
 * spinner.show();
 * spinner.hide();
 */
export declare class NNSpinner {
    private readonly el;
    constructor(root: HTMLElement, opts?: SpinnerOptions);
    show(): void;
    hide(): void;
}
/**
 * NNAvatar — creates a user avatar with optional status indicator.
 *
 * @example
 * const avatar = new NNAvatar(container, { initials: 'NK', color: 'primary', status: 'online' });
 */
export declare class NNAvatar {
    private readonly el;
    constructor(root: HTMLElement, opts?: AvatarOptions);
}
/**
 * createBadge — factory for inline `<span class="nn-badge">` elements.
 *
 * @example
 * container.appendChild(createBadge('LIVE', 'danger', true));
 */
export declare function createBadge(text: string, color?: NNColor, dot?: boolean): HTMLElement;
//# sourceMappingURL=nn-ui.d.ts.map