// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Effects utilities
// Parallax, glitch stagger, scanlines, hero setup
// ================================================================
/**
 * NNParallax — moves a target element in response to mouse position.
 * Used for the city-hero canvas background drift.
 *
 * @example
 * const p = new NNParallax(canvas, { intensityX: 0.6, intensityY: 0.4 });
 * p.destroy(); // removes listener
 */
export class NNParallax {
    constructor(target, opts = {}) {
        this.target = target;
        this.opts = {
            intensityX: opts.intensityX ?? 0.4,
            intensityY: opts.intensityY ?? 0.3,
            maxX: opts.maxX ?? 12,
            maxY: opts.maxY ?? 8,
        };
        this.handler = (e) => {
            const rx = (e.clientX / window.innerWidth - 0.5) * this.opts.maxX;
            const ry = (e.clientY / window.innerHeight - 0.5) * this.opts.maxY;
            this.target.style.transform = [
                `translateX(${rx * this.opts.intensityX}px)`,
                `translateY(${ry * this.opts.intensityY}px)`,
                'scale(1.02)',
            ].join(' ');
        };
        window.addEventListener('mousemove', this.handler, { passive: true });
    }
    destroy() {
        window.removeEventListener('mousemove', this.handler);
        this.target.style.transform = '';
    }
}
// ---- Glitch stagger ----------------------------------------------
/**
 * staggerGlitch — staggers the animation-delay of `.glitch` elements
 * so they don't all fire at the same time.
 *
 * @example
 * staggerGlitch();                    // all .glitch in document
 * staggerGlitch(mySection, 0.3);      // custom root & step
 */
export function staggerGlitch(root = document, stepSeconds = 0.55) {
    root.querySelectorAll('.glitch').forEach((el, i) => {
        el.style.animationDelay = `${i * stepSeconds}s`;
    });
}
// ---- Scanline overlay --------------------------------------------
/**
 * addScanlines — injects a fixed scanline overlay `<div>` over the page.
 * Uses CSS class `nn-scanlines` which must be defined in your stylesheet.
 *
 * @example
 * const overlay = addScanlines();
 * overlay.remove(); // remove later
 */
export function addScanlines() {
    const el = document.createElement('div');
    el.className = 'nn-scanlines-overlay';
    el.style.cssText = [
        'position:fixed',
        'inset:0',
        'pointer-events:none',
        'z-index:9999',
        `background:repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.12) 2px,
      rgba(0,0,0,0.12) 4px
    )`,
    ].join(';');
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
}
// ---- Noise / grain overlay ----------------------------------------
/**
 * addGrain — injects a CSS-animated grain overlay using SVG feTurbulence.
 * Appends to `<body>` and returns the element.
 */
export function addGrain(opacity = 0.03) {
    const el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    el.className = 'nn-grain-overlay';
    el.style.cssText = [
        'position:fixed',
        'inset:0',
        'pointer-events:none',
        `z-index:9998`,
        `opacity:${opacity}`,
        'background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        'background-repeat:repeat',
        'background-size:256px 256px',
        'mix-blend-mode:overlay',
    ].join(';');
    document.body.appendChild(el);
    return el;
}
//# sourceMappingURL=utils.js.map