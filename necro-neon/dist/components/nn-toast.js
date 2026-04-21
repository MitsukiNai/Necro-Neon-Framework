// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-toast component
// ================================================================
import { escapeHtml } from '../security/index.js';
const ICONS = {
    primary: 'ℹ',
    danger: '☠',
    warn: '⚠',
    safe: '✔',
};
/**
 * NNToast — programmatic toast notification system.
 *
 * Requires a `<div id="toast-stack">` element in your HTML.
 *
 * @example
 * const toast = new NNToast();
 * toast.show({ title: 'SYSTEM', message: 'Connection established.', type: 'safe' });
 */
export class NNToast {
    constructor(stackId = 'toast-stack') {
        const el = document.getElementById(stackId);
        if (!el) {
            const created = document.createElement('div');
            created.id = stackId;
            created.className = 'nn-toast-stack';
            document.body.appendChild(created);
            this.stack = created;
        }
        else {
            this.stack = el;
        }
    }
    show(opts) {
        const { title, message, type = 'primary', duration = 4000 } = opts;
        const icon = ICONS[type] ?? '·';
        const el = document.createElement('div');
        el.className = `nn-toast toast-${type}`;
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-live', 'polite');
        // Use safe text nodes — never interpolate user content into innerHTML
        const iconSpan = document.createElement('span');
        iconSpan.className = 'nn-toast-icon';
        iconSpan.textContent = icon;
        const body = document.createElement('div');
        body.className = 'nn-toast-body';
        const titleDiv = document.createElement('div');
        titleDiv.className = 'nn-toast-title';
        titleDiv.textContent = escapeHtml(title); // safe escape
        const msgDiv = document.createElement('div');
        msgDiv.className = 'nn-toast-msg';
        msgDiv.textContent = escapeHtml(message); // safe escape
        body.appendChild(titleDiv);
        body.appendChild(msgDiv);
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'nn-toast-close';
        closeBtn.setAttribute('aria-label', 'Dismiss notification');
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => this._dismiss(el));
        el.appendChild(iconSpan);
        el.appendChild(body);
        el.appendChild(closeBtn);
        this.stack.appendChild(el);
        // Auto-dismiss
        setTimeout(() => { el.style.opacity = '0'; }, duration);
        setTimeout(() => { el.remove(); }, duration + 400);
        return el;
    }
    _dismiss(el) {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 400);
    }
}
//# sourceMappingURL=nn-toast.js.map