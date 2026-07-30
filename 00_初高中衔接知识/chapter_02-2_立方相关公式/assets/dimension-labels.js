import * as THREE from './vendor/three-r160/three.module.min.js?v=20260731-esm';

  const CANVAS_HEIGHT = 200;

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function texture(text, color = '#0f172a') {
    const value = String(text);
    const length = value.length;
    const width = length === 1 ? 240 : length <= 3 ? 360 : 640;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    const fontSize = length === 1 ? 122 : length <= 3 ? 100 : 76;

    ctx.clearRect(0, 0, width, CANVAS_HEIGHT);
    ctx.shadowColor = 'rgba(15,23,42,.26)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'rgba(255,255,255,.99)';
    roundedRect(ctx, 14, 20, width - 28, CANVAS_HEIGHT - 40, 30);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 7;
    ctx.strokeStyle = color;
    roundedRect(ctx, 14, 20, width - 28, CANVAS_HEIGHT - 40, 30);
    ctx.stroke();
    ctx.font = `900 ${fontSize}px Georgia, "Times New Roman", "Noto Sans SC", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 12;
    ctx.strokeStyle = 'rgba(255,255,255,.99)';
    ctx.strokeText(value, width / 2, CANVAS_HEIGHT / 2 + 2);
    ctx.fillStyle = color;
    ctx.fillText(value, width / 2, CANVAS_HEIGHT / 2 + 2);

    const result = new THREE.CanvasTexture(canvas);
    result.minFilter = THREE.LinearFilter;
    result.magFilter = THREE.LinearFilter;
    result.needsUpdate = true;
    return result;
  }

  function spriteSize(scale = 1, text = '') {
    const length = String(text).length;
    const width = length === 1 ? .84 : length <= 3 ? 1.32 : 2.0;
    return [width * scale, .70 * scale, 1];
  }

export const DGDimensionLabels = {texture, spriteSize};
