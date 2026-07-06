---
title: "Watermark App - Spec"
author: "acraciel"
date: 2025-07-05
---

# Watermark App - Especificación de Diseño

## 1. Concept & Vision

Una aplicación web para añadir marcas de agua personales a imágenes, diseñada mobile-first con un look actual y gradientes. La experiencia debe sentirse como una app nativa: fluida, intuitiva y con feedback visual inmediato. El usuario debe poder firmar sus fotos con estilo sin complicaciones.

**Personalidad:** Minimalista pero expresiva, moderna sin ser fría.

---

## 2. Design Language

### Aesthetic Direction
Glassmorphism sutil con gradientes suaves. Inspiración: apps de edición de fotos premium como VSCO, Snapseed.

### Color Palette
```
--bg-primary: #0f0f1a          /* Fondo oscuro profundo */
--bg-secondary: #1a1a2e        /* Cards y superficies */
--accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--accent-primary: #667eea      /* Púrpura/azul vibrante */
--accent-secondary: #764ba2     /* Púrpura profundo */
--text-primary: #ffffff
--text-secondary: #a0a0b0
--surface-glass: rgba(255, 255, 255, 0.05)
--border-glass: rgba(255, 255, 255, 0.1)
```

### Typography
- **UI:** Inter (Google Fonts) - limpia, moderna, excelente legibilidad móvil
- **Fallback:** -apple-system, BlinkMacSystemFont, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48px
- Border radius: 12px (cards), 8px (inputs), 24px (buttons)
- Max-width content: 480px (centrado en desktop)

### Motion Philosophy
- Transiciones: 200ms ease-out para estados
- Micro-interacciones: scale(0.98) en press de botones
- Aparición de elementos: fade-in + translateY(10px), 300ms

### Visual Assets
- Iconos: Lucide Icons (SVG inline para control de tamaño)
- Decorativos: gradientes sutiles en backgrounds

---

## 3. Layout & Structure

### Estructura de Página
```
┌──────────────────────────────────────┐
│           HEADER (sticky)            │
│         "Watermark Studio"           │
├──────────────────────────────────────┤
│                                      │
│         ZONA DE IMAGEN               │
│   [Drop zone / Preview canvas]       │
│                                      │
├──────────────────────────────────────┤
│                                      │
│         PANEL DE CONTROLES           │
│   - Texto input                      │
│   - Tipo (firma/mosaico)             │
│   - Opacidad (radio buttons)         │
│   - Categoría fuente (dropdown)      │
│   - Fuente específica (dropdown)     │
│   - Color picker                     │
│                                      │
├──────────────────────────────────────┤
│         [PREVISUALIZAR]              │
│         [DESCARGAR ZIP]             │
└──────────────────────────────────────┘
```

### Responsive Strategy
- Mobile-first: 100% width con padding 16px
- Tablet/Desktop: max-width 480px centrado
- Canvas: mantiene aspect ratio de imagen original

---

## 4. Features & Interactions

### 4.1 Upload de Imagen
- **Trigger:** Click en drop zone o input file hidden
- **Drag & drop:** Zone se ilumina con gradiente al arrastrar
- **Validación:** Solo acepta image/jpeg, image/png, image/webp
- **Error:** Toast notification con mensaje claro
- **Éxito:** Preview en canvas, panel de controles se activa

### 4.2 Configuración del Watermark

#### Texto (input)
- Placeholder: "Tu nombre o firma"
- Max length: 50 caracteres
- Live preview al escribir (debounce 300ms)

#### Posición del Watermark
**Radio buttons con 2 opciones:**
1. **Firma:** Una instancia del texto en posición seleccionada
2. **Mosaico diagonal:** Texto repetido en patrón diagonal (45°) por toda la imagen

#### Selector de Posición (solo modo Firma)
- Grid de 9 posiciones (3x3)
- Selección visual con preview en tiempo real

#### Opacidad
**Radio buttons con 3 opciones:**
1. Sutil: 20% opacity
2. Moderado: 35% opacity
3. Pronunciado: 50% opacity

#### Categoría de Fuente
**Dropdown con 3 categorías:**
1. Cursiva elegante
2. Limpias profesionales
3. Discretas y legibles

#### Fuente Específica
**Dropdown dependiente, muestra fuentes de la categoría seleccionada:**
- **Cursiva elegante:** Great Vibes, Playfair Display, Dancing Script, Satisfy, Pacifico
- **Limpias profesionales:** Poppins, Montserrat, Raleway, Quicksand, Nunito
- **Discretas y legibles:** Roboto, Inter, Open Sans, Source Sans Pro, Work Sans

**Fuentes de Google Fonts cargadas dinámicamente via WebFont loader**

#### Tamaño de Fuente
- Slider: 12px - 72px (default 24px)
- Input numérico sincronizado

