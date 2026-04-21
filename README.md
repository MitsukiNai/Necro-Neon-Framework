# NECRO-NEON Framework v3.0
### 呪われたネオン都市 — Infestation Edition

![Version](https://img.shields.io/badge/version-3.0.0-00eaff?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-ff2d78?style=flat-square)

Framework UI para interfaces cyberpunk, horror y dark-web. CSS puro + TypeScript modular con seguridad integrada desde el primer momento.

Pensado para: páginas de videojuegos, portfolios oscuros, proyectos ARG, arte web experimental, UIs horror/cyberpunk.

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MitsukiNai/necro-neon.git

# Instalar dependencias
npm install

# Compilar TypeScript → JavaScript
npm run build

# Modo desarrollo (watch)
npm run dev
```

---

## Incluirlo en un HTML (sin bundler)

Si no usas TypeScript ni bundler, puedes usar el framework directamente en cualquier HTML:

```html
<head>
  <!-- Fuentes -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;700;900&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Zen+Kurenaido&display=swap" rel="stylesheet">

  <!-- Estilos del framework -->
  <link rel="stylesheet" href="necro-neon/necro-neon.css">
</head>

<body data-district="tokyo-night">
  <!-- Canvas para efectos atmosféricos -->
  <canvas id="rain-canvas"></canvas>
  <canvas id="infestation-canvas"></canvas>

  <!-- Script del framework al final del body -->
  <script src="necro-neon/dist/index.js"></script>
</body>
```

Los estilos funcionan con clases CSS directamente, sin necesidad de JavaScript:

```html
<button class="nn-btn neon-button">Neon</button>
<button class="nn-btn danger-button">Danger</button>
<button class="nn-btn glitch nn-btn-lg" data-text="EXECUTE">EXECUTE</button>

<div class="nn-card cyber-card">...</div>
<div class="nn-card glass-card">...</div>

<span class="nn-badge badge-primary">Online</span>
<span class="nn-badge badge-danger badge-dot">Critical</span>

<h1 class="glitch nn-display" data-text="NECRO">NECRO</h1>
<p class="neon-glow">Texto con glow primario</p>
```

---

## Estructura del proyecto

```
necro-neon/
├── necro-neon.css            ← Todos los estilos del framework
├── src/
│   ├── index.ts                  ← Punto de entrada público (todos los exports)
│   ├── types/
│   │   └── index.ts              ← Todos los tipos e interfaces TypeScript
│   ├── security/
│   │   └── index.ts              ← XSS, SQL injection, CSRF, rate limiting, CSP
│   ├── core/
│   │   ├── district.ts           ← DistrictManager (singleton)
│   │   └── necro-neon.ts         ← Orquestador principal
│   ├── effects/
│   │   ├── rain.ts               ← RainEngine (canvas)
│   │   ├── city.ts               ← CityBackdropManager + drawCity()
│   │   ├── infestation.ts        ← InfestationEngine + GlitchEngine
│   │   └── utils.ts              ← Parallax, scanlines, grain, staggerGlitch
│   ├── components/
│   │   ├── nn-toast.ts           ← NNToast
│   │   ├── nn-modal.ts           ← NNModal
│   │   ├── nn-tabs.ts            ← NNTabs
│   │   ├── nn-accordion.ts       ← NNAccordion
│   │   ├── nn-table.ts           ← NNTable<T> (genérica, sortable, paginada)
│   │   ├── nn-form.ts            ← NNForm (CSRF + rate limiting integrado)
│   │   ├── nn-navbar.ts          ← NNNavbar + NNScrollspy + breadcrumb
│   │   ├── nn-terminal.ts        ← NNTerminal + typeText
│   │   ├── nn-timeline.ts        ← NNTimeline
│   │   ├── nn-tooltip.ts         ← NNTooltip
│   │   ├── nn-card.ts            ← NNCard + NNPanel + createButton
│   │   └── nn-ui.ts              ← NNProgress + NNSpinner + NNAvatar + createBadge
│   └── utils/
│       └── index.ts              ← $ $$ el debounce throttle clamp lerp uid ...
├── dist/                         ← Compilado (generado por tsc)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Distritos visuales

El atributo `data-district` cambia toda la paleta de colores y efectos a la vez:

```html
<html data-district="tokyo-night">
<html data-district="ghoul">
<html data-district="ritual">
<html data-district="void">
```

| ID | Color primario | Mood |
|----|---------------|------|
| `tokyo-night` | `#00eaff` (cian) | Neón clásico cyberpunk |
| `ghoul` | `#9d00ff` (violeta) | Horror oscuro |
| `ritual` | `#ffd700` (dorado) | Occult / ceremonial |
| `void` | `#ff2d78` (rosa) | Nihilismo absoluto |

```typescript
// Cambiar distrito en cualquier momento
nn.district.set('ritual');
nn.district.cycle();             // ciclar al siguiente
nn.district.onChange(d => ...);  // escuchar cambios
```

---

## Uso básico

### 1. Inicialización completa (recomendado)

```typescript
import { NecroNeon } from 'necro-neon';

const nn = new NecroNeon({
  district:         'tokyo-night', // 'tokyo-night' | 'ghoul' | 'ritual' | 'void'
  rainCanvas:       'rain-canvas', // ID del canvas o el elemento
  heroCanvas:       'city-hero-canvas',
  infestationCanvas: 'infestation-canvas',
  autoInit:         true,  // auto-bind tabs, accordions, tooltips, terminal
});

// Cambiar distrito
nn.district.set('ghoul');

// Mostrar toast
nn.toast.show({ title: 'ALERTA', message: 'Sector 7 comprometido', type: 'danger' });

// Efecto glitch
nn.glitch.burst();
nn.glitch.massive();

// Activar infestation
nn.infestation?.start();
```

### 2. Uso modular (sin orquestador)

```typescript
import { DistrictManager, RainEngine, NNToast } from 'necro-neon';

const district = DistrictManager.getInstance({ initial: 'ritual' });
const rain     = new RainEngine(document.getElementById('rain-canvas') as HTMLCanvasElement);
const toast    = new NNToast();

rain.start();
district.onChange(d => rain.setColor(district.primaryColor));
```

---

## Sistema de Seguridad

El módulo `security` protege contra los vectores de ataque más comunes.

### Anti-XSS

```typescript
import { escapeHtml, safeTextNode, sanitizeUrl } from 'necro-neon';

// SIEMPRE usa escapeHtml antes de insertar contenido de usuario
element.textContent = escapeHtml(userInput);  // ✓ seguro
element.innerHTML   = userInput;              // ✗ NUNCA

// Para URLs (rechaza javascript:, data:, vbscript:)
const safe = sanitizeUrl(userSuppliedUrl);
if (safe) anchor.href = safe;

// Nodo de texto (100% seguro)
element.appendChild(safeTextNode(userInput));
```

### Anti-SQL Injection

```typescript
import { hasSQLInjection, sanitizeSQLParam } from 'necro-neon';

// Validar parámetros antes de enviarlos a la API
const query = searchInput.value;
if (hasSQLInjection(query)) {
  toast.show({ title: 'ERROR', message: 'Caracteres no permitidos', type: 'danger' });
  return;
}

// Limpiar como capa extra (usa siempre parámetros preparados en el servidor)
const clean = sanitizeSQLParam(query);
await fetch(`/api/search?q=${encodeURIComponent(clean)}`);
```

### CSRF

```typescript
import { generateCSRFToken, validateCSRFToken } from 'necro-neon';

// Generar token al cargar el formulario
const token = generateCSRFToken(); // guardado en sessionStorage

// Verificar antes de enviar
if (!validateCSRFToken(submittedToken)) {
  // token inválido o expirado (TTL: 1 hora)
  return;
}
```

### Rate Limiting (cliente)

```typescript
import { rateLimit } from 'necro-neon';

document.getElementById('login-btn')?.addEventListener('click', () => {
  if (!rateLimit('login', 5, 60_000)) {
    // más de 5 intentos en 60 segundos
    toast.show({ title: 'BLOQUEADO', message: 'Demasiados intentos', type: 'warn' });
    return;
  }
  doLogin();
});
```

### Path Traversal

```typescript
import { hasPathTraversal } from 'necro-neon';

const path = req.params.file;
if (hasPathTraversal(path)) {
  res.status(400).send('Path no permitido');
  return;
}
```

### Content Security Policy

```typescript
import { generateNonce, getRecommendedCSP } from 'necro-neon';

const nonce = generateNonce();
const csp   = getRecommendedCSP(nonce);

// Aplicar en el servidor como header HTTP:
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<nonce>'; ...
```

---

## Componentes

### NNForm — Formulario seguro

```typescript
import { NNForm } from 'necro-neon';

new NNForm(document.getElementById('contact-form')!, {
  fields: [
    { name: 'handle',  label: 'HANDLE',  type: 'text',  required: true, maxLength: 32 },
    { name: 'email',   label: 'EMAIL',   type: 'email', required: true },
    { name: 'message', label: 'MESSAGE', type: 'textarea', maxLength: 1000 },
  ],
  submitLabel:   'TRANSMIT',
  rateLimitKey:  'contact',   // máx 5 envíos/min
  rateLimitMax:  5,
  onSubmit: async (values) => {
    // values ya están saneados (XSS + SQL)
    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) });
  },
  onError: (errors) => {
    console.log('Errores de validación:', errors);
  },
});
```

### NNTable — Tabla tipada

```typescript
import { NNTable } from 'necro-neon';

interface Agent { name: string; district: string; status: string }

new NNTable<Agent>(container, {
  columns: [
    { key: 'name',     label: 'AGENTE',   sortable: true },
    { key: 'district', label: 'DISTRITO', sortable: true },
    { key: 'status',   label: 'ESTADO',
      render: (v) => `<span class="nn-badge badge-${v === 'active' ? 'safe' : 'danger'}">${v}</span>` },
  ],
  data:     agents,
  pageSize: 10,
});
```

### NNTerminal

```typescript
import { NNTerminal } from 'necro-neon';

const term = new NNTerminal(container, {
  title:   'BOOT_LOG',
  animate: true,
  lines: [
    { type: 'prompt', text: 'Inicializando necro-neon v3.0...' },
    { type: 'ok',     text: 'Sistemas de núcleo cargados' },
    { type: 'warn',   text: 'Sincronización de distrito pendiente' },
    { type: 'err',    text: 'Sector 7 no responde' },
  ],
});

// Agregar línea dinámica
term.push({ type: 'ok', text: 'Conexión establecida' }, true);
```

### NNCard & NNPanel

```typescript
import { NNCard, NNPanel, createButton } from 'necro-neon';

// Card
const card = new NNCard({
  variant:  'glass',
  title:    'AGENTE-7',
  subtitle: 'DISTRITO TOKYO-NIGHT',
  body:     'Último contacto: 2077.01.15 03:42',
  color:    'primary',
});
container.appendChild(card.el);

// Button
const btn = createButton({
  label:   'EJECUTAR',
  variant: 'danger',
  size:    'lg',
  onClick: () => nn.glitch.massive(),
});
container.appendChild(btn);
```

---

## TypeScript strict

El framework está compilado con `"strict": true` completo:

- `noImplicitAny`
- `strictNullChecks`
- `noUnusedLocals` / `noUnusedParameters`
- `exactOptionalPropertyTypes`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

---

## Seguridad — Resumen de protecciones

| Vector | Protección |
|--------|-----------|
| XSS | `escapeHtml()` en TODOS los inserts de usuario. Nunca `innerHTML` con input externo |
| SQL Injection | `hasSQLInjection()` + `sanitizeSQLParam()` en params de API |
| CSRF | `generateCSRFToken()` / `validateCSRFToken()` con TTL de 1h en sessionStorage |
| Rate limiting | `rateLimit(key, max, windowMs)` con ventana deslizante |
| URLs peligrosas | `sanitizeUrl()` bloquea `javascript:` `data:` `vbscript:` `file:` |
| Path traversal | `hasPathTraversal()` detecta `../` y variantes URL-encoded |
| CSP | `getRecommendedCSP(nonce)` genera una política restrictiva lista para usar |
| Clickjacking | CSP incluye `frame-ancestors 'none'` |

---

## Licencia

MIT — 呪われたネオン都市のためのフレームワーク

走れ。逃げろ。生き残れ。
