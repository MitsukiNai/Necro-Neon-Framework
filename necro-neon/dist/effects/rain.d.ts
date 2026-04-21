import type { RainOptions } from '../types/index.js';
/**
 * RainEngine — attaches an animated neon rain to a canvas element.
 *
 * @example
 * const rain = new RainEngine(document.getElementById('rain-canvas')!, {
 *   count: 180, speed: 13, color: '#00eaff'
 * });
 * rain.start();
 * rain.setColor('#9d00ff'); // sync with district
 */
export declare class RainEngine {
    private readonly canvas;
    private readonly ctx;
    private drops;
    private active;
    private color;
    private count;
    private speed;
    private angle;
    private _rafId;
    private _resizeObserver;
    constructor(canvas: HTMLCanvasElement, opts?: RainOptions);
    /** Start (or resume) the rain animation. */
    start(): void;
    /** Pause rain (canvas stays visible but frozen). */
    pause(): void;
    /** Stop rain and clear the canvas. */
    stop(): void;
    /** Destroy the engine and clean up observers. */
    destroy(): void;
    setColor(color: string): void;
    setCount(count: number): void;
    setSpeed(speed: number): void;
    setAngle(angle: number): void;
    get isActive(): boolean;
    private _resize;
    private _initDrops;
    private _loop;
}
//# sourceMappingURL=rain.d.ts.map