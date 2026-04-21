import type { ModalOptions } from '../types/index.js';
/**
 * NNModal — programmatic modal / ritual-dialog system.
 *
 * @example
 * const modal = new NNModal();
 * modal.open('my-modal');
 * modal.create({ id: 'confirm', title: 'CONFIRM', content: 'Are you sure?' });
 */
export declare class NNModal {
    constructor();
    /** Open an existing modal by ID. */
    open(id: string): void;
    /** Close an existing modal by ID. */
    close(id: string): void;
    /**
     * Programmatically create and open a modal.
     * The modal is appended to `<body>` and removed on close.
     */
    create(opts: ModalOptions): HTMLElement;
}
//# sourceMappingURL=nn-modal.d.ts.map