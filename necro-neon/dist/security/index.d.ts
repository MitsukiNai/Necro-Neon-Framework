import type { ValidationResult, CSRFTokenStore } from '../types/index.js';
export type { ValidationResult, CSRFTokenStore };
/**
 * HTML-encodes a string, neutralising all XSS vectors.
 * Use this whenever you insert user-supplied text into the DOM as HTML.
 *
 * @example
 * el.innerHTML = escapeHtml(userInput); // safe
 */
export declare function escapeHtml(raw: string): string;
/**
 * Strips ALL HTML tags from a string, returning plain text.
 * Useful for displaying user content as text-only.
 */
export declare function stripHtml(raw: string): string;
/**
 * Creates a safe text node — the only truly XSS-proof way to insert
 * untrusted content into the DOM.
 */
export declare function safeTextNode(raw: string): Text;
/**
 * Sanitises a URL, rejecting javascript: / data: / vbscript: schemes
 * and any URL-encoded variants of those schemes.
 * Returns an empty string if the URL is unsafe.
 */
export declare function sanitizeUrl(raw: string): string;
/**
 * Returns true if the string contains a SQL injection pattern.
 * Use this to pre-validate API query parameters before sending them.
 */
export declare function hasSQLInjection(input: string): boolean;
/**
 * Strips SQL meta-characters from a string.
 * Prefer parameterised queries server-side; use this only as a
 * defence-in-depth layer on the client.
 */
export declare function sanitizeSQLParam(input: string): string;
/**
 * Returns true if the path contains directory traversal sequences.
 */
export declare function hasPathTraversal(input: string): boolean;
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
export declare function validateField(raw: string, opts?: FieldValidatorOptions): ValidationResult;
/** Email validator — RFC 5322 simplified. */
export declare function validateEmail(raw: string): ValidationResult;
/**
 * Generates a cryptographically random CSRF token and stores it in
 * sessionStorage. Call this when rendering forms.
 */
export declare function generateCSRFToken(): string;
/**
 * Retrieves and validates the stored CSRF token.
 * Returns null if the token is absent or expired.
 */
export declare function getCSRFToken(): string | null;
/**
 * Verifies a token submitted by a form matches the stored CSRF token.
 */
export declare function validateCSRFToken(submitted: string): boolean;
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
export declare function rateLimit(key: string, limit: number, windowMs?: number): boolean;
/**
 * Generates a nonce for use in inline <script> / <style> tags when
 * your CSP requires 'nonce-<value>'.
 */
export declare function generateNonce(): string;
/**
 * Returns the recommended Content-Security-Policy header value for the
 * Necro-Neon framework (fonts from Google, no inline scripts without nonce).
 */
export declare function getRecommendedCSP(nonce: string): string;
//# sourceMappingURL=index.d.ts.map