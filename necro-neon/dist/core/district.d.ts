import type { District, DistrictSwitcherOptions } from '../types/index.js';
/** Neon primary colour per district — used to sync rain/effects. */
export declare const DISTRICT_COLORS: Record<District, string>;
/** City canvas color data per district. */
export interface DistrictCityColors {
    sky: string;
    mid: string;
    neon: string[];
    glow: string;
}
export declare const DISTRICT_CITY_COLORS: Record<District, DistrictCityColors>;
/** Listeners registered for district changes. */
type DistrictListener = (district: District) => void;
/**
 * DistrictManager — singleton that drives the global district state.
 *
 * @example
 * import { DistrictManager } from 'necro-neon/core/district';
 * const dm = DistrictManager.getInstance();
 * dm.set('ghoul');
 * dm.onChange(d => console.log('District is now:', d));
 */
export declare class DistrictManager {
    private static _instance;
    private _current;
    private _listeners;
    private _root;
    private constructor();
    static getInstance(options?: DistrictSwitcherOptions): DistrictManager;
    /** Returns the currently active district. */
    get current(): District;
    /** Returns the primary neon colour for the current district. */
    get primaryColor(): string;
    /** Returns city color data for the current district. */
    get cityColors(): DistrictCityColors;
    /**
     * Switch to a new district.
     * Updates the `data-district` attribute on `<html>` and notifies listeners.
     */
    set(district: District): void;
    /**
     * Register a callback that fires whenever the district changes.
     * Returns an unsubscribe function.
     */
    onChange(cb: DistrictListener): () => void;
    /** Cycles through districts in order. */
    cycle(): void;
    private _apply;
    private _isValidDistrict;
}
export {};
//# sourceMappingURL=district.d.ts.map