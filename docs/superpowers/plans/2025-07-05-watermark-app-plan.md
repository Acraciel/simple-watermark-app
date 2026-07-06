# Watermark App - Implementation Plan

**Goal:** App web mobile-first para añadir marcas de agua personales a imágenes con interfaz glassmorphism y gradientes.

**Architecture:** Vanilla JS modular con principios SOLID. Módulos: upload, renderizado canvas, carga fuentes, sincronización UI, descarga. 100% client-side.

**Tech Stack:** HTML5, CSS3 (custom properties), JavaScript ES6+ modules, JSZip (CDN), Google Fonts API

---

## File Structure

```
watermark/
├── index.html
├── css/
│   ├── main.css           # Variables, reset
│   ├── components.css     # Componentes UI
│   └── responsive.css     # Media queries
├── js/
│   ├── app.js             # Entry point
│   ├── modules/
│   │   ├── ImageUploader.js
│   │   ├── WatermarkEngine.js
│   │   ├── FontLoader.js
│   │   ├── UIController.js
│   │   └── DownloadManager.js
│   └── utils/
│       ├── dom.js
│       └── constants.js
```

---

## Tasks

### Task 1: constants.js y dom.js
- Create: `js/utils/constants.js` - FONTS (3 categorías × 5 fuentes), OPACITY_LEVELS, POSITIONS, DEFAULTS
- Create: `js/utils/dom.js` - $, $$, show, hide, enable, disable, debounce

### Task 2: index.html
- Create: `index.html` - Estructura HTML semántica, drop zone, canvas, controles (texto, tipo, opacidad, categoría fuente, fuente, tamaño, posición), botón descargar, toast

### Task 3: CSS (main.css, components.css, responsive.css)
- Create: `css/main.css` - Variables CSS (colores glassmorphism), reset, utilities
- Create: `css/components.css` - Header, drop zone, canvas, inputs, radio pills, position grid, slider, buttons, toast
- Create: `css/responsive.css` - Media queries mobile/tablet

### Task 4: ImageUploader.js
- Create: `js/modules/ImageUploader.js` - Drag & drop, click para seleccionar, validación tipo archivo, FileReader, callback onImageLoaded

### Task 5: FontLoader.js
- Create: `js/modules/FontLoader.js` - Carga dinámica de Google Fonts por categoría, cache de fuentes cargadas

### Task 6: WatermarkEngine.js
- Create: `js/modules/WatermarkEngine.js` - setImage, render (firma o mosaico diagonal), getDataURL, getBlob

### Task 7: UIController.js
- Create: `js/modules/UIController.js` - Población dinámica de selects, bind events, sincronización estado-UI, enable/disable download

### Task 8: DownloadManager.js
- Create: `js/modules/DownloadManager.js` - downloadSingle (imagen directa), downloadMultiple (ZIP con JSZip)

### Task 9: app.js
- Create: `js/app.js` - Clase App, coordinación de módulos, render loop, event handler download

---

## Self-Review

1. **Spec coverage:** ✅ Upload drag-drop, Firma + Mosaico, 3 opacidades, 3 categorías × 5 fuentes, posición 3×3, tamaño, blanco+shadow, download directo
2. **Placeholder scan:** Sin TBD/TODO
3. **Type consistency:** Nombres consistentes entre módulos

---

**Plan saved.** Dos opciones de ejecución:

**1. Subagent-Driven (recomendado)** - Un subagent por tarea, revisión entre tareas
**2. Inline Execution** - Ejecutar tareas en esta sesión con checkpoints

¿Cuál prefieres?