// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Infestation & Glitch Engines
// ================================================================
/**
 * InfestationEngine — renders animated blood-vein overlay on a canvas.
 *
 * @example
 * const inf = new InfestationEngine(document.getElementById('inf-canvas')!);
 * inf.start();
 */
export class InfestationEngine {
    constructor(canvas, opts = {}) {
        this._active = false;
        this._amount = 0;
        this._rafId = null;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error('[NecroNeon] InfestationEngine: 2d context unavailable');
        this.canvas = canvas;
        this.ctx = ctx;
        this._rate = opts.rate ?? 5;
        this._resizeObserver = new ResizeObserver(() => this._resize());
        this._resizeObserver.observe(document.documentElement);
        this._resize();
    }
    start() {
        this._active = true;
        if (!this._rafId)
            this._loop();
    }
    stop() {
        this._active = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        this._amount = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.opacity = '0';
    }
    destroy() { this.stop(); this._resizeObserver.disconnect(); }
    get isActive() { return this._active; }
    setRate(rate) { this._rate = Math.max(1, Math.min(10, rate)); }
    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    _loop() {
        const W = this.canvas.width;
        const H = this.canvas.height;
        this.ctx.clearRect(0, 0, W, H);
        const normalizedRate = this._rate / 10;
        this._amount = Math.min(1, this._amount + normalizedRate * 0.003);
        const t = Date.now() / 1000;
        // Vein bezier curves
        for (let i = 0; i < 18; i++) {
            const x0 = Math.sin(t * 0.3 + i) * W * 0.5 + W * 0.5;
            const y0 = Math.cos(t * 0.2 + i * 0.7) * H * 0.5 + H * 0.5;
            const x1 = Math.sin(t * 0.5 + i * 1.3) * W * 0.4 + W * 0.5;
            const y1 = Math.cos(t * 0.4 + i * 0.9) * H * 0.4 + H * 0.5;
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.bezierCurveTo(x0 + Math.sin(t + i) * 130, y0 + Math.cos(t * 1.3 + i) * 90, x1 + Math.cos(t * 0.7 + i) * 110, y1 + Math.sin(t + i * 0.5) * 100, x1, y1);
            this.ctx.strokeStyle = `rgba(204,0,24,${this._amount * 0.12 * Math.abs(Math.sin(t + i))})`;
            this.ctx.lineWidth = Math.random() * 2 + 0.5;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = 'rgba(204,0,24,.4)';
            this.ctx.stroke();
            this.ctx.restore();
        }
        // Radial glow pools
        for (let i = 0; i < 6; i++) {
            const gx = W * 0.15 * (i + 1) + Math.sin(t * 0.4 + i) * 35;
            const gy = H * 0.5 + Math.cos(t * 0.3 + i * 1.2) * H * 0.3;
            const gr = this.ctx.createRadialGradient(gx, gy, 0, gx, gy, 130 * this._amount);
            gr.addColorStop(0, `rgba(204,0,24,${this._amount * 0.09})`);
            gr.addColorStop(0.5, `rgba(100,0,10,${this._amount * 0.04})`);
            gr.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gr;
            this.ctx.fillRect(0, 0, W, H);
        }
        if (this._active)
            this._rafId = requestAnimationFrame(() => this._loop());
    }
}
/**
 * GlitchEngine — applies random glitch distortions to the document body.
 *
 * @example
 * const glitch = new GlitchEngine({ intensity: 6 });
 * glitch.burst();   // single burst
 * glitch.massive(); // dramatic mass glitch
 */
export class GlitchEngine {
    constructor(opts = {}) {
        this.intensity = opts.intensity ?? 5;
    }
    setIntensity(v) { this.intensity = Math.max(1, Math.min(10, v)); }
    /** Single short glitch burst. */
    burst() {
        const dur = 60 + Math.random() * 130;
        document.body.style.filter = `hue-rotate(${Math.random() * 40}deg) saturate(${1 + Math.random() * 1.5})`;
        document.body.style.transform = `skewX(${(Math.random() - 0.5) * this.intensity * 0.3}deg)`;
        setTimeout(() => {
            document.body.style.filter = '';
            document.body.style.transform = '';
        }, dur);
        const els = document.querySelectorAll('.nn-card,.nn-btn');
        if (els.length) {
            const el = els[Math.floor(Math.random() * els.length)];
            if (el) {
                el.style.transform = `translateX(${(Math.random() - 0.5) * this.intensity * 5}px)`;
                setTimeout(() => { el.style.transform = ''; }, dur);
            }
        }
    }
    /** Extended multi-frame mass glitch. */
    massive() {
        let frame = 0;
        const FRAMES = 24;
        const iv = setInterval(() => {
            if (frame >= FRAMES) {
                clearInterval(iv);
                document.body.style.filter = '';
                document.body.style.transform = '';
                return;
            }
            const t = frame / FRAMES;
            document.body.style.filter = [
                `hue-rotate(${Math.sin(frame) * 80}deg)`,
                `saturate(${1 + Math.random() * 3})`,
                `contrast(${1 + Math.random() * 0.5})`,
            ].join(' ');
            document.body.style.transform = [
                `skewX(${(Math.random() - 0.5) * (1 - t) * 5}deg)`,
                `translateY(${(Math.random() - 0.5) * (1 - t) * 8}px)`,
            ].join(' ');
            frame++;
        }, 45);
    }
}
//# sourceMappingURL=infestation.js.map