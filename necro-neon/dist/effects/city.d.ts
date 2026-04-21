import type { CityStyle } from '../types/index.js';
import type { District } from '../types/index.js';
/** Draw a full city scene onto a canvas element. */
export declare function drawCity(canvas: HTMLCanvasElement, style: CityStyle, district: District): void;
/** Maps a canvas ID to its wrapper wrapper element for show/hide. */
export type CityCanvasId = 'city-ruined' | 'city-neon' | 'city-ghoul' | 'city-ritual' | 'city-hero-canvas';
/**
 * CityBackdropManager — controls all city canvas instances.
 *
 * @example
 * const city = new CityBackdropManager();
 * city.show('city-neon', 'neon', 'tokyo-night');
 * city.hide('city-ruined');
 */
export declare class CityBackdropManager {
    private readonly _wrapMap;
    /** Render (or re-render) a city canvas. */
    draw(canvasId: string, style: CityStyle, district: District): void;
    /** Show a city backdrop wrapper and immediately re-draw. */
    show(canvasId: string, style: CityStyle, district: District): void;
    /** Hide a city backdrop wrapper. */
    hide(canvasId: string): void;
    toggle(canvasId: string, style: CityStyle, district: District): void;
    hideAll(): void;
}
//# sourceMappingURL=city.d.ts.map