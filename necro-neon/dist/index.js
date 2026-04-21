// ================================================================
// NECRO-NEON FRAMEWORK v3.0
// 呪われたネオン都市 — Infestation Edition
//
// Public API — import everything from 'necro-neon'
// ================================================================
// ---- Core -------------------------------------------------------
export { NecroNeon } from './core/necro-neon.js';
export { DistrictManager, DISTRICT_COLORS, DISTRICT_CITY_COLORS } from './core/district.js';
// ---- Security ---------------------------------------------------
export { escapeHtml, stripHtml, safeTextNode, sanitizeUrl, hasSQLInjection, sanitizeSQLParam, hasPathTraversal, validateField, validateEmail, generateCSRFToken, getCSRFToken, validateCSRFToken, rateLimit, generateNonce, getRecommendedCSP, } from './security/index.js';
// ---- Effects ----------------------------------------------------
export { RainEngine } from './effects/rain.js';
export { drawCity, CityBackdropManager } from './effects/city.js';
export { InfestationEngine, GlitchEngine } from './effects/infestation.js';
export { NNParallax, staggerGlitch, addScanlines, addGrain } from './effects/utils.js';
// ---- Components -------------------------------------------------
export { NNToast } from './components/nn-toast.js';
export { NNModal } from './components/nn-modal.js';
export { NNTabs } from './components/nn-tabs.js';
export { NNAccordion } from './components/nn-accordion.js';
export { NNProgress, NNSpinner, NNAvatar, createBadge } from './components/nn-ui.js';
export { NNTable } from './components/nn-table.js';
export { NNForm } from './components/nn-form.js';
export { NNNavbar, NNScrollspy, createBreadcrumb, smoothScrollTo } from './components/nn-navbar.js';
export { NNTerminal, typeText, initTerminalTyping } from './components/nn-terminal.js';
export { NNTimeline } from './components/nn-timeline.js';
export { NNTooltip } from './components/nn-tooltip.js';
export { NNCard, NNPanel, createButton } from './components/nn-card.js';
// ---- Utils ------------------------------------------------------
export { $, $$, el, debounce, throttle, clamp, lerp, mapRange, hexToRgb, hexToRgbString, once, onReady, sessionGet, sessionSet, uid, } from './utils/index.js';
//# sourceMappingURL=index.js.map