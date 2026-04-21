// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-tabs component
// ================================================================
import { escapeHtml } from '../security/index.js';
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
export class NNTabs {
    constructor(root, opts) {
        this.root = root;
        this.onChange = opts.onChange;
        // Build DOM from options
        const nav = document.createElement('div');
        nav.className = 'nn-tab-nav';
        const panels = document.createElement('div');
        panels.className = 'nn-tab-panels';
        opts.tabs.forEach((tab, i) => {
            // Tab button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'nn-tab';
            btn.textContent = escapeHtml(tab.label);
            btn.setAttribute('data-tab', tab.id);
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-controls', `tab-panel-${tab.id}`);
            btn.addEventListener('click', () => this.activate(tab.id));
            nav.appendChild(btn);
            // Panel
            const panel = document.createElement('div');
            panel.id = `tab-panel-${tab.id}`;
            panel.className = 'nn-tab-content';
            panel.setAttribute('role', 'tabpanel');
            if (typeof tab.content === 'string') {
                panel.textContent = escapeHtml(tab.content);
            }
            else {
                panel.appendChild(tab.content);
            }
            panels.appendChild(panel);
            if (i === 0 && !opts.activeId)
                btn.classList.add('active');
            if (i === 0 && !opts.activeId)
                panel.classList.add('active');
        });
        this.root.appendChild(nav);
        this.root.appendChild(panels);
        this._activeId = opts.activeId ?? (opts.tabs[0]?.id ?? '');
        if (opts.activeId)
            this.activate(opts.activeId);
    }
    activate(id) {
        this._activeId = id;
        this.root.querySelectorAll('.nn-tab').forEach((btn) => {
            const active = btn.getAttribute('data-tab') === id;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', String(active));
        });
        this.root.querySelectorAll('.nn-tab-content').forEach((panel) => {
            panel.classList.toggle('active', panel.id === `tab-panel-${id}`);
        });
        this.onChange?.(id);
    }
    get activeId() { return this._activeId; }
    /** Bind all existing `.nn-tab` / `.nn-tab-content` pairs in the document. */
    static init() {
        document.querySelectorAll('.nn-tab').forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                if (!targetId)
                    return;
                const nav = btn.closest('.nn-tab-nav') ?? document;
                nav.querySelectorAll('.nn-tab').forEach((b) => b.classList.remove('active'));
                document.querySelectorAll('.nn-tab-content').forEach((p) => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(targetId)?.classList.add('active');
            });
        });
    }
}
//# sourceMappingURL=nn-tabs.js.map