#### Color del Watermark
- Color fijo: blanco (#ffffff)
- Shadow: 1px 1px 3px rgba(0,0,0,0.5) para incrustarse en la imagen
- (Listo para extender a color picker si se pide después)

### 4.3 Previsualización
- Canvas actualizado en tiempo real con debounce
- Muestra exactamente cómo quedará la imagen final
- Loading spinner durante procesamiento

### 4.4 Descarga
- Botón principal disabled hasta que haya imagen
- **Una imagen:** descarga directa como PNG (nombre: `original_watermarked.png`)
- **Múltiples imágenes:** genera ZIP con JSZip containing todas las imágenes
- Formato: PNG (mantiene calidad)

### 4.5 Estados

**Empty State (sin imagen):**
- Drop zone con icono y texto "Arrastra o selecciona una imagen"
- Controles deshabilitados (opacidad reducida)

**Loading State:**
- Spinner en el canvas
- Botones deshabilitados

**Error State:**
- Toast notification inferior
- Auto-dismiss después de 4 segundos

---

## 5. Component Inventory

### 5.1 Header
- Logo texto estilizado con gradiente
- Sticky en mobile
- Altura: 56px

### 5.2 DropZone
- Estados: default, dragover (borde gradiente + scale 1.02), error
- Aspect ratio libre, min-height 200px
- Icono centrado + texto

### 5.3 Canvas Preview
- Mantiene aspect ratio
- Border radius 12px
- Box shadow sutil
- Contenedor con aspect-ratio: 1 (o el de la imagen)

### 5.4 TextInput
- Glass morphism style
- Border: 1px solid var(--border-glass)
- Focus: border-color var(--accent-primary)

### 5.5 RadioGroup
- Custom styled radio buttons
- Visual: pill shape con opción seleccionada con gradiente
- Horizontal en mobile

### 5.6 Select/Dropdown
- Estilo glass morphism
- Flecha custom
- Mismo estilo que TextInput

### 5.7 Slider
- Track con gradiente
- Thumb circular con sombra
- Muestra valor actual

### 5.8 Button
**Primary:**
- Gradiente background
- White text
- Hover: brightness(1.1)
- Active: scale(0.98)
- Disabled: opacity 0.5, cursor not-allowed

**Secondary:**
- Background transparent
- Border glass
- Hover: background glass

### 5.9 Toast Notification
- Fixed bottom
- Glass morphism
- Icono + mensaje
- Auto-dismiss con progress bar

---

## 6. Technical Approach

### Stack
- **HTML5** semántico
- **CSS3** con custom properties, sin frameworks
- **Vanilla JavaScript ES6+** modular

### Arquitectura (SOLID)

```
/watermark-app
├── index.html
├── css/
│   ├── main.css          # Variables, reset, utilities
│   ├── components.css    # Componentes UI
│   └── responsive.css    # Media queries
├── js/
│   ├── app.js            # Entry point, init
│   ├── modules/
│   │   ├── ImageUploader.js      # Responsabilidad: upload/drag-drop
│   │   ├── WatermarkEngine.js    # Responsabilidad: render watermark en canvas
│   │   ├── FontLoader.js         # Responsabilidad: cargar Google Fonts
│   │   ├── UIController.js       # Responsabilidad: sincronizar UI con estado
│   │   └── DownloadManager.js    # Responsabilidad: exportar ZIP/imágenes
│   └── utils/
│       ├── dom.js                # Helpers DOM
│       └── constants.js          # Config, fonts lists
├── assets/
│   └── icons/                     # SVG icons inline
└── docs/
    └── specs/                    # specs de diseño
```

### Principios Aplicados

**S - Single Responsibility:**
- Cada clase/module tiene UNA razón de cambio
- ImageUploader solo maneja subida de archivos
- WatermarkEngine solo renderiza en canvas

**O - Open/Closed:**
- Fácil añadir nuevos tipos de posición (extender, no modificar)
- Fonts organizados en estructura de datos, no hardcoded en lógica

**L - Liskov Substitution:**
- Las fuentes son solo strings, cualquier fuente funciona igual

**I - Interface Segregation:**
- No hay interfaces formales en JS, pero módulos tienen APIs pequeñas y enfocadas

**D - Dependency Inversion:**
- app.js coordina, no tiene lógica de negocio
- Módulos son independientes y testeables

### Dependencias Externas
- **JSZip:** Generar ZIP (CDN)
- **Google Fonts API:** Cargar fuentes dinámicas

### Browser Support
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Mobile: Chrome Android, Safari iOS

---

## 7. Security Considerations

- No se envían imágenes a ningún servidor
- Todo procesamiento es client-side
- Sanitización del texto de watermark (XSS prevention)
- CSP headers recomendados para deploy

---

## 8. Performance

- Lazy load de fuentes solo cuando se necesitan
- Debounce en previsualización (300ms)
- Canvas usa requestAnimationFrame para renders
- Imágenes redimensionadas si son muy grandes (>4000px)
