// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Progress, Spinner, Avatar components
// ================================================================
import { escapeHtml } from '../security/index.js';
// ---- Progress Bar ------------------------------------------------
/**
 * NNProgress — creates and controls a neon progress bar.
 *
 * @example
 * const bar = new NNProgress(container, { label: 'Loading', value: 0, color: 'primary' });
 * bar.setValue(72);
 */
export class NNProgress {
    constructor(root, opts) {
        this._value = Math.min(100, Math.max(0, opts.value));
        const color = opts.color ?? 'primary';
        root.className = `nn-progress-wrapper progress-${color}`;
        if (opts.label) {
            const labelRow = document.createElement('div');
            labelRow.className = 'nn-progress-label';
            const labelSpan = document.createElement('span');
            labelSpan.textContent = escapeHtml(opts.label);
            this.valueLabel = document.createElement('span');
            this.valueLabel.textContent = `${this._value}%`;
            labelRow.appendChild(labelSpan);
            labelRow.appendChild(this.valueLabel);
            root.appendChild(labelRow);
        }
        const track = document.createElement('div');
        track.className = 'nn-progress';
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', String(this._value));
        this.fill = document.createElement('div');
        this.fill.className = 'nn-progress-fill';
        this.fill.style.width = `${this._value}%`;
        track.appendChild(this.fill);
        root.appendChild(track);
    }
    setValue(value) {
        this._value = Math.min(100, Math.max(0, value));
        this.fill.style.width = `${this._value}%`;
        this.fill.closest('[role="progressbar"]')?.setAttribute('aria-valuenow', String(this._value));
        if (this.valueLabel)
            this.valueLabel.textContent = `${this._value}%`;
    }
    get value() { return this._value; }
}
// ---- Spinner (Loader) --------------------------------------------
const SIZE_MAP = {
    xs: '1rem', sm: '1.5rem', md: '2rem', lg: '3rem', xl: '4rem'
};
/**
 * NNSpinner — creates a neon loading spinner.
 *
 * @example
 * const spinner = new NNSpinner(container, { size: 'md', color: 'primary', label: 'Loading...' });
 * spinner.show();
 * spinner.hide();
 */
export class NNSpinner {
    constructor(root, opts = {}) {
        const { size = 'md', color = 'primary', label = 'Loading' } = opts;
        const dim = SIZE_MAP[size];
        const wrapper = document.createElement('div');
        wrapper.className = 'nn-spinner-wrapper';
        wrapper.setAttribute('role', 'status');
        wrapper.setAttribute('aria-label', escapeHtml(label));
        const ring = document.createElement('div');
        ring.className = `nn-spinner spinner-${color}`;
        ring.style.width = dim;
        ring.style.height = dim;
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = escapeHtml(label);
        wrapper.appendChild(ring);
        wrapper.appendChild(srText);
        root.appendChild(wrapper);
        this.el = wrapper;
    }
    show() { this.el.style.display = 'flex'; }
    hide() { this.el.style.display = 'none'; }
}
// ---- Avatar & Profile Card ----------------------------------------
const AVATAR_SIZE_MAP = {
    xs: '1.75rem', sm: '2.25rem', md: '3rem', lg: '4rem', xl: '6rem'
};
/**
 * NNAvatar — creates a user avatar with optional status indicator.
 *
 * @example
 * const avatar = new NNAvatar(container, { initials: 'NK', color: 'primary', status: 'online' });
 */
export class NNAvatar {
    constructor(root, opts = {}) {
        const { src, initials = '?', size = 'md', color = 'primary', status } = opts;
        const dim = AVATAR_SIZE_MAP[size];
        const wrapper = document.createElement('div');
        wrapper.className = `nn-avatar avatar-${color}`;
        wrapper.style.width = dim;
        wrapper.style.height = dim;
        wrapper.setAttribute('role', 'img');
        wrapper.setAttribute('aria-label', escapeHtml(initials));
        if (src) {
            const img = document.createElement('img');
            img.src = src; // URL safety handled externally; set alt text
            img.alt = escapeHtml(initials);
            img.loading = 'lazy';
            wrapper.appendChild(img);
        }
        else {
            wrapper.textContent = escapeHtml(initials.substring(0, 2));
        }
        if (status) {
            const dot = document.createElement('span');
            dot.className = `nn-avatar-status status-${status}`;
            wrapper.appendChild(dot);
        }
        root.appendChild(wrapper);
        this.el = wrapper;
    }
}
// ---- Badge (static helper) ----------------------------------------
const COLOR_MAP = {
    primary: 'badge-primary',
    accent: 'badge-accent',
    danger: 'badge-danger',
    warn: 'badge-warn',
    safe: 'badge-safe',
    purple: 'badge-purple',
    ghost: 'badge-ghost',
};
/**
 * createBadge — factory for inline `<span class="nn-badge">` elements.
 *
 * @example
 * container.appendChild(createBadge('LIVE', 'danger', true));
 */
export function createBadge(text, color = 'primary', dot = false) {
    const span = document.createElement('span');
    span.className = `nn-badge ${COLOR_MAP[color]}${dot ? ' badge-dot' : ''}`;
    span.textContent = escapeHtml(text);
    return span;
}
//# sourceMappingURL=nn-ui.js.map