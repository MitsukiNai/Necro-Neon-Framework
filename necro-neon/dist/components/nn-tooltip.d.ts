export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipOptions {
    text: string;
    position?: TooltipPosition;
    /** Delay before showing in ms. Default 180. */
    delay?: number;
}
/**
 * NNTooltip — attaches a neon tooltip to any element.
 *
 * @example
 * new NNTooltip(btn, { text: 'Delete this sector', position: 'top' });
 *
 * @example — HTML-driven (bind all [data-tooltip] elements):
 * NNTooltip.initAll();
 */
export declare class NNTooltip {
    private readonly target;
    private readonly tip;
    private readonly delay;
    private _showTimeout;
    constructor(target: HTMLElement, opts: TooltipOptions);
    private _show;
    private _hide;
    destroy(): void;
    /** Attach tooltips to all `[data-tooltip]` elements in the document. */
    static initAll(root?: HTMLElement | Document): void;
}
//# sourceMappingURL=nn-tooltip.d.ts.map