// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — District Manager
// Controls the active visual "district" on the <html> or any element
// ================================================================

import type { District, DistrictSwitcherOptions } from '../types/index.js';

/** Neon primary colour per district — used to sync rain/effects. */
export const DISTRICT_COLORS: Record<District, string> = {
  'tokyo-night': '#00eaff',
  ghoul:         '#9d00ff',
  ritual:        '#ffd700',
  void:          '#ff2d78',
};

/** City canvas color data per district. */
export interface DistrictCityColors {
  sky: string;
  mid: string;
  neon: string[];
  glow: string; // partial rgba prefix e.g. 'rgba(0,234,255,'
}

export const DISTRICT_CITY_COLORS: Record<District, DistrictCityColors> = {
  'tokyo-night': {
    sky:  '#000810', mid: '#000d18',
    neon: ['#00eaff','#ff2d78','#ffd700','#00ff88','#9d00ff'],
    glow: 'rgba(0,234,255,',
  },
  ghoul: {
    sky:  '#060003', mid: '#0a0008',
    neon: ['#9d00ff','#ff2d78','#cc0018','#ff8c00','#550080'],
    glow: 'rgba(157,0,255,',
  },
  ritual: {
    sky:  '#050203', mid: '#090405',
    neon: ['#ffd700','#cc0018','#ff8c00','#ff2d78','#aa8800'],
    glow: 'rgba(255,215,0,',
  },
  void: {
    sky:  '#000000', mid: '#020002',
    neon: ['#333333','#ff2d78','#1a1a1a','#220011','#111111'],
    glow: 'rgba(255,45,120,',
  },
};

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
export class DistrictManager {
  private static _instance: DistrictManager;
  private _current: District = 'tokyo-night';
  private _listeners: Set<DistrictListener> = new Set();
  private _root: HTMLElement;

  private constructor(options: DistrictSwitcherOptions = {}) {
    this._root = document.documentElement;

    // Resolve initial district: option > data-district attr > default
    const attrVal = this._root.getAttribute('data-district');
    const initial: District =
      options.initial ??
      (this._isValidDistrict(attrVal) ? (attrVal as District) : 'tokyo-night');

    if (options.onChange) this._listeners.add(options.onChange);

    this._apply(initial);
  }

  static getInstance(options?: DistrictSwitcherOptions): DistrictManager {
    if (!DistrictManager._instance) {
      DistrictManager._instance = new DistrictManager(options);
    }
    return DistrictManager._instance;
  }

  /** Returns the currently active district. */
  get current(): District {
    return this._current;
  }

  /** Returns the primary neon colour for the current district. */
  get primaryColor(): string {
    return DISTRICT_COLORS[this._current];
  }

  /** Returns city color data for the current district. */
  get cityColors(): DistrictCityColors {
    return DISTRICT_CITY_COLORS[this._current];
  }

  /**
   * Switch to a new district.
   * Updates the `data-district` attribute on `<html>` and notifies listeners.
   */
  set(district: District): void {
    if (district === this._current) return;
    this._apply(district);
  }

  /**
   * Register a callback that fires whenever the district changes.
   * Returns an unsubscribe function.
   */
  onChange(cb: DistrictListener): () => void {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  /** Cycles through districts in order. */
  cycle(): void {
    const all: District[] = ['tokyo-night', 'ghoul', 'ritual', 'void'];
    const idx = all.indexOf(this._current);
    this.set(all[(idx + 1) % all.length]);
  }

  // ---- private ----

  private _apply(district: District): void {
    this._current = district;
    this._root.setAttribute('data-district', district);
    this._listeners.forEach((cb) => cb(district));
  }

  private _isValidDistrict(v: string | null): v is District {
    return v === 'tokyo-night' || v === 'ghoul' || v === 'ritual' || v === 'void';
  }
}
