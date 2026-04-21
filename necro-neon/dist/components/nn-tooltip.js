// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-tooltip component
// ================================================================
import { escapeHtml } from '../security/index.js';
/**
 * NNTooltip — attaches a neon tooltip to any element.
 *
 * @example
 * new NNTooltip(btn, { text: 'Delete this sector', position: 'top' });
 *
 * @example — HTML-driven (bind all [data-tooltip] elements):
 * NNTooltip.initAll();
 */
export class NNTooltip {
    constructor(target, opts) {
        this._showTimeout = null;
        const { text, position = 'top', delay = 180 } = opts;
        this.target = target;
        this.delay = delay;
        // Create tooltip element
        const tip = document.createElement('div');
        tip.className = `nn-tooltip tooltip-${position}`;
        tip.textContent = escapeHtml(text);
        tip.setAttribute('role', 'tooltip');
        tip.id = `tooltip-${Math.random().toString(36).slice(2, 9)}`;
        document.body.appendChild(tip);
        this.tip = tip;
        // ARIA
        target.setAttribute('aria-describedby', tip.id);
        // Events
        target.addEventListener('mouseenter', () => this._show());
        target.addEventListener('mouseleave', () => this._hide());
        target.addEventListener('focusin', () => this._show());
        target.addEventListener('focusout', () => this._hide());
    }
    _show() {
        this._showTimeout = setTimeout(() => {
            const rect = this.target.getBoundingClientRect();
            const pos = this.tip.className.includes('tooltip-bottom') ? 'bottom'
                : this.tip.className.includes('tooltip-left') ? 'left'
                    : this.tip.className.includes('tooltip-right') ? 'right'
                        : 'top';
            const { scrollX, scrollY } = window;
            switch (pos) {
                case 'top':
                    this.tip.style.left = `${rect.left + scrollX + rect.width / 2}px`;
                    this.tip.style.top = `${rect.top + scrollY - 8}px`;
                    this.tip.style.transform = 'translateX(-50%) translateY(-100%)';
                    break;
                case 'bottom':
                    this.tip.style.left = `${rect.left + scrollX + rect.width / 2}px`;
                    this.tip.style.top = `${rect.bottom + scrollY + 8}px`;
                    this.tip.style.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    this.tip.style.left = `${rect.left + scrollX - 8}px`;
                    this.tip.style.top = `${rect.top + scrollY + rect.height / 2}px`;
                    this.tip.style.transform = 'translateX(-100%) translateY(-50%)';
                    break;
                case 'right':
                    this.tip.style.left = `${rect.right + scrollX + 8}px`;
                    this.tip.style.top = `${rect.top + scrollY + rect.height / 2}px`;
                    this.tip.style.transform = 'translateY(-50%)';
                    break;
            }
            this.tip.classList.add('visible');
        }, this.delay);
    }
    _hide() {
        if (this._showTimeout)
            clearTimeout(this._showTimeout);
        this.tip.classList.remove('visible');
    }
    destroy() {
        if (this._showTimeout)
            clearTimeout(this._showTimeout);
        this.tip.remove();
    }
    /** Attach tooltips to all `[data-tooltip]` elements in the document. */
    static initAll(root = document) {
        root.querySelectorAll('[data-tooltip]').forEach((el) => {
            const text = el.getAttribute('data-tooltip') ?? '';
            const pos = (el.getAttribute('data-tooltip-pos') ?? 'top');
            new NNTooltip(el, { text, position: pos });
        });
    }
}
//# sourceMappingURL=nn-tooltip.js.map