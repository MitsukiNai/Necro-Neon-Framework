import type { TabsOptions } from '../types/index.js';
/**
 * NNTabs — programmatic tab system, or works with existing HTML.
 *
 * @example — JS-driven:
 * const tabs = new NNTabs(container, {
 *   tabs: [
 *     { id: 'alpha', label: 'Alpha', content: 'Content A' },
 *     { id: 'beta',  label: 'Beta',  content: 'Content B' },
 *   ]
 * });
 *
 * @example — HTML-driven (use existing markup):
 * NNTabs.init(); // binds all [data-nn-tabs] roots in the document
 */
export declare class NNTabs {
    private readonly root;
    private readonly onChange?;
    private _activeId;
    constructor(root: HTMLElement, opts: TabsOptions);
    activate(id: string): void;
    get activeId(): string;
    /** Bind all existing `.nn-tab` / `.nn-tab-content` pairs in the document. */
    static init(): void;
}
//# sourceMappingURL=nn-tabs.d.ts.map