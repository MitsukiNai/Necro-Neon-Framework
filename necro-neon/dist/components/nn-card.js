// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-card & nn-panel components
// ================================================================
import { escapeHtml, sanitizeUrl } from '../security/index.js';
const CARD_COLOR_CLASS = {
    primary: 'neon-box',
    accent: 'neon-box-accent',
    danger: 'neon-box-danger',
    warn: 'neon-box-warn',
    safe: 'neon-box-safe',
    purple: '',
    ghost: '',
};
/**
 * NNCard — creates a styled card element.
 *
 * @example
 * root.appendChild(new NNCard({
 *   variant: 'glass',
 *   title:   'SECTOR 7',
 *   body:    'Quarantine active.',
 *   color:   'danger',
 * }).el);
 */
export class NNCard {
    constructor(opts = {}) {
        const { variant = 'default', title, subtitle, body, footer, imageSrc, imageAlt = '', className = '', color, } = opts;
        const el = document.createElement('div');
        const variantClass = variant === 'default' ? 'nn-card' : `nn-card card-${variant}`;
        const colorClass = color ? (CARD_COLOR_CLASS[color] ?? '') : '';
        el.className = [variantClass, colorClass, className].filter(Boolean).join(' ');
        // Image
        if (imageSrc) {
            const safeUrl = sanitizeUrl(imageSrc);
            if (safeUrl) {
                const img = document.createElement('img');
                img.src = safeUrl;
                img.alt = escapeHtml(imageAlt);
                img.loading = 'lazy';
                img.className = 'nn-card-img';
                el.appendChild(img);
            }
        }
        // Content area
        const content = document.createElement('div');
        content.className = 'nn-card-content';
        if (title) {
            const h = document.createElement('div');
            h.className = 'nn-card-title nn-h4 neon-glow';
            h.textContent = escapeHtml(title);
            content.appendChild(h);
        }
        if (subtitle) {
            const sub = document.createElement('div');
            sub.className = 'nn-card-subtitle nn-mono nn-small';
            sub.textContent = escapeHtml(subtitle);
            content.appendChild(sub);
        }
        if (body) {
            const bodyEl = document.createElement('div');
            bodyEl.className = 'nn-card-body nn-body';
            if (typeof body === 'string') {
                bodyEl.textContent = escapeHtml(body);
            }
            else {
                bodyEl.appendChild(body);
            }
            content.appendChild(bodyEl);
        }
        el.appendChild(content);
        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'nn-card-footer';
            if (typeof footer === 'string') {
                footerEl.textContent = escapeHtml(footer);
            }
            else {
                footerEl.appendChild(footer);
            }
            el.appendChild(footerEl);
        }
        this.el = el;
    }
}
/**
 * NNPanel — creates a terminal / glitch-window / shrine panel.
 *
 * @example
 * root.appendChild(new NNPanel({
 *   variant: 'terminal',
 *   title:   'BOOT_LOG',
 *   windowDots: true,
 * }).el);
 */
export class NNPanel {
    constructor(opts = {}) {
        const { variant = 'terminal', title, windowDots = true, content, className = '' } = opts;
        const el = document.createElement('div');
        el.className = [
            variant === 'terminal' ? 'nn-panel terminal-panel' :
                variant === 'glitch-window' ? 'nn-panel glitch-window' :
                    'nn-panel shrine-panel',
            className,
        ].filter(Boolean).join(' ');
        // Bar / header
        if (title || windowDots) {
            const bar = document.createElement('div');
            bar.className = variant === 'glitch-window' ? 'window-bar' : 'terminal-bar';
            if (windowDots) {
                const dots = document.createElement('div');
                dots.className = 'terminal-dots';
                dots.setAttribute('aria-hidden', 'true');
                for (const cls of ['dot-r', 'dot-y', 'dot-g']) {
                    const d = document.createElement('span');
                    d.className = cls;
                    dots.appendChild(d);
                }
                bar.appendChild(dots);
            }
            if (title) {
                const t = document.createElement('span');
                t.className = 'nn-mono nn-micro terminal-title';
                t.textContent = escapeHtml(title);
                bar.appendChild(t);
            }
            el.appendChild(bar);
        }
        // Content
        if (content) {
            const body = document.createElement('div');
            body.className = 'terminal-body';
            if (typeof content === 'string') {
                body.textContent = escapeHtml(content);
            }
            else {
                body.appendChild(content);
            }
            el.appendChild(body);
        }
        this.el = el;
    }
}
const BTN_SIZE = {
    xs: 'btn-xs', sm: 'btn-sm', md: '', lg: 'btn-lg', xl: 'btn-xl'
};
/**
 * createButton — factory for fully typed `<button>` elements.
 *
 * @example
 * root.appendChild(createButton({
 *   label:   'EXECUTE',
 *   variant: 'danger',
 *   size:    'lg',
 *   onClick: () => triggerGlitch(),
 * }));
 */
export function createButton(opts) {
    const { label, variant = 'neon', size = 'md', icon, disabled = false, type = 'button', onClick, className = '', dataText, } = opts;
    const btn = document.createElement('button');
    btn.type = type;
    btn.disabled = disabled;
    btn.className = [
        'nn-btn',
        `btn-${variant}`,
        BTN_SIZE[size],
        variant === 'glitch' ? 'glitch' : '',
        className,
    ].filter(Boolean).join(' ');
    if (variant === 'glitch') {
        btn.setAttribute('data-text', escapeHtml(dataText ?? label));
    }
    if (icon) {
        const iconEl = document.createElement('span');
        iconEl.className = 'btn-icon';
        iconEl.setAttribute('aria-hidden', 'true');
        iconEl.textContent = icon;
        btn.appendChild(iconEl);
    }
    const labelEl = document.createElement('span');
    labelEl.textContent = escapeHtml(label);
    btn.appendChild(labelEl);
    if (onClick)
        btn.addEventListener('click', onClick);
    return btn;
}
//# sourceMappingURL=nn-card.js.map