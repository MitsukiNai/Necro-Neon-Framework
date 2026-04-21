export interface ParallaxOptions {
    /** Horizontal intensity multiplier. Default 0.4. */
    intensityX?: number;
    /** Vertical intensity multiplier. Default 0.3. */
    intensityY?: number;
    /** Max rotation in degrees. Default 12. */
    maxX?: number;
    /** Max rotation in degrees. Default 8. */
    maxY?: number;
}
/**
 * NNParallax — moves a target element in response to mouse position.
 * Used for the city-hero canvas background drift.
 *
 * @example
 * const p = new NNParallax(canvas, { intensityX: 0.6, intensityY: 0.4 });
 * p.destroy(); // removes listener
 */
export declare class NNParallax {
    private readonly target;
    private readonly opts;
    private readonly handler;
    constructor(target: HTMLElement, opts?: ParallaxOptions);
    destroy(): void;
}
/**
 * staggerGlitch — staggers the animation-delay of `.glitch` elements
 * so they don't all fire at the same time.
 *
 * @example
 * staggerGlitch();                    // all .glitch in document
 * staggerGlitch(mySection, 0.3);      // custom root & step
 */
export declare function staggerGlitch(root?: HTMLElement | Document, stepSeconds?: number): void;
/**
 * addScanlines — injects a fixed scanline overlay `<div>` over the page.
 * Uses CSS class `nn-scanlines` which must be defined in your stylesheet.
 *
 * @example
 * const overlay = addScanlines();
 * overlay.remove(); // remove later
 */
export declare function addScanlines(): HTMLElement;
/**
 * addGrain — injects a CSS-animated grain overlay using SVG feTurbulence.
 * Appends to `<body>` and returns the element.
 */
export declare function addGrain(opacity?: number): HTMLElement;
//# sourceMappingURL=utils.d.ts.map