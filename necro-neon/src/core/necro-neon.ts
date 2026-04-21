// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Core Orchestrator
// The main entry class that wires all systems together
// ================================================================

import type { District, RainOptions } from '../types/index.js';
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
export class NecroNeon {
  readonly district:    DistrictManager;
  readonly city:        CityBackdropManager;
  readonly toast:       NNToast;
  readonly modal:       NNModal;
  readonly glitch:      GlitchEngine;

  private _rain?: RainEngine;
  private _infestation?: InfestationEngine;
  private _scrollspy?: NNScrollspy;
  private _parallax?: NNParallax;

  constructor(opts: NecroNeonOptions = {}) {
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
      if (opts.autoInit !== false) this._autoInit();

      // Sync rain color with district changes
      this.district.onChange((d) => {
        this._rain?.setColor(this.district.primaryColor);
        // Redraw all visible city canvases
        ['city-ruined','city-neon','city-ghoul','city-ritual'].forEach((id) => {
          const style = id.replace('city-', '') as import('../types/index.js').CityStyle;
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

  get rain(): RainEngine | undefined { return this._rain; }
  get infestation(): InfestationEngine | undefined { return this._infestation; }

  // ---- Private setup ----

  private _resolveCanvas(ref: HTMLCanvasElement | string | false | undefined): HTMLCanvasElement | null {
    if (!ref) return null;
    if (typeof ref === 'string') {
      const el = document.getElementById(ref);
      return el instanceof HTMLCanvasElement ? el : null;
    }
    return ref;
  }

  private _initRain(opts: NecroNeonOptions): void {
    if (opts.rainCanvas === false) return;
    const cvs = this._resolveCanvas(opts.rainCanvas ?? 'rain-canvas');
    if (!cvs) return;
    this._rain = new RainEngine(cvs, {
      color: this.district.primaryColor,
      ...opts.rainOptions,
    });
    this._rain.start();
  }

  private _initInfestation(opts: NecroNeonOptions): void {
    if (opts.infestationCanvas === false) return;
    const cvs = this._resolveCanvas(opts.infestationCanvas ?? 'infestation-canvas');
    if (!cvs) return;
    this._infestation = new InfestationEngine(cvs);
    // Does NOT auto-start — call nn.infestation.start() explicitly
  }

  private _initHero(opts: NecroNeonOptions): void {
    if (opts.heroCanvas === false) return;
    const cvs = this._resolveCanvas(opts.heroCanvas ?? 'city-hero-canvas');
    if (!cvs) return;
    this._parallax = new NNParallax(cvs);
    this.city.draw('city-hero-canvas', 'neon', this.district.current);
  }

  private _autoInit(): void {
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

  private _redrawAllCities(): void {
    const d = this.district.current;
    this.city.draw('city-ruined',     'ruined', d);
    this.city.draw('city-neon',       'neon',   d);
    this.city.draw('city-ghoul',      'ghoul',  d);
    this.city.draw('city-ritual',     'ritual', d);
    this.city.draw('city-hero-canvas','neon',   d);
  }

  /** Clean up all engines and observers. */
  destroy(): void {
    this._rain?.destroy();
    this._infestation?.destroy();
    this._scrollspy?.destroy();
    this._parallax?.destroy();
  }
}
