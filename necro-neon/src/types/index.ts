// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Types
// 呪われたネオン都市 — Infestation Edition
// ================================================================

/** The four visual "districts" — each overrides CSS variables globally. */
export type District = 'tokyo-night' | 'ghoul' | 'ritual' | 'void';

/** Semantic color roles used across all components. */
export type NNColor = 'primary' | 'accent' | 'danger' | 'warn' | 'safe' | 'purple' | 'ghost';

/** Component size tokens. */
export type NNSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Button variant tokens. */
export type ButtonVariant =
  | 'neon'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'safe'
  | 'glass'
  | 'glitch'
  | 'ritual'
  | 'solid';

/** Card variant tokens. */
export type CardVariant =
  | 'default'
  | 'glass'
  | 'horror'
  | 'shrine'
  | 'data'
  | 'hologram';

/** Panel / window variant tokens. */
export type PanelVariant = 'terminal' | 'glitch-window' | 'shrine';

/** Toast notification types. */
export type ToastType = 'primary' | 'danger' | 'warn' | 'safe';

/** City backdrop render style. */
export type CityStyle = 'neon' | 'ruined' | 'ghoul' | 'ritual';

// ---- Component Option Bags ----------------------------------------

export interface DistrictSwitcherOptions {
  /** Initial district. Defaults to 'tokyo-night'. */
  initial?: District;
  /** Callback fired after every district change. */
  onChange?: (district: District) => void;
}

export interface RainOptions {
  count?: number;   // Default 180
  speed?: number;   // Default 13
  angle?: number;   // Degrees, default 0
  color?: string;   // CSS color
  active?: boolean; // Default true
}

export interface ToastOptions {
  title: string;
  message: string;
  type?: ToastType;
  /** Auto-dismiss delay in ms. Default 4000. */
  duration?: number;
}

export interface ModalOptions {
  id: string;
  title?: string;
  content?: string | HTMLElement;
  onClose?: () => void;
}

export interface ProgressOptions {
  label?: string;
  value: number;    // 0–100
  color?: NNColor;
  animated?: boolean;
}

export interface AvatarOptions {
  src?: string;
  initials?: string;
  size?: NNSize;
  color?: NNColor;
  status?: 'online' | 'offline' | 'warn' | 'danger';
}

export interface TabsOptions {
  tabs: Array<{ id: string; label: string; content: string | HTMLElement }>;
  activeId?: string;
  onChange?: (id: string) => void;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string | HTMLElement;
  open?: boolean;
}

export interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  body?: string;
  color?: NNColor;
}

export interface SpinnerOptions {
  size?: NNSize;
  color?: NNColor;
  label?: string;
}

// ---- Security Types -----------------------------------------------

/** Result returned by all sanitize/validate helpers. */
export interface ValidationResult {
  valid: boolean;
  value: string;
  errors: string[];
}

export interface CSRFTokenStore {
  token: string;
  expires: number; // Unix ms
}
