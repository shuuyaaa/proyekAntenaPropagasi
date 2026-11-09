import type { AntennaParams, RFMetrics } from '../types/antenna';

/**
 * Menghasilkan file SVG vektor skala 1:1 nyata dalam milimeter / centimeter
 * untuk dicetak pada kertas A4 / A3 sebagai panduan mal pemotongan aluminium foil.
 */
export function generateSpiralTemplateSVG(
  params: AntennaParams,
  metrics: RFMetrics
): string {
  const {
    spiralType,
    turns,
    wCm,
    sCm,
    rInCm,
    substrateWidthCm,
    substrateLengthCm,
    equiangularRate,
  } = params;

  // Konversi ke mm untuk rendering SVG yang kompatibel dengan print printer
  const wMm = wCm * 10;
  const sMm = sCm * 10;
  const rInMm = rInCm * 10;
  const subWMm = substrateWidthCm * 10;
  const subLMm = substrateLengthCm * 10;
  const rActiveMm = metrics.rActiveCm * 10;

  const thetaMax = turns * 2 * Math.PI;
  const segments = Math.max(120, Math.round(turns * 240));

  const bMm = (wMm + sMm) / (2 * Math.PI);
  const a = Math.max(0.05, equiangularRate);

  const halfW = subWMm / 2;
  const halfL = subLMm / 2;

  const getPoints = (angleOffset: number) => {
    const ptsInner: [number, number][] = [];
    const ptsOuter: [number, number][] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * thetaMax;
      const effectiveTheta = theta + angleOffset;

      let r1: number;
      let r2: number;

      if (spiralType === 'equiangular') {
        r1 = rInMm * Math.exp(a * theta);
        r2 = r1 + wMm;
      } else {
        r1 = rInMm + bMm * theta;
        r2 = r1 + wMm;
      }

      const cosT = Math.cos(effectiveTheta);
      const sinT = Math.sin(effectiveTheta);

      ptsInner.push([halfW + r1 * cosT, halfL - r1 * sinT]);
      ptsOuter.push([halfW + r2 * cosT, halfL - r2 * sinT]);
    }

    const poly: [number, number][] = [...ptsOuter];
    for (let i = ptsInner.length - 1; i >= 0; i--) {
      poly.push(ptsInner[i]);
    }
    return poly.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  };

  const arm1Path = getPoints(0);
  const arm2Path = getPoints(Math.PI);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${subWMm}mm" height="${subLMm}mm"
     viewBox="0 0 ${subWMm} ${subLMm}">
  <style>
    .board-bg { fill: #ffffff; stroke: #0284c7; stroke-width: 0.8; }
    .grid-line { stroke: #e2e8f0; stroke-width: 0.3; }
    .grid-line-major { stroke: #cbd5e1; stroke-width: 0.5; }
    .arm-1 { fill: #94a3b8; stroke: #334155; stroke-width: 0.5; fill-opacity: 0.85; }
    .arm-2 { fill: #cbd5e1; stroke: #475569; stroke-width: 0.5; fill-opacity: 0.85; }
    .feed-point { fill: #f59e0b; stroke: #b45309; stroke-width: 0.4; }
    .active-ring { stroke: #10b981; stroke-width: 0.8; stroke-dasharray: 2, 2; fill: none; }
    .text-title { font-family: sans-serif; font-size: 4px; font-weight: bold; fill: #0f172a; }
    .text-dim { font-family: monospace; font-size: 3.2px; fill: #475569; }
    .crosshair { stroke: #ef4444; stroke-width: 0.4; stroke-dasharray: 1, 1; }
  </style>

  <!-- Papan Board ${substrateWidthCm} x ${substrateLengthCm} cm -->
  <rect class="board-bg" x="0" y="0" width="${subWMm}" height="${subLMm}" rx="3" />

  <!-- Grid Bantu Milimeter (Tiap 1 cm = 10 mm) -->
  <g id="grid">
    ${Array.from({ length: Math.floor(subWMm / 10) + 1 }, (_, i) => {
      const x = i * 10;
      const isMajor = x % 50 === 0;
      return `<line class="${isMajor ? 'grid-line-major' : 'grid-line'}" x1="${x}" y1="0" x2="${x}" y2="${subLMm}" />`;
    }).join('\n    ')}
    ${Array.from({ length: Math.floor(subLMm / 10) + 1 }, (_, i) => {
      const y = i * 10;
      const isMajor = y % 50 === 0;
      return `<line class="${isMajor ? 'grid-line-major' : 'grid-line'}" x1="0" y1="${y}" x2="${subWMm}" y2="${y}" />`;
    }).join('\n    ')}
  </g>

  <!-- Crosshair Titik Pusat (0,0) -->
  <line class="crosshair" x1="${halfW - 25}" y1="${halfL}" x2="${halfW + 25}" y2="${halfL}" />
  <line class="crosshair" x1="${halfW}" y1="${halfL - 25}" x2="${halfW}" y2="${halfL + 25}" />

  <!-- Lengan 1 (Arm 1) -->
  <polygon class="arm-1" points="${arm1Path}" />

  <!-- Lengan 2 (Arm 2 - Rotasi 180 deg) -->
  <polygon class="arm-2" points="${arm2Path}" />

  <!-- Cincin Radiasi Aktif 658 MHz (Kanal 44 UHF) -->
  <circle class="active-ring" cx="${halfW}" cy="${halfL}" r="${rActiveMm.toFixed(2)}" />

  <!-- Titik Umpan Koaksial (Feed Points) -->
  <circle class="feed-point" cx="${(halfW + rInMm).toFixed(2)}" cy="${halfL.toFixed(2)}" r="1.0" />
  <circle class="feed-point" cx="${(halfW - rInMm).toFixed(2)}" cy="${halfL.toFixed(2)}" r="1.0" />

  <!-- 4 Lubang Baut Sudut M3 -->
  <circle cx="8" cy="8" r="1.6" fill="none" stroke="#475569" stroke-width="0.5" />
  <circle cx="${subWMm - 8}" cy="8" r="1.6" fill="none" stroke="#475569" stroke-width="0.5" />
  <circle cx="8" cy="${subLMm - 8}" r="1.6" fill="none" stroke="#475569" stroke-width="0.5" />
  <circle cx="${subWMm - 8}" cy="${subLMm - 8}" r="1.6" fill="none" stroke="#475569" stroke-width="0.5" />

  <!-- Label Informasi Desain dalam Satuan Centimeter (cm) -->
  <text class="text-title" x="12" y="16">MAL CETAK ANTENA SPIRAL — KELOMPOK VI</text>
  <text class="text-dim" x="12" y="21">EL234504 Antena &amp; Propagasi Radio &bull; S1 Teknik Elektro FTEIC ITS</text>
  <text class="text-dim" x="12" y="25">Target: Kanal 44 (658 MHz) &bull; Lebar w = ${wCm.toFixed(1)} cm &bull; Celah s = ${sCm.toFixed(1)} cm &bull; N = ${turns} turns</text>
  <text class="text-dim" x="12" y="29">r_in = ${rInCm.toFixed(1)} cm &bull; r_out = ${metrics.rOutCm.toFixed(2)} cm &bull; r_aktif (658 MHz) = ${metrics.rActiveCm.toFixed(2)} cm</text>
  <text class="text-dim" x="12" y="${subLMm - 10}">* Skala Cetak 1:1 Nyata (Gunakan 'Actual Size 100%' saat print)</text>
</svg>`;
}

export function downloadSpiralSVG(params: AntennaParams, metrics: RFMetrics) {
  const svgContent = generateSpiralTemplateSVG(params, metrics);
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Mal-Cetak-1-1-Kelompok6-Kanal${params.targetChannel}-${params.substrateWidthCm}x${params.substrateLengthCm}cm.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
