// ================================================================
// NECRO-NEON FRAMEWORK v3.0 — City Backdrop Engine
// Procedural canvas city renderer for all four districts
// ================================================================
import { DISTRICT_CITY_COLORS } from '../core/district.js';
/** Convert #RRGGBB hex to "R,G,B" string for rgba() interpolation. */
function hex2rgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3)
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
/** Render a single building onto the canvas. */
function paintBuilding(ctx, x, w, h, bottom, neon, glow, style) {
    const grad = ctx.createLinearGradient(x, bottom - h, x, bottom);
    if (style === 'ruined') {
        grad.addColorStop(0, `rgba(${hex2rgb(neon[0])}, .3)`);
        grad.addColorStop(0.5, 'rgba(15,5,5,.9)');
        grad.addColorStop(1, 'rgba(5,2,2,1)');
    }
    else {
        grad.addColorStop(0, 'rgba(8,18,30,.95)');
        grad.addColorStop(0.6, 'rgba(5,12,20,.98)');
        grad.addColorStop(1, 'rgba(2,4,8,1)');
    }
    ctx.fillStyle = grad;
    if (style === 'ruined') {
        ctx.beginPath();
        ctx.moveTo(x, bottom);
        ctx.lineTo(x, bottom - h * 0.7);
        ctx.lineTo(x + w * 0.1, bottom - h * 0.85);
        ctx.lineTo(x + w * 0.25, bottom - h * 0.75);
        ctx.lineTo(x + w * 0.4, bottom - h);
        ctx.lineTo(x + w * 0.55, bottom - h * 0.88);
        ctx.lineTo(x + w * 0.7, bottom - h * 0.94);
        ctx.lineTo(x + w * 0.85, bottom - h * 0.76);
        ctx.lineTo(x + w, bottom - h * 0.58);
        ctx.lineTo(x + w, bottom);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = `rgba(${hex2rgb(neon[1] ?? neon[0])}, .18)`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const sx = x + Math.random() * w;
            const sy = bottom - h * 0.5;
            ctx.moveTo(sx, sy);
            for (let j = 0; j < 5; j++) {
                ctx.lineTo(sx + (Math.random() - 0.5) * 18, sy + j * 14 + Math.random() * 8);
            }
            ctx.stroke();
        }
    }
    else {
        ctx.fillRect(x, bottom - h, w, h);
    }
    // Windows
    const density = style === 'ruined' ? 0.12 : 0.42;
    const cols = Math.floor(w / 12);
    const rows = Math.floor(h / 16);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() < density) {
                const wy = bottom - h + 8 + r * 16;
                const wx = x + 4 + c * 12;
                if (wy < bottom - 4 && wy > bottom - h * 0.9) {
                    ctx.fillStyle = neon[Math.floor(Math.random() * neon.length)] ?? '#00eaff';
                    ctx.globalAlpha = Math.random() * 0.5 + 0.05;
                    ctx.fillRect(wx, wy, 6, 8);
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    // Neon strip
    if (Math.random() < 0.38 && w > 28) {
        const sc = neon[Math.floor(Math.random() * 3)] ?? '#00eaff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = sc;
        ctx.fillStyle = sc;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(x + w * 0.2, bottom - h * 0.32, w * 0.6, 2);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    // Antenna
    if (Math.random() < 0.28 && style !== 'ruined') {
        ctx.fillStyle = neon[0] ?? '#00eaff';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x + w * 0.45, bottom - h - 14, 2, 14);
        ctx.shadowBlur = 5;
        ctx.shadowColor = neon[0] ?? '#00eaff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x + w * 0.46, bottom - h - 14, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}
/** Draw a full city scene onto a canvas element. */
export function drawCity(canvas, style, district) {
    const W = canvas.offsetWidth || 800;
    const H = canvas.offsetHeight || 300;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    const { sky, mid, neon, glow } = DISTRICT_CITY_COLORS[district];
    // Sky gradient
    const sg = ctx.createLinearGradient(0, 0, 0, H);
    if (style === 'ruined') {
        sg.addColorStop(0, 'rgba(20,2,2,1)');
        sg.addColorStop(0.6, 'rgba(10,1,1,1)');
        sg.addColorStop(1, 'rgba(5,0,0,1)');
    }
    else if (style === 'ritual') {
        sg.addColorStop(0, 'rgba(8,5,2,1)');
        sg.addColorStop(0.6, mid);
        sg.addColorStop(1, 'rgba(3,1,0,1)');
    }
    else if (style === 'ghoul') {
        sg.addColorStop(0, 'rgba(4,0,8,1)');
        sg.addColorStop(0.6, 'rgba(8,0,12,1)');
        sg.addColorStop(1, 'rgba(2,0,4,1)');
    }
    else {
        sg.addColorStop(0, sky);
        sg.addColorStop(0.7, mid);
        sg.addColorStop(1, 'rgba(1,3,6,1)');
    }
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
    // Moon / orb
    if (style === 'ruined') {
        const mx = W * 0.78, my = H * 0.16;
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 38);
        mg.addColorStop(0, 'rgba(204,0,24,.4)');
        mg.addColorStop(0.5, 'rgba(100,0,10,.15)');
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(204,0,24,.25)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(mx + (Math.random() - 0.5) * 65, my + (Math.random() - 0.5) * 65);
            ctx.stroke();
        }
    }
    else {
        const mx = W * 0.12, my = H * 0.14;
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 30);
        mg.addColorStop(0, `${glow}.2)`);
        mg.addColorStop(0.5, `${glow}.06)`);
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, 30, 0, Math.PI * 2);
        ctx.fill();
    }
    // Stars
    const starCount = style === 'ruined' ? 15 : 45;
    for (let i = 0; i < starCount; i++) {
        ctx.fillStyle = neon[Math.floor(Math.random() * neon.length)] ?? '#00eaff';
        ctx.globalAlpha = Math.random() * 0.35 + 0.04;
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * (H * 0.5), 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    // Fog layers
    for (let l = 0; l < 3; l++) {
        const fg = ctx.createLinearGradient(0, H * (0.3 + l * 0.15), 0, H * (0.5 + l * 0.15));
        fg.addColorStop(0, 'transparent');
        fg.addColorStop(1, style === 'ruined'
            ? `rgba(30,3,3,${0.12 + l * 0.07})`
            : `${glow}${0.04 + l * 0.02})`);
        ctx.fillStyle = fg;
        ctx.fillRect(0, H * (0.3 + l * 0.15), W, H * 0.22);
    }
    // Building layers (back-to-front)
    const LAYER_COUNT = 4;
    for (let layer = LAYER_COUNT; layer >= 0; layer--) {
        const bottom = H - layer * H * 0.04;
        ctx.globalAlpha = 0.4 + layer * 0.12;
        let bx = 0;
        while (bx < W + 90) {
            const bw = Math.floor(Math.random() * 55) + 18;
            const bh = Math.floor(Math.random() * H * (0.25 + layer * 0.12)) + H * 0.1;
            const bStyle = style === 'ruined' && layer < 2 ? 'ruined' : style;
            paintBuilding(ctx, bx, bw, bh, bottom, neon, glow, bStyle);
            bx += bw + Math.floor(Math.random() * 5);
        }
        ctx.globalAlpha = 1;
    }
    // Ritual sigil overlay
    if (style === 'ritual') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,215,0,.07)';
        ctx.lineWidth = 0.5;
        const cx = W / 2, cy = H * 0.38, r = Math.min(W, H) * 0.24;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
            ctx.stroke();
        }
        ctx.restore();
    }
    // Floor reflection
    const rg = ctx.createLinearGradient(0, H - 50, 0, H);
    rg.addColorStop(0, 'transparent');
    rg.addColorStop(1, `${glow}.1)`);
    ctx.fillStyle = rg;
    ctx.fillRect(0, H - 50, W, 50);
    // Neon base streaks
    for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = neon[i % neon.length] ?? '#00eaff';
        ctx.globalAlpha = 0.04 + Math.random() * 0.04;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, H - Math.random() * 25);
        ctx.lineTo(W, H - Math.random() * 25);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}
/**
 * CityBackdropManager — controls all city canvas instances.
 *
 * @example
 * const city = new CityBackdropManager();
 * city.show('city-neon', 'neon', 'tokyo-night');
 * city.hide('city-ruined');
 */
export class CityBackdropManager {
    constructor() {
        this._wrapMap = {
            'city-ruined': 'wrap-city-ruined',
            'city-neon': 'wrap-city-neon',
            'city-ghoul': 'wrap-city-ghoul',
            'city-ritual': 'wrap-city-ritual',
        };
    }
    /** Render (or re-render) a city canvas. */
    draw(canvasId, style, district) {
        const cvs = document.getElementById(canvasId);
        if (!cvs)
            return;
        drawCity(cvs, style, district);
    }
    /** Show a city backdrop wrapper and immediately re-draw. */
    show(canvasId, style, district) {
        const wrId = this._wrapMap[canvasId];
        const el = wrId ? document.getElementById(wrId) : null;
        if (el) {
            el.classList.remove('city-backdrop--off');
            el.classList.add('city-backdrop--on');
            setTimeout(() => this.draw(canvasId, style, district), 50);
        }
    }
    /** Hide a city backdrop wrapper. */
    hide(canvasId) {
        const wrId = this._wrapMap[canvasId];
        const el = wrId ? document.getElementById(wrId) : null;
        if (el) {
            el.classList.add('city-backdrop--off');
            el.classList.remove('city-backdrop--on');
        }
    }
    toggle(canvasId, style, district) {
        const wrId = this._wrapMap[canvasId];
        const el = wrId ? document.getElementById(wrId) : null;
        if (!el)
            return;
        const isOff = el.classList.contains('city-backdrop--off');
        isOff ? this.show(canvasId, style, district) : this.hide(canvasId);
    }
    hideAll() {
        Object.keys(this._wrapMap).forEach((id) => this.hide(id));
    }
}
//# sourceMappingURL=city.js.map