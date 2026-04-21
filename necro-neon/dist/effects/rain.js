// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — Rain Engine
// Animated neon rain canvas overlay
// ================================================================
/** A single rain drop particle. */
class Drop {
    constructor(canvas, speed, init = false) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.len = 0;
        this.spd = 0;
        this.op = 0;
        this.w = 0;
        this.reset(speed, init);
    }
    reset(speed, init = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = init ? Math.random() * this.canvas.height : -30;
        this.len = Math.random() * 20 + 8;
        this.spd = (Math.random() * 0.5 + 0.75) * speed;
        this.op = Math.random() * 0.35 + 0.08;
        this.w = Math.random() * 0.7 + 0.2;
    }
    tick(angle, speed) {
        const rad = (angle * Math.PI) / 180;
        this.y += this.spd;
        this.x += Math.sin(rad) * this.spd * 0.5;
        const { width, height } = this.canvas;
        if (this.y > height + 40 || this.x > width + 60 || this.x < -60) {
            this.reset(speed);
        }
    }
    draw(ctx, angle, color) {
        const rad = (angle * Math.PI) / 180;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.sin(rad) * this.len, this.y + Math.cos(rad) * this.len);
        ctx.strokeStyle = color;
        ctx.lineWidth = this.w;
        ctx.globalAlpha = this.op;
        ctx.shadowBlur = 3;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.restore();
    }
}
/**
 * RainEngine — attaches an animated neon rain to a canvas element.
 *
 * @example
 * const rain = new RainEngine(document.getElementById('rain-canvas')!, {
 *   count: 180, speed: 13, color: '#00eaff'
 * });
 * rain.start();
 * rain.setColor('#9d00ff'); // sync with district
 */
export class RainEngine {
    constructor(canvas, opts = {}) {
        this.drops = [];
        this._rafId = null;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error('[NecroNeon] RainEngine: canvas 2d context unavailable');
        this.canvas = canvas;
        this.ctx = ctx;
        this.active = opts.active ?? true;
        this.color = opts.color ?? '#00eaff';
        this.count = opts.count ?? 180;
        this.speed = opts.speed ?? 13;
        this.angle = opts.angle ?? 0;
        this._resizeObserver = new ResizeObserver(() => this._resize());
        this._resizeObserver.observe(document.documentElement);
        this._resize();
        this._initDrops();
    }
    /** Start (or resume) the rain animation. */
    start() {
        this.active = true;
        if (!this._rafId)
            this._loop();
    }
    /** Pause rain (canvas stays visible but frozen). */
    pause() {
        this.active = false;
    }
    /** Stop rain and clear the canvas. */
    stop() {
        this.active = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /** Destroy the engine and clean up observers. */
    destroy() {
        this.stop();
        this._resizeObserver.disconnect();
    }
    setColor(color) { this.color = color; }
    setCount(count) { this.count = count; this._initDrops(); }
    setSpeed(speed) {
        this.speed = speed;
        this.drops.forEach((d) => { d.spd = (Math.random() * 0.5 + 0.75) * speed; });
    }
    setAngle(angle) { this.angle = angle; }
    get isActive() { return this.active; }
    // ---- private ----
    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    _initDrops() {
        this.drops = Array.from({ length: this.count }, () => new Drop(this.canvas, this.speed, true));
    }
    _loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.active) {
            this.drops.forEach((d) => {
                d.tick(this.angle, this.speed);
                d.draw(this.ctx, this.angle, this.color);
            });
            // Occasional horizontal glitch streak
            if (Math.random() < 0.005) {
                this.ctx.save();
                this.ctx.fillStyle = this.color;
                this.ctx.globalAlpha = Math.random() * 0.05;
                this.ctx.fillRect(0, Math.random() * this.canvas.height, this.canvas.width, Math.random() * 2 + 0.5);
                this.ctx.restore();
            }
        }
        this._rafId = requestAnimationFrame(() => this._loop());
    }
}
//# sourceMappingURL=rain.js.map