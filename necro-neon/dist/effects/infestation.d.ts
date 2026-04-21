export interface InfestationOptions {
    /** Spread rate 1–10. Default 5. */
    rate?: number;
}
/**
 * InfestationEngine — renders animated blood-vein overlay on a canvas.
 *
 * @example
 * const inf = new InfestationEngine(document.getElementById('inf-canvas')!);
 * inf.start();
 */
export declare class InfestationEngine {
    private readonly canvas;
    private readonly ctx;
    private _active;
    private _amount;
    private _rate;
    private _rafId;
    private _resizeObserver;
    constructor(canvas: HTMLCanvasElement, opts?: InfestationOptions);
    start(): void;
    stop(): void;
    destroy(): void;
    get isActive(): boolean;
    setRate(rate: number): void;
    private _resize;
    private _loop;
}
export interface GlitchOptions {
    /** Intensity 1–10. Default 5. */
    intensity?: number;
}
/**
 * GlitchEngine — applies random glitch distortions to the document body.
 *
 * @example
 * const glitch = new GlitchEngine({ intensity: 6 });
 * glitch.burst();   // single burst
 * glitch.massive(); // dramatic mass glitch
 */
export declare class GlitchEngine {
    private intensity;
    constructor(opts?: GlitchOptions);
    setIntensity(v: number): void;
    /** Single short glitch burst. */
    burst(): void;
    /** Extended multi-frame mass glitch. */
    massive(): void;
}
//# sourceMappingURL=infestation.d.ts.map