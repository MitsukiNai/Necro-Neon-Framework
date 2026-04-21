// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-navbar component
// Scrollspy, breadcrumb, district switcher UI
// ================================================================
import { escapeHtml, sanitizeUrl } from '../security/index.js';
/**
 * NNScrollspy — highlights navbar links as the user scrolls.
 *
 * Uses IntersectionObserver (not scroll events) for performance.
 *
 * @example
 * const spy = new NNScrollspy({
 *   sectionSelector: 'section[id]',
 *   linkSelector: '.navbar-links a',
 * });
 * spy.destroy(); // clean up when done
 */
export class NNScrollspy {
    constructor(opts = {}) {
        this._activeId = '';
        const { sectionSelector = 'section[id]', linkSelector = '.navbar-links a', offset = 80, onChange, } = opts;
        this.onChange = onChange;
        this.links = document.querySelectorAll(linkSelector);
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this._activate(entry.target.id);
                }
            });
        }, { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 });
        document.querySelectorAll(sectionSelector).forEach((el) => {
            this.observer.observe(el);
        });
    }
    _activate(id) {
        if (id === this._activeId)
            return;
        this._activeId = id;
        this.links.forEach((a) => {
            const href = a.getAttribute('href') ?? '';
            a.classList.toggle('active', href === `#${id}`);
            a.setAttribute('aria-current', href === `#${id}` ? 'true' : 'false');
        });
        this.onChange?.(id);
    }
    destroy() {
        this.observer.disconnect();
    }
    get activeId() { return this._activeId; }
}
/**
 * NNNavbar — builds a sticky district navbar.
 *
 * @example
 * new NNNavbar(document.getElementById('site-nav')!, {
 *   logo: 'NECRO-NEON',
 *   items: [
 *     { label: 'Home',       href: '#home' },
 *     { label: 'Components', href: '#components' },
 *   ],
 * });
 */
export class NNNavbar {
    constructor(root, opts) {
        this.el = root;
        root.className = 'district-navbar';
        // Logo
        const logo = document.createElement('a');
        logo.className = 'navbar-logo';
        logo.textContent = escapeHtml(opts.logo);
        logo.href = sanitizeUrl('#home') || '#';
        root.appendChild(logo);
        // Links
        const ul = document.createElement('ul');
        ul.className = 'navbar-links';
        ul.setAttribute('role', 'list');
        opts.items.forEach((item) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const safeHref = sanitizeUrl(item.href);
            a.href = safeHref || '#';
            a.textContent = escapeHtml(item.label);
            if (item.external) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            li.appendChild(a);
            ul.appendChild(li);
        });
        root.appendChild(ul);
        if (opts.scrollspy !== false) {
            this.spy = new NNScrollspy();
        }
    }
    destroy() {
        this.spy?.destroy();
    }
}
/**
 * createBreadcrumb — builds a `<nav class="nn-breadcrumb">` element.
 *
 * @example
 * root.appendChild(createBreadcrumb([
 *   { label: 'Home', href: '/' },
 *   { label: 'Zones', href: '/zones' },
 *   { label: 'Tokyo Night' },
 * ]));
 */
export function createBreadcrumb(items) {
    const nav = document.createElement('nav');
    nav.className = 'nn-breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    ol.style.cssText = 'display:flex;align-items:center;gap:.4rem;list-style:none;margin:0;padding:0';
    items.forEach((item, i) => {
        const li = document.createElement('li');
        const isLast = i === items.length - 1;
        if (item.href && !isLast) {
            const a = document.createElement('a');
            a.href = sanitizeUrl(item.href) || '#';
            a.textContent = escapeHtml(item.label);
            li.appendChild(a);
        }
        else {
            const span = document.createElement('span');
            span.className = isLast ? 'bc-active' : '';
            span.textContent = escapeHtml(item.label);
            if (isLast)
                span.setAttribute('aria-current', 'page');
            li.appendChild(span);
        }
        ol.appendChild(li);
        if (!isLast) {
            const sep = document.createElement('li');
            sep.setAttribute('aria-hidden', 'true');
            const s = document.createElement('span');
            s.textContent = '/';
            sep.appendChild(s);
            ol.appendChild(sep);
        }
    });
    nav.appendChild(ol);
    return nav;
}
// ---- Smooth scroll helper ----------------------------------------
/**
 * smoothScrollTo — scrolls to a CSS selector with offset support.
 * Safe: validates selector before use.
 *
 * @example
 * smoothScrollTo('#components', 70);
 */
export function smoothScrollTo(selector, offset = 0) {
    // Only allow simple hash selectors or class selectors to prevent injection
    if (!/^[#.][a-zA-Z0-9_-]+$/.test(selector))
        return;
    const el = document.querySelector(selector);
    if (!el)
        return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}
//# sourceMappingURL=nn-navbar.js.map