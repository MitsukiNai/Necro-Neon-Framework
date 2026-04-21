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
    options?: Array<{
        value: string;
        label: string;
    }>;
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
export declare class NNForm {
    private readonly root;
    private readonly opts;
    private readonly csrfToken;
    private readonly formEl;
    private readonly errorMap;
    constructor(root: HTMLElement, opts: FormOptions);
    private _buildFields;
    private _buildSubmit;
    private _buildCSRFInput;
    private _validateField;
    private _setFieldError;
    private _handleSubmit;
}
//# sourceMappingURL=nn-form.d.ts.map