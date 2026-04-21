export interface ScrollspyOptions {
    /** CSS selector for sections to observe. Default: 'section[id]'. */
    sectionSelector?: string;
    /** CSS selector for nav links. Default: '.navbar-links a'. */
    linkSelector?: string;
    /** Offset in px from top before activating. Default: 80. */
    offset?: number;
    /** Called whenever the active section changes. */
    onChange?: (id: string) => void;
}
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
export declare class NNScrollspy {
    private readonly links;
    private readonly observer;
    private readonly onChange?;
    private _activeId;
    constructor(opts?: ScrollspyOptions);
    private _activate;
    destroy(): void;
    get activeId(): string;
}
export interface NavItem {
    label: string;
    href: string;
    external?: boolean;
}
export interface NavbarOptions {
    logo: string;
    items: NavItem[];
    /** Whether to attach a scrollspy to the nav links. Default true. */
    scrollspy?: boolean;
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
export declare class NNNavbar {
    private readonly el;
    private spy?;
    constructor(root: HTMLElement, opts: NavbarOptions);
    destroy(): void;
}
export interface BreadcrumbItem {
    label: string;
    href?: string;
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
export declare function createBreadcrumb(items: BreadcrumbItem[]): HTMLElement;
/**
 * smoothScrollTo — scrolls to a CSS selector with offset support.
 * Safe: validates selector before use.
 *
 * @example
 * smoothScrollTo('#components', 70);
 */
export declare function smoothScrollTo(selector: string, offset?: number): void;
//# sourceMappingURL=nn-navbar.d.ts.map