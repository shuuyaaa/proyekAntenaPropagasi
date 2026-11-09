import type { ImageFormat } from '../types/antenna';

export function exportCanvasImage(
  format: ImageFormat = 'png',
  channelNumber: number = 44,
  stationName: string = 'Trans TV'
) {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    console.error('Elemen kanvas 3D tidak ditemukan');
    return;
  }

  const cleanStation = stationName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Antena-Spiral-Kelompok6-CH${channelNumber}-${cleanStation}.${format}`;

  try {
    if (format === 'jpg') {
      // Untuk JPG: buat kanvas sementara dengan background solid agar tidak hitam/transparan
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#070a13';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);

        tempCanvas.toBlob(
          (blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          },
          'image/jpeg',
          0.96
        );
      }
    } else {
      // PNG format
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    console.error('Gagal mengekspor gambar kanvas:', err);
  }
}

