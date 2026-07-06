import { $, show, hide } from './utils/dom.js';
import { DEFAULTS } from './utils/constants.js';
import ImageUploader from './modules/ImageUploader.js';
import WatermarkEngine from './modules/WatermarkEngine.js';
import UIController from './modules/UIController.js';
import DownloadManager from './modules/DownloadManager.js';

class App {
  constructor() {
    this.state = { ...DEFAULTS };
    this.images = [];
    this.selectedIndex = 0;
    this.canvas = $('#previewCanvas');
    this.toastTimeout = null;
    this.isAddingImages = false;

    this.watermarkEngine = new WatermarkEngine(this.canvas);
    this.downloadManager = new DownloadManager();

    this.uiController = new UIController(this.state, (newState) => {
      this.state = newState;
      this.render();
    });

    this.imageUploader = new ImageUploader((images) => {
      this.addImages(images);
    });

    this.uiController.init();
    this.imageUploader.setupEventListeners();

    const downloadBtn = $('#downloadBtn');
    downloadBtn.addEventListener('click', () => this.download());

    const clearBtn = $('#clearBtn');
    clearBtn.addEventListener('click', () => this.clearAll());
  }

  clearAll() {
    this.images = [];
    this.selectedIndex = 0;

    const dropZone = $('#dropZone');
    const canvasContainer = $('#canvasContainer');
    const thumbnailsContainer = $('#thumbnails');
    const fileInput = $('#fileInput');

    dropZone.classList.remove('hidden');
    canvasContainer.classList.add('hidden');
    thumbnailsContainer.classList.add('hidden');
    thumbnailsContainer.innerHTML = '';

    // Reset file input
    fileInput.value = '';

    this.uiController.enableDownload(false);
  }

  addImages(newImages) {
    if (this.isAddingImages) return;
    this.isAddingImages = true;

    try {
      const validImages = newImages.filter(img => img !== null);
      if (validImages.length === 0) return;

      // Deduplicate by src
      const existingSrcs = new Set(this.images.map(img => img.img.src));
      const uniqueNewImages = validImages.filter(img => !existingSrcs.has(img.img.src));

      if (uniqueNewImages.length === 0) {
        this.showToast('Esta imagen ya fue agregada');
        return;
      }

      if (uniqueNewImages.length < validImages.length) {
        const skipped = validImages.length - uniqueNewImages.length;
        this.showToast(`${skipped} imagen(es) ya existente(s) no fueron agregadas`);
      }

      this.images = [...this.images, ...uniqueNewImages];
      this.selectedIndex = this.images.length - 1;
      this.showImages();
    } finally {
      this.isAddingImages = false;
    }
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  removeImage(index) {
    if (this.images.length <= 1) {
      // Reset to initial state
      this.images = [];
      this.selectedIndex = 0;
      const dropZone = $('#dropZone');
      const canvasContainer = $('#canvasContainer');
      const thumbnailsContainer = $('#thumbnails');
      dropZone.classList.remove('hidden');
      canvasContainer.classList.add('hidden');
      thumbnailsContainer.classList.add('hidden');
      this.uiController.enableDownload(false);
    } else {
      this.images.splice(index, 1);
      if (this.selectedIndex >= this.images.length) {
        this.selectedIndex = this.images.length - 1;
      }
      this.showImages();
    }
  }

  showImages() {
    if (this.images.length === 0) return;

    this.renderThumbnails();
    this.selectImage(this.selectedIndex);
    this.uiController.enableDownload(true);
  }

  renderThumbnails() {
    const thumbnailsContainer = $('#thumbnails');
    thumbnailsContainer.innerHTML = '';
    thumbnailsContainer.classList.remove('hidden');

    this.images.forEach((imageObj, index) => {
      const thumbWrapper = document.createElement('div');
      thumbWrapper.style.position = 'relative';
      thumbWrapper.style.display = 'inline-block';

      const thumb = document.createElement('img');
      thumb.src = imageObj.img.src;
      thumb.className = 'thumbnail' + (index === this.selectedIndex ? ' active' : '');
      thumb.dataset.index = index;
      thumb.addEventListener('click', () => this.selectImage(index));

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '×';
      removeBtn.className = 'thumbnail-remove';
      removeBtn.dataset.index = index;
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeImage(index);
      });

      thumbWrapper.appendChild(thumb);
      thumbWrapper.appendChild(removeBtn);
      thumbnailsContainer.appendChild(thumbWrapper);
    });

    // Add "add more" button
    const addMoreWrapper = document.createElement('div');
    addMoreWrapper.style.position = 'relative';
    addMoreWrapper.style.display = 'inline-block';

    const addMoreThumb = document.createElement('div');
    addMoreThumb.className = 'thumbnail thumbnail-add';
    addMoreThumb.innerHTML = '+';
    addMoreThumb.title = 'Agregar más imágenes';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.accept = 'image/jpeg,image/png,image/webp';
    hiddenInput.multiple = true;
    hiddenInput.style.display = 'none';
    hiddenInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const validFiles = files.filter(file => validTypes.includes(file.type));
        const imagePromises = validFiles.map(file => this.loadImage(file));
        Promise.all(imagePromises).then(images => {
          this.addImages(images);
        });
      }
    });

    addMoreThumb.addEventListener('click', () => hiddenInput.click());

    addMoreWrapper.appendChild(addMoreThumb);
    addMoreWrapper.appendChild(hiddenInput);
    thumbnailsContainer.appendChild(addMoreWrapper);
  }

  loadImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve({ img, filename: file.name });
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  selectImage(index) {
    this.selectedIndex = index;

    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.thumbnail:not(.thumbnail-add)');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // Show canvas and hide drop zone
    const dropZone = $('#dropZone');
    const canvasContainer = $('#canvasContainer');
    dropZone.classList.add('hidden');
    canvasContainer.classList.remove('hidden');

    this.watermarkEngine.setImage(this.images[index].img);
    this.render();
  }

  render() {
    if (this.images.length === 0) return;
    this.watermarkEngine.render(this.state);
  }

  async download() {
    if (this.images.length === 0) return;

    // Store original state
    const originalImage = this.images[this.selectedIndex].img;

    // Render all images to canvases
    const canvases = [];
    const filename = this.images[0].filename;

    for (let i = 0; i < this.images.length; i++) {
      const img = this.images[i].img;

      // Create canvas with image dimensions
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Apply watermark (preserveCanvas preserves the drawn image)
      this.watermarkEngine.setCanvas(canvas);
      this.watermarkEngine.setImage(img);
      this.watermarkEngine.render(this.state, true);

      canvases.push(canvas);
    }

    // Restore main canvas
    this.watermarkEngine.setCanvas(this.canvas);
    this.watermarkEngine.setImage(originalImage);
    this.render();

    // Download
    if (canvases.length === 1) {
      this.downloadManager.downloadSingle(canvases[0], filename);
    } else {
      this.downloadManager.downloadMultiple(canvases, filename);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
