import { FONTS, FONT_CATEGORIES } from '../utils/constants.js';

export default class FontLoader {
  constructor() {
    this.loadedFonts = new Set();
  }

  loadFont(fontFamily) {
    // Extract just the font name (e.g., "Poppins" from "'Poppins', sans-serif")
    const fontName = this.extractFontName(fontFamily);

    if (this.loadedFonts.has(fontName)) {
      return Promise.resolve();
    }

    // For document.fonts.load, use just the font name
    if (typeof document !== 'undefined' && document.fonts) {
      return document.fonts.load(`16px "${fontName}"`).then(() => {
        this.loadedFonts.add(fontName);
      }).catch(() => {
        // If font loading fails, just mark as loaded to avoid blocking
        this.loadedFonts.add(fontName);
      });
    }

    this.loadedFonts.add(fontName);
    return Promise.resolve();
  }

  loadCategoryFonts(category) {
    const fonts = FONTS[category] || [];
    return Promise.all(fonts.map(font => {
      const family = typeof font === 'string' ? font : font.family;
      return this.loadFont(family);
    }));
  }

  getFontsByCategory(category) {
    return FONTS[category] || [];
  }

  getCategories() {
    return FONT_CATEGORIES;
  }

  extractFontName(fontFamily) {
    // Extract font name from formats like "'Poppins', sans-serif" or "Roboto"
    const match = fontFamily.match(/['"]([^'"]+)['"]/);
    return match ? match[1] : fontFamily.split(',')[0].trim();
  }
}
