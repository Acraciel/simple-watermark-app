export default class DownloadManager {
  downloadSingle(canvas, filename) {
    const anchor = document.createElement('a');
    anchor.download = filename.replace(/\.[^.]+$/, '') + '_watermarked.png';
    anchor.href = canvas.toDataURL('image/png');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  async downloadMultiple(canvases, originalFilename) {
    // canvases is an array of HTMLCanvasElement
    const zip = new JSZip();
    const baseName = originalFilename.replace(/\.[^.]+$/, '');

    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const dataURL = canvas.toDataURL('image/png');
      const base64 = dataURL.split(',')[1];
      const outFilename = canvases.length === 1
        ? `${baseName}_watermarked.png`
        : `${baseName}_${i + 1}_watermarked.png`;
      zip.file(outFilename, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${baseName}_watermarked.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }
}
