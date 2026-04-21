import type { ToastOptions } from '../types/index.js';
/**
 * NNToast — programmatic toast notification system.
 *
 * Requires a `<div id="toast-stack">` element in your HTML.
 *
 * @example
 * const toast = new NNToast();
 * toast.show({ title: 'SYSTEM', message: 'Connection established.', type: 'safe' });
 */
export declare class NNToast {
    private readonly stack;
    constructor(stackId?: string);
    show(opts: ToastOptions): HTMLElement;
    private _dismiss;
}
//# sourceMappingURL=nn-toast.d.ts.map