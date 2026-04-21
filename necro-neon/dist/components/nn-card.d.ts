import type { CardVariant, PanelVariant, NNColor } from '../types/index.js';
export interface CardOptions {
    variant?: CardVariant;
    title?: string;
    subtitle?: string;
    body?: string | HTMLElement;
    /** Optional footer content (string or element). */
    footer?: string | HTMLElement;
    /** Optional image src URL (validated before use). */
    imageSrc?: string;
    imageAlt?: string;
    /** Extra CSS classes. */
    className?: string;
    /** Neon accent color for hover glow. */
    color?: NNColor;
}
/**
 * NNCard — creates a styled card element.
 *
 * @example
 * root.appendChild(new NNCard({
 *   variant: 'glass',
 *   title:   'SECTOR 7',
 *   body:    'Quarantine active.',
 *   color:   'danger',
 * }).el);
 */
export declare class NNCard {
    readonly el: HTMLElement;
    constructor(opts?: CardOptions);
}
export interface PanelOptions {
    variant?: PanelVariant;
    title?: string;
    /** Window dot colors for terminal panels (r/y/g). */
    windowDots?: boolean;
    content?: string | HTMLElement;
    className?: string;
}
/**
 * NNPanel — creates a terminal / glitch-window / shrine panel.
 *
 * @example
 * root.appendChild(new NNPanel({
 *   variant: 'terminal',
 *   title:   'BOOT_LOG',
 *   windowDots: true,
 * }).el);
 */
export declare class NNPanel {
    readonly el: HTMLElement;
    constructor(opts?: PanelOptions);
}
import type { ButtonVariant, NNSize } from '../types/index.js';
export interface ButtonOptions {
    label: string;
    variant?: ButtonVariant;
    size?: NNSize;
    icon?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (e: MouseEvent) => void;
    className?: string;
    /** data-text attribute for .glitch effect (auto-set from label if not provided) */
    dataText?: string;
}
/**
 * createButton — factory for fully typed `<button>` elements.
 *
 * @example
 * root.appendChild(createButton({
 *   label:   'EXECUTE',
 *   variant: 'danger',
 *   size:    'lg',
 *   onClick: () => triggerGlitch(),
 * }));
 */
export declare function createButton(opts: ButtonOptions): HTMLButtonElement;
//# sourceMappingURL=nn-card.d.ts.map