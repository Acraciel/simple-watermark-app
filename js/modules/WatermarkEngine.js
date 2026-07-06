export default class WatermarkEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.image = null;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  setImage(img) {
    this.image = img;
  }

  render(state, preserveCanvas = false) {
    if (!this.image) return;

    if (!preserveCanvas) {
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;
      this.ctx.drawImage(this.image, 0, 0);
    }

    this.ctx.save();

    const fontSize = state.fontSize * 2;
    this.ctx.font = `${fontSize}px ${state.fontFamily}`;
    this.ctx.fillStyle = state.textColor;
    this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.globalAlpha = state.opacity;
    this.ctx.textBaseline = 'middle';

    if (state.watermarkType === 'signature') {
      this.renderSignature(state);
    } else {
      this.renderMosaic(state);
    }

    this.ctx.restore();
  }

  renderSignature(state) {
    const fontSize = state.fontSize * 2;
    const position = state.position;
    const text = state.watermarkText;

    const [vertical, horizontal] = position.split('-');

    let x, y;
    const padding = fontSize;

    if (vertical === 'top') {
      y = padding;
    } else if (vertical === 'middle') {
      y = this.canvas.height / 2;
    } else {
      y = this.canvas.height - padding;
    }

    const metrics = this.ctx.measureText(text);

    if (horizontal === 'left') {
      x = padding;
    } else if (horizontal === 'center') {
      x = (this.canvas.width - metrics.width) / 2;
    } else {
      x = this.canvas.width - padding - metrics.width;
    }

    this.ctx.fillText(text, x, y);
  }

  renderMosaic(state) {
    const fontSize = state.fontSize * 2;
    const text = state.watermarkText;

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate(-Math.PI / 4);

    const textWidth = this.ctx.measureText(text).width;
    const spacing = textWidth + fontSize;
    const diagonal = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2);

    for (let x = -diagonal; x < diagonal; x += spacing) {
      for (let y = -diagonal; y < diagonal; y += spacing * 0.7) {
        this.ctx.fillText(text, x, y);
      }
    }
  }

  getDataURL() {
    return this.canvas.toDataURL('image/png');
  }

  getBlob() {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, 'image/png');
    });
  }
}
