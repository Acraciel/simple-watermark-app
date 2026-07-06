import { $, debounce } from '../utils/dom.js';
import { FONTS, FONT_CATEGORIES, OPACITY_LEVELS, WATERMARK_TYPES, DEFAULTS } from '../utils/constants.js';
import FontLoader from './FontLoader.js';

export default class UIController {
  constructor(state, onStateChange) {
    this.state = state;
    this.onStateChange = onStateChange;
    this.fontLoader = new FontLoader();
  }

  init() {
    this.populateFontCategory();
    this.populateFontFamily(this.state.fontCategory);
    this.bindEvents();
    this.updateUI();
  }

  populateFontCategory() {
    const fontCategorySelect = $('#fontCategory');
    fontCategorySelect.innerHTML = '';
    FONT_CATEGORIES.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      fontCategorySelect.appendChild(option);
    });
  }

  populateFontFamily(category) {
    const fontFamilySelect = $('#fontFamily');
    fontFamilySelect.innerHTML = '';
    const fonts = this.fontLoader.getFontsByCategory(category);
    fonts.forEach(font => {
      const option = document.createElement('option');
      option.value = font.family;
      option.textContent = font.name;
      option.style.fontFamily = font.family;
      fontFamilySelect.appendChild(option);
    });
    const defaultFont = fonts[0]?.family || DEFAULTS.fontFamily;
    this.updateState('fontFamily', defaultFont);
  }

  bindEvents() {
    const watermarkTextInput = $('#watermarkText');
    watermarkTextInput.addEventListener('input', debounce((e) => {
      this.updateState('watermarkText', e.target.value || DEFAULTS.watermarkText);
    }, 300));

    const watermarkTypeGroup = $('#watermarkTypeGroup');
    watermarkTypeGroup.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      const value = pill.dataset.value;
      this.updateState('watermarkType', value);
      this.updateRadioGroupUI('watermarkTypeGroup', value);
      const positionControl = $('#positionControl');
      positionControl.style.display = value === 'signature' ? '' : 'none';
    });

    const positionGrid = $('#positionGrid');
    positionGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.position-btn');
      if (!btn) return;
      const position = btn.dataset.position;
      this.updateState('position', position);
      this.updatePositionUI(position);
    });

    const opacityGroup = $('#opacityGroup');
    opacityGroup.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      const value = pill.dataset.value;
      const level = OPACITY_LEVELS.find(l => l.id === value);
      if (level) {
        this.updateState('opacity', level.value);
        this.updateRadioGroupUI('opacityGroup', value);
      }
    });

    const fontCategorySelect = $('#fontCategory');
    fontCategorySelect.addEventListener('change', async (e) => {
      const category = e.target.value;
      this.updateState('fontCategory', category);
      await this.fontLoader.loadCategoryFonts(category);
      this.populateFontFamily(category);
    });

    const fontFamilySelect = $('#fontFamily');
    fontFamilySelect.addEventListener('change', async (e) => {
      const value = e.target.value;
      await this.fontLoader.loadFont(value);
      this.updateState('fontFamily', value);
    });

    const fontSizeSlider = $('#fontSize');
    fontSizeSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value, 10);
      const fontSizeInput = $('#fontSizeInput');
      fontSizeInput.value = value;
      this.updateState('fontSize', value);
    });

    const fontSizeInput = $('#fontSizeInput');
    fontSizeInput.addEventListener('change', (e) => {
      let value = parseInt(e.target.value, 10);
      value = Math.max(12, Math.min(72, value));
      const fontSizeSlider = $('#fontSize');
      fontSizeSlider.value = value;
      e.target.value = value;
      this.updateState('fontSize', value);
    });
  }

  updateState(key, value) {
    this.state[key] = value;
    this.onStateChange(this.state);
  }

  updateRadioGroupUI(groupId, activeValue) {
    const group = $(`#${groupId}`);
    const pills = group.querySelectorAll('.pill');
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.value === activeValue);
    });
  }

  updatePositionUI(activePosition) {
    const positionGrid = $('#positionGrid');
    const buttons = positionGrid.querySelectorAll('.position-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.position === activePosition);
    });
  }

  updateUI() {
    const watermarkTextInput = $('#watermarkText');
    watermarkTextInput.value = this.state.watermarkText;

    this.updateRadioGroupUI('watermarkTypeGroup', this.state.watermarkType);

    const opacityLevel = OPACITY_LEVELS.find(l => l.value === this.state.opacity);
    this.updateRadioGroupUI('opacityGroup', opacityLevel?.id);

    this.updatePositionUI(this.state.position);

    const fontCategorySelect = $('#fontCategory');
    fontCategorySelect.value = this.state.fontCategory;

    const fontSizeSlider = $('#fontSize');
    const fontSizeInput = $('#fontSizeInput');
    fontSizeSlider.value = this.state.fontSize;
    fontSizeInput.value = this.state.fontSize;

    const positionControl = $('#positionControl');
    positionControl.style.display = this.state.watermarkType === 'signature' ? '' : 'none';
  }

  enableDownload(enabled) {
    const downloadBtn = $('#downloadBtn');
    downloadBtn.disabled = !enabled;
  }
}