import type { AccordionItem } from '../types/index.js';
/**
 * NNAccordion — builds or binds an accordion component.
 *
 * @example — JS-driven:
 * new NNAccordion(container, [
 *   { id: 'a', title: 'Section A', content: 'Content...', open: true },
 * ]);
 *
 * @example — HTML-driven:
 * NNAccordion.init(); // bind all .nn-acc-trigger elements
 */
export declare class NNAccordion {
    private readonly root;
    constructor(root: HTMLElement, items: AccordionItem[]);
    private _toggle;
    /** Bind all existing `.nn-acc-trigger` elements in the document. */
    static init(): void;
}
//# sourceMappingURL=nn-accordion.d.ts.map