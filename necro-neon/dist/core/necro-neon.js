// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Core Orchestrator
// The main entry class that wires all systems together
// ================================================================
import { DistrictManager } from './district.js';
import { RainEngine } from '../effects/rain.js';
import { CityBackdropManager } from '../effects/city.js';
import { GlitchEngine, InfestationEngine } from '../effects/infestation.js';
import { NNScrollspy } from '../components/nn-navbar.js';
import { NNToast } from '../components/nn-toast.js';
import { NNModal } from '../components/nn-modal.js';
import { NNAccordion } from '../components/nn-accordion.js';
import { NNTabs } from '../components/nn-tabs.js';
import { NNTooltip } from '../components/nn-tooltip.js';
import { initTerminalTyping } from '../components/nn-terminal.js';
import { staggerGlitch, NNParallax } from '../effects/utils.js';
import { onReady } from '../utils/index.js';
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
export class NecroNeon {
    constructor(opts = {}) {
        // District
        this.district = DistrictManager.getInstance({ initial: opts.district });
        // City backdrops
        this.city = new CityBackdropManager();
        // Toast & Modal (always available)
        this.toast = new NNToast(opts.toastStackId);
        this.modal = new NNModal();
        // Glitch engine
        this.glitch = new GlitchEngine();
        onReady(() => {
            this._initRain(opts);
            this._initInfestation(opts);
            this._initHero(opts);
            if (opts.autoInit !== false)
                this._autoInit();
            // Sync rain color with district changes
            this.district.onChange((d) => {
                this._rain?.setColor(this.district.primaryColor);
                // Redraw all visible city canvases
                ['city-ruined', 'city-neon', 'city-ghoul', 'city-ritual'].forEach((id) => {
                    const style = id.replace('city-', '');
                    this.city.draw(id, style === 'neon' ? 'neon' : style, d);
                });
            });
            // Redraw cities and hero on resize
            window.addEventListener('resize', () => {
                this._redrawAllCities();
            }, { passive: true });
            this._redrawAllCities();
            // Glitch stagger
            staggerGlitch();
        });
    }
    get rain() { return this._rain; }
    get infestation() { return this._infestation; }
    // ---- Private setup ----
    _resolveCanvas(ref) {
        if (!ref)
            return null;
        if (typeof ref === 'string') {
            const el = document.getElementById(ref);
            return el instanceof HTMLCanvasElement ? el : null;
        }
        return ref;
    }
    _initRain(opts) {
        if (opts.rainCanvas === false)
            return;
        const cvs = this._resolveCanvas(opts.rainCanvas ?? 'rain-canvas');
        if (!cvs)
            return;
        this._rain = new RainEngine(cvs, {
            color: this.district.primaryColor,
            ...opts.rainOptions,
        });
        this._rain.start();
    }
    _initInfestation(opts) {
        if (opts.infestationCanvas === false)
            return;
        const cvs = this._resolveCanvas(opts.infestationCanvas ?? 'infestation-canvas');
        if (!cvs)
            return;
        this._infestation = new InfestationEngine(cvs);
        // Does NOT auto-start — call nn.infestation.start() explicitly
    }
    _initHero(opts) {
        if (opts.heroCanvas === false)
            return;
        const cvs = this._resolveCanvas(opts.heroCanvas ?? 'city-hero-canvas');
        if (!cvs)
            return;
        this._parallax = new NNParallax(cvs);
        this.city.draw('city-hero-canvas', 'neon', this.district.current);
    }
    _autoInit() {
        // Terminal typing
        initTerminalTyping();
        // Tabs
        NNTabs.init();
        // Accordions
        NNAccordion.init();
        // Tooltips
        NNTooltip.initAll();
        // Scrollspy
        this._scrollspy = new NNScrollspy();
    }
    _redrawAllCities() {
        const d = this.district.current;
        this.city.draw('city-ruined', 'ruined', d);
        this.city.draw('city-neon', 'neon', d);
        this.city.draw('city-ghoul', 'ghoul', d);
        this.city.draw('city-ritual', 'ritual', d);
        this.city.draw('city-hero-canvas', 'neon', d);
    }
    /** Clean up all engines and observers. */
    destroy() {
        this._rain?.destroy();
        this._infestation?.destroy();
        this._scrollspy?.destroy();
        this._parallax?.destroy();
    }
}
//# sourceMappingURL=necro-neon.js.map