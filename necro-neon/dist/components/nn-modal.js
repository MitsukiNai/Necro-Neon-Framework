// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-modal component
// ================================================================
import { escapeHtml } from '../security/index.js';
/**
 * NNModal — programmatic modal / ritual-dialog system.
 *
 * @example
 * const modal = new NNModal();
 * modal.open('my-modal');
 * modal.create({ id: 'confirm', title: 'CONFIRM', content: 'Are you sure?' });
 */
export class NNModal {
    constructor() {
        // Close modals when clicking the overlay background
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('nn-modal-overlay')) {
                target.classList.remove('open');
            }
        });
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.nn-modal-overlay.open').forEach((m) => {
                    m.classList.remove('open');
                });
            }
        });
    }
    /** Open an existing modal by ID. */
    open(id) {
        document.getElementById(id)?.classList.add('open');
    }
    /** Close an existing modal by ID. */
    close(id) {
        const el = document.getElementById(id);
        el?.classList.remove('open');
        if (el) {
            const opts = el._nnModalOpts;
            opts?.onClose?.();
        }
    }
    /**
     * Programmatically create and open a modal.
     * The modal is appended to `<body>` and removed on close.
     */
    create(opts) {
        const { id, title, content, onClose } = opts;
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'nn-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        if (title)
            overlay.setAttribute('aria-label', escapeHtml(title));
        const box = document.createElement('div');
        box.className = 'nn-modal';
        // Header
        const header = document.createElement('div');
        header.className = 'nn-modal-header';
        const titleEl = document.createElement('div');
        titleEl.className = 'nn-modal-title';
        titleEl.textContent = title ? escapeHtml(title) : '';
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'nn-modal-close';
        closeBtn.setAttribute('aria-label', 'Close dialog');
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
            onClose?.();
        });
        header.appendChild(titleEl);
        header.appendChild(closeBtn);
        // Body
        const body = document.createElement('div');
        body.className = 'nn-modal-body';
        if (typeof content === 'string') {
            body.textContent = escapeHtml(content);
        }
        else if (content instanceof HTMLElement) {
            body.appendChild(content);
        }
        box.appendChild(header);
        box.appendChild(body);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        // Store opts for onClose
        overlay._nnModalOpts = opts;
        // Open on next frame
        requestAnimationFrame(() => overlay.classList.add('open'));
        return overlay;
    }
}
//# sourceMappingURL=nn-modal.js.map