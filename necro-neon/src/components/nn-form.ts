// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — nn-form component
// Secure form builder with built-in XSS / SQL / CSRF protection
// ================================================================

import { escapeHtml, validateField, validateEmail, generateCSRFToken, validateCSRFToken, rateLimit } from '../security/index.js';
import type { FieldValidatorOptions, ValidationResult } from '../security/index.js';

// ---- Field Definitions --------------------------------------------

export type FieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  /** For <select> */
  options?: Array<{ value: string; label: string }>;
  /** Custom extra classes */
  className?: string;
}

export interface FormOptions {
  fields: FieldDef[];
  submitLabel?: string;
  /** Rate-limit key. If set, limits to `rateLimit` submits per minute. */
  rateLimitKey?: string;
  rateLimitMax?: number;
  /** Called with sanitised, validated values on successful submit. */
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
  /** Called when validation fails. */
  onError?: (errors: Record<string, string[]>) => void;
}

// ---- NNForm -------------------------------------------------------

/**
 * NNForm — secure form builder with CSRF, rate-limiting, and
 * built-in XSS / SQL injection protection on all fields.
 *
 * @example
 * const form = new NNForm(container, {
 *   fields: [
 *     { name: 'handle', label: 'HANDLE', type: 'text', required: true, maxLength: 32 },
 *     { name: 'email',  label: 'EMAIL',  type: 'email', required: true },
 *   ],
 *   rateLimitKey: 'contact-form',
 *   onSubmit: async (values) => { await sendToServer(values); },
 * });
 */
export class NNForm {
  private readonly root: HTMLElement;
  private readonly opts: FormOptions;
  private readonly csrfToken: string;
  private readonly formEl: HTMLFormElement;
  private readonly errorMap: Map<string, HTMLElement> = new Map();

  constructor(root: HTMLElement, opts: FormOptions) {
    this.root  = root;
    this.opts  = opts;
    this.csrfToken = generateCSRFToken();

    this.formEl = document.createElement('form');
    this.formEl.className = 'nn-form';
    // Prevent native submission — we handle everything in JS
    this.formEl.setAttribute('novalidate', '');

    this._buildFields();
    this._buildSubmit();
    this._buildCSRFInput();

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      void this._handleSubmit();
    });

    this.root.appendChild(this.formEl);
  }

  // ---- Private builders ----

  private _buildFields(): void {
    this.opts.fields.forEach((def) => {
      const group = document.createElement('div');
      group.className = 'nn-form-group';

      const label = document.createElement('label');
      label.className  = 'nn-label';
      label.textContent = escapeHtml(def.label);
      label.setAttribute('for', `nn-field-${def.name}`);
      group.appendChild(label);

      let inputEl: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

      if (def.type === 'textarea') {
        const ta = document.createElement('textarea');
        ta.id          = `nn-field-${def.name}`;
        ta.name        = def.name;
        ta.className   = `nn-input ${def.className ?? ''}`.trim();
        ta.rows        = 4;
        if (def.placeholder) ta.placeholder = escapeHtml(def.placeholder);
        if (def.required)    ta.required    = true;
        inputEl = ta;

      } else if (def.type === 'select') {
        const sel = document.createElement('select');
        sel.id        = `nn-field-${def.name}`;
        sel.name      = def.name;
        sel.className = `nn-select ${def.className ?? ''}`.trim();
        if (def.required) sel.required = true;

        // Blank option
        const blank = document.createElement('option');
        blank.value       = '';
        blank.textContent = '— SELECT —';
        sel.appendChild(blank);

        (def.options ?? []).forEach((opt) => {
          const o = document.createElement('option');
          o.value       = escapeHtml(opt.value);
          o.textContent = escapeHtml(opt.label);
          sel.appendChild(o);
        });
        inputEl = sel;

      } else {
        const inp = document.createElement('input');
        inp.id          = `nn-field-${def.name}`;
        inp.name        = def.name;
        inp.type        = def.type;
        inp.className   = `nn-input ${def.className ?? ''}`.trim();
        if (def.placeholder) inp.placeholder = escapeHtml(def.placeholder);
        if (def.required)    inp.required    = true;
        if (def.minLength)   inp.minLength   = def.minLength;
        if (def.maxLength)   inp.maxLength   = def.maxLength;
        inputEl = inp;
      }

      // Live validation feedback on blur
      inputEl.addEventListener('blur', () => {
        const result = this._validateField(def, inputEl.value);
        this._setFieldError(def.name, result.errors);
      });

      group.appendChild(inputEl);

      // Error display
      const errorEl = document.createElement('div');
      errorEl.className   = 'nn-form-error';
      errorEl.id          = `nn-error-${def.name}`;
      errorEl.setAttribute('aria-live', 'polite');
      errorEl.setAttribute('role', 'alert');
      group.appendChild(errorEl);

      this.errorMap.set(def.name, errorEl);
      this.formEl.appendChild(group);
    });
  }

  private _buildSubmit(): void {
    const btn = document.createElement('button');
    btn.type       = 'submit';
    btn.className  = 'nn-btn btn-neon';
    btn.textContent = escapeHtml(this.opts.submitLabel ?? 'TRANSMIT');
    this.formEl.appendChild(btn);
  }

  private _buildCSRFInput(): void {
    const hidden = document.createElement('input');
    hidden.type  = 'hidden';
    hidden.name  = '__csrf';
    hidden.value = this.csrfToken;
    this.formEl.appendChild(hidden);
  }

  // ---- Validation ----

  private _validateField(def: FieldDef, value: string): ValidationResult {
    if (def.type === 'email') {
      const base = validateEmail(value);
      if (def.required && value.trim() === '') {
        return { valid: false, value: '', errors: ['This field is required.'] };
      }
      return base;
    }

    const opts: FieldValidatorOptions = {
      required:   def.required,
      minLength:  def.minLength,
      maxLength:  def.maxLength,
      pattern:    def.pattern,
      blockSql:   true,
      blockHtml:  true,
    };
    return validateField(value, opts);
  }

  private _setFieldError(name: string, errors: string[]): void {
    const el = this.errorMap.get(name);
    if (!el) return;
    if (errors.length === 0) {
      el.textContent = '';
      el.classList.remove('visible');
    } else {
      el.textContent = errors[0] ?? '';
      el.classList.add('visible');
    }
  }

  // ---- Submit Handler ----

  private async _handleSubmit(): Promise<void> {
    // Rate limiting
    const rlKey = this.opts.rateLimitKey;
    if (rlKey && !rateLimit(rlKey, this.opts.rateLimitMax ?? 5)) {
      this._setFieldError('__global', ['Too many requests. Please wait before trying again.']);
      return;
    }

    // CSRF verification
    const csrfInput = this.formEl.querySelector<HTMLInputElement>('input[name="__csrf"]');
    if (!csrfInput || !validateCSRFToken(csrfInput.value)) {
      this._setFieldError('__global', ['Security token invalid. Please refresh the page.']);
      return;
    }

    // Validate all fields
    const values: Record<string, string> = {};
    const errorsByField: Record<string, string[]> = {};
    let hasErrors = false;

    this.opts.fields.forEach((def) => {
      const input = this.formEl.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        `[name="${def.name}"]`
      );
      const rawValue = input?.value ?? '';
      const result = this._validateField(def, rawValue);
      this._setFieldError(def.name, result.errors);
      if (!result.valid) {
        hasErrors = true;
        errorsByField[def.name] = result.errors;
      } else {
        values[def.name] = result.value;
      }
    });

    if (hasErrors) {
      this.opts.onError?.(errorsByField);
      return;
    }

    // All good — call onSubmit with sanitised values
    await this.opts.onSubmit?.(values);
  }
}
