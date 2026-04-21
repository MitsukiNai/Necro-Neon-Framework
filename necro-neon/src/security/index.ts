// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Security Module
// Handles: XSS, SQL injection, CSRF, input validation, rate limiting
// ================================================================

import type { ValidationResult, CSRFTokenStore } from '../types/index.js';

// ========== ADD THESE EXPORTS ==========
// Re-export types so they can be imported from this module
export type { ValidationResult, CSRFTokenStore };
// ========================================

// ---- XSS Prevention -----------------------------------------------

/**
 * HTML-encodes a string, neutralising all XSS vectors.
 * Use this whenever you insert user-supplied text into the DOM as HTML.
 *
 * @example
 * el.innerHTML = escapeHtml(userInput); // safe
 */
export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
}

/**
 * Strips ALL HTML tags from a string, returning plain text.
 * Useful for displaying user content as text-only.
 */
export function stripHtml(raw: string): string {
  const tmp = document.createElement('div');
  tmp.textContent = raw;
  return tmp.innerHTML;
}

/**
 * Creates a safe text node — the only truly XSS-proof way to insert
 * untrusted content into the DOM.
 */
export function safeTextNode(raw: string): Text {
  return document.createTextNode(raw);
}

/**
 * Sanitises a URL, rejecting javascript: / data: / vbscript: schemes
 * and any URL-encoded variants of those schemes.
 * Returns an empty string if the URL is unsafe.
 */
export function sanitizeUrl(raw: string): string {
  const url = raw.trim().toLowerCase();
  const decoded = decodeURIComponent(url).replace(/\s/g, '');

  const BLOCKED = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for (const scheme of BLOCKED) {
    if (decoded.startsWith(scheme)) return '';
  }

  // Only allow http, https, mailto, tel, relative paths
  if (
    !decoded.startsWith('http://') &&
    !decoded.startsWith('https://') &&
    !decoded.startsWith('mailto:') &&
    !decoded.startsWith('tel:') &&
    !decoded.startsWith('/') &&
    !decoded.startsWith('#') &&
    !decoded.startsWith('?')
  ) {
    return '';
  }

  return raw.trim();
}

// ---- SQL Injection Prevention --------------------------------------
// NOTE: Never build raw SQL on the client. These helpers exist for
// validation layers and to defend server-sent query params.

/** Characters that must never appear in query parameters sent to an API. */
const SQL_PATTERNS: RegExp[] = [
  /(\b)(select|insert|update|delete|drop|truncate|alter|exec|execute|union|having|where)\b/i,
  /(--|\/\*|\*\/|;|xp_|0x[0-9a-f]+)/i,
  /('|"|`|\\)/,   // unescaped quotes
  /\bor\b\s+['"]?\d/i,
  /\band\b\s+['"]?\d/i,
];

/**
 * Returns true if the string contains a SQL injection pattern.
 * Use this to pre-validate API query parameters before sending them.
 */
export function hasSQLInjection(input: string): boolean {
  return SQL_PATTERNS.some((re) => re.test(input));
}

/**
 * Strips SQL meta-characters from a string.
 * Prefer parameterised queries server-side; use this only as a
 * defence-in-depth layer on the client.
 */
export function sanitizeSQLParam(input: string): string {
  return input
    .replace(/['";\\]/g, '')       // quotes & backslash
    .replace(/--/g, '')            // comment prefix
    .replace(/\/\*/g, '')          // block comment start
    .replace(/\*\//g, '')          // block comment end
    .replace(/\bxp_/gi, '')        // MSSQL extended procs
    .trim();
}

// ---- Path Traversal Prevention ------------------------------------

/**
 * Returns true if the path contains directory traversal sequences.
 */
export function hasPathTraversal(input: string): boolean {
  const decoded = decodeURIComponent(input);
  return (
    decoded.includes('../') ||
    decoded.includes('..\\') ||
    decoded.includes('%2e%2e') ||
    decoded.includes('%252e') ||
    /\.\.[/\\]/.test(decoded)
  );
}

// ---- Input Validation & Sanitisation ------------------------------

/** Options for the general-purpose field validator. */
export interface FieldValidatorOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  /** Reject SQL injection patterns. Default: true. */
  blockSql?: boolean;
  /** Reject XSS/HTML. Default: true. */
  blockHtml?: boolean;
}

/**
 * Validates and sanitises a single string field.
 *
 * @returns ValidationResult — always check `valid` before using `value`.
 *
 * @example
 * const { valid, value, errors } = validateField(input.value, {
 *   required: true, maxLength: 120, blockSql: true
 * });
 */
export function validateField(
  raw: string,
  opts: FieldValidatorOptions = {}
): ValidationResult {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    blockSql = true,
    blockHtml = true,
  } = opts;

  const errors: string[] = [];
  let value = raw.trim();

  if (required && value.length === 0) {
    errors.push('This field is required.');
  }
  if (minLength !== undefined && value.length < minLength) {
    errors.push(`Minimum length is ${minLength} characters.`);
  }
  if (maxLength !== undefined && value.length > maxLength) {
    errors.push(`Maximum length is ${maxLength} characters.`);
    value = value.substring(0, maxLength);
  }
  if (pattern && !pattern.test(value)) {
    errors.push('Invalid format.');
  }
  if (blockSql && hasSQLInjection(value)) {
    errors.push('Invalid characters detected.');
    value = sanitizeSQLParam(value);
  }
  if (blockHtml && /<[^>]+>/.test(value)) {
    errors.push('HTML markup is not allowed.');
    value = stripHtml(value);
  }

  return { valid: errors.length === 0, value, errors };
}

/** Email validator — RFC 5322 simplified. */
export function validateEmail(raw: string): ValidationResult {
  const value = raw.trim().toLowerCase();
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const errors: string[] = [];
  if (!re.test(value)) errors.push('Invalid email address.');
  return { valid: errors.length === 0, value, errors };
}

// ---- CSRF Protection -----------------------------------------------

const CSRF_KEY = '__nn_csrf__';
const CSRF_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Generates a cryptographically random CSRF token and stores it in
 * sessionStorage. Call this when rendering forms.
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');

  const store: CSRFTokenStore = { token, expires: Date.now() + CSRF_TTL };
  try {
    sessionStorage.setItem(CSRF_KEY, JSON.stringify(store));
  } catch {
    // sessionStorage unavailable — degrade gracefully
  }
  return token;
}

/**
 * Retrieves and validates the stored CSRF token.
 * Returns null if the token is absent or expired.
 */
export function getCSRFToken(): string | null {
  try {
    const raw = sessionStorage.getItem(CSRF_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw) as CSRFTokenStore;
    if (Date.now() > store.expires) {
      sessionStorage.removeItem(CSRF_KEY);
      return null;
    }
    return store.token;
  } catch {
    return null;
  }
}

/**
 * Verifies a token submitted by a form matches the stored CSRF token.
 */
export function validateCSRFToken(submitted: string): boolean {
  const stored = getCSRFToken();
  if (!stored) return false;
  // Constant-time comparison to resist timing attacks
  if (stored.length !== submitted.length) return false;
  let diff = 0;
  for (let i = 0; i < stored.length; i++) {
    diff |= stored.charCodeAt(i) ^ submitted.charCodeAt(i);
  }
  return diff === 0;
}

// ---- Rate Limiting (client-side) ----------------------------------

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Simple sliding-window rate limiter for actions (e.g. form submits, API calls).
 *
 * @param key     — Unique action identifier (e.g. 'login', 'search')
 * @param limit   — Max calls allowed per window
 * @param windowMs — Window size in ms (default: 60 000)
 * @returns true if the action is allowed, false if rate-limited
 *
 * @example
 * if (!rateLimit('login', 5, 60_000)) {
 *   showToast('Too many attempts. Please wait.', '', 'warn');
 *   return;
 * }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }

  entry.count += 1;
  if (entry.count > limit) return false;
  return true;
}

// ---- Content Security Helpers -------------------------------------

/**
 * Generates a nonce for use in inline <script> / <style> tags when
 * your CSP requires 'nonce-<value>'.
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Returns the recommended Content-Security-Policy header value for the
 * Necro-Neon framework (fonts from Google, no inline scripts without nonce).
 */
export function getRecommendedCSP(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob:`,
    `connect-src 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ');
}