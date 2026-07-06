import { $ } from '../utils/dom.js';

export default class ImageUploader {
  constructor(onImagesLoaded) {
    this.onImagesLoaded = onImagesLoaded;
    this.images = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    const dropZone = $('#dropZone');
    const fileInput = $('#fileInput');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');

      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) {
        this.showToast('No se detectó ningún archivo');
        return;
      }

      this.handleFiles(Array.from(files));
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        this.handleFiles(Array.from(fileInput.files));
        // Reset input to allow selecting the same files again
        fileInput.value = '';
      }
    });
  }

  handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));

    if (validFiles.length === 0) {
      this.showToast('Formato no soportado. Usa JPG, PNG o WebP.');
      return;
    }

    if (validFiles.length < files.length) {
      this.showToast(`Solo se procesarán ${validFiles.length} imagen(es) válida(s)`);
    }

    const imagePromises = validFiles.map(file => this.loadImage(file));

    Promise.all(imagePromises).then(images => {
      this.images = images;
      this.onImagesLoaded(this.images);
    });
  }

  loadImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ img, filename: file.name });
        };
        img.onerror = () => {
          this.showToast(`Error cargando: ${file.name}`);
          resolve(null);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  showToast(message) {
    const toast = $('#toast');
    const toastMessage = $('#toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  getImages() {
    return this.images;
  }
}
