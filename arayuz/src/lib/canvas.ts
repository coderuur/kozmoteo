import { MatchResult } from './types';

export const downloadStoryCard = async (result: MatchResult): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, '#0a0a0d');
  grad.addColorStop(0.5, '#16161f');
  grad.addColorStop(1, '#08080a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Stardust
  ctx.fillStyle = '#D4AF37';
  for (let i = 0; i < 180; i++) {
    const x = (Math.sin(i * 123) * 0.5 + 0.5) * 1080;
    const y = (Math.cos(i * 45) * 0.5 + 0.5) * 1920;
    const r = (i % 3) + 1;
    ctx.globalAlpha = (i % 6 + 2) / 10;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Gold Ornate Borders
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 960, 1800);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 80, 920, 1760);

  // Header
  ctx.fillStyle = '#9ca3af';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦  KOZMO - TEO  ✦', 540, 220);

  ctx.fillStyle = '#D4AF37';
  ctx.font = '28px Georgia, serif';
  ctx.fillText('BİLİNÇALTI İNANÇ ARKETİPİ', 540, 290);

  // Archetype
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 74px Georgia, serif';
  ctx.fillText(result.archetype, 540, 650);

  // Percentage
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 160px Georgia, serif';
  ctx.fillText(`%${result.similarity_percentage}`, 540, 840);

  // Belief Name
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText(result.belief_name, 540, 960);

  // Wrap text helper
  const wrapText = (text: string, x: number, y: number, maxW: number, lineH: number) => {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxW && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineH;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  // Description
  ctx.fillStyle = '#d1d5db';
  ctx.font = 'italic 34px Georgia, serif';
  wrapText(`"${result.description}"`, 540, 1100, 800, 48);

  // Daily Reflection
  ctx.fillStyle = '#9ca3af';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText('GÜNÜN RUHSAL PRATİĞİ', 540, 1400);

  ctx.fillStyle = '#e5e7eb';
  ctx.font = 'italic 30px Georgia, serif';
  wrapText(result.daily_reflection, 540, 1460, 780, 44);

  // Footer Watermark
  ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
  ctx.font = '26px sans-serif';
  ctx.fillText('Senin arketipin hangisi?  •  test.kozmoteo.com', 540, 1750);

  // Web Share API check for mobile devices
  if (navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const file = new File([blob], `KozmoTeo_${result.archetype.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Kozmo-Teo: ${result.archetype}`,
            text: `Benim Kozmo-Teo inanç arketipim: ${result.archetype} (%${result.similarity_percentage})!`,
            files: [file]
          });
          return;
        }
      }
    } catch (e) {
      // User cancelled share or fallback to download
    }
  }

  // Fallback to direct download
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.download = `KozmoTeo_${result.archetype.replace(/\s+/g, '_')}.png`;
  a.href = dataUrl;
  a.click();
};
