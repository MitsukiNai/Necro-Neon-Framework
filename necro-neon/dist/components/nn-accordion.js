// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-accordion component
// ================================================================
import { escapeHtml } from '../security/index.js';
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
export class NNAccordion {
    constructor(root, items) {
        this.root = root;
        this.root.className = 'nn-accordion';
        items.forEach((item) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'nn-acc-item';
            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = item.open ? 'nn-acc-trigger open' : 'nn-acc-trigger';
            trigger.textContent = escapeHtml(item.title);
            trigger.setAttribute('aria-expanded', String(item.open ?? false));
            trigger.setAttribute('aria-controls', `acc-body-${item.id}`);
            const body = document.createElement('div');
            body.id = `acc-body-${item.id}`;
            body.className = item.open ? 'nn-acc-body open' : 'nn-acc-body';
            body.setAttribute('role', 'region');
            if (typeof item.content === 'string') {
                body.textContent = escapeHtml(item.content);
            }
            else {
                body.appendChild(item.content);
            }
            trigger.addEventListener('click', () => this._toggle(trigger, body));
            wrapper.appendChild(trigger);
            wrapper.appendChild(body);
            this.root.appendChild(wrapper);
        });
    }
    _toggle(trigger, body) {
        const isOpen = trigger.classList.contains('open');
        trigger.classList.toggle('open', !isOpen);
        body.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
    }
    /** Bind all existing `.nn-acc-trigger` elements in the document. */
    static init() {
        document.querySelectorAll('.nn-acc-trigger').forEach((btn) => {
            btn.addEventListener('click', () => {
                const body = btn.nextElementSibling;
                if (!body)
                    return;
                const isOpen = btn.classList.contains('open');
                btn.classList.toggle('open', !isOpen);
                body.classList.toggle('open', !isOpen);
                btn.setAttribute('aria-expanded', String(!isOpen));
            });
        });
    }
}
//# sourceMappingURL=nn-accordion.js.map