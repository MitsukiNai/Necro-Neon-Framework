import type { District, RainOptions } from '../types/index.js';
import { DistrictManager } from './district.js';
import { RainEngine } from '../effects/rain.js';
import { CityBackdropManager } from '../effects/city.js';
import { GlitchEngine, InfestationEngine } from '../effects/infestation.js';
import { NNToast } from '../components/nn-toast.js';
import { NNModal } from '../components/nn-modal.js';
export interface NecroNeonOptions {
    /** Initial district. Reads `data-district` attribute if unset. */
    district?: District;
    /** Rain canvas element or its ID. Pass false to disable. */
    rainCanvas?: HTMLCanvasElement | string | false;
    rainOptions?: RainOptions;
    /** Infestation canvas element or its ID. Pass false to disable. */
    infestationCanvas?: HTMLCanvasElement | string | false;
    /** Hero canvas element or its ID for parallax. Pass false to disable. */
    heroCanvas?: HTMLCanvasElement | string | false;
    /** Toast stack container ID. Default 'toast-stack'. */
    toastStackId?: string;
    /** Disable auto-init of tabs, accordions, tooltips, terminal. */
    autoInit?: boolean;
    /** Enable grain overlay. Default false. */
    grain?: boolean;
    /** Enable scanline overlay. Default false. */
    scanlines?: boolean;
}
/**
 * NecroNeon — main framework orchestrator.
 *
 * @example
 * import { NecroNeon } from 'necro-neon';
 *
 * const nn = new NecroNeon({
 *   district:       'tokyo-night',
 *   rainCanvas:     'rain-canvas',
 *   heroCanvas:     'city-hero-canvas',
 *   autoInit:       true,
 * });
 *
 * nn.district.set('ghoul');
 * nn.toast.show({ title: 'SECTOR 7', message: 'Quarantine active', type: 'danger' });
 * nn.glitch.burst();
 */
export declare class NecroNeon {
    readonly district: DistrictManager;
    readonly city: CityBackdropManager;
    readonly toast: NNToast;
    readonly modal: NNModal;
    readonly glitch: GlitchEngine;
    private _rain?;
    private _infestation?;
    private _scrollspy?;
    private _parallax?;
    constructor(opts?: NecroNeonOptions);
    get rain(): RainEngine | undefined;
    get infestation(): InfestationEngine | undefined;
    private _resolveCanvas;
    private _initRain;
    private _initInfestation;
    private _initHero;
    private _autoInit;
    private _redrawAllCities;
    /** Clean up all engines and observers. */
    destroy(): void;
}
//# sourceMappingURL=necro-neon.d.ts.map