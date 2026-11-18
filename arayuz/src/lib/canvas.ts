import { MatchResult } from './types';

export const downloadStoryCard = async (result: MatchResult): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Derin Kozmik Boşluk & Nebula Arka Planı
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
  bgGrad.addColorStop(0, '#06050a');
  bgGrad.addColorStop(0.25, '#0d0a18');
  bgGrad.addColorStop(0.5, '#15102a');
  bgGrad.addColorStop(0.75, '#0e0b1c');
  bgGrad.addColorStop(1, '#050408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Ethereal Altın & Mor Nebula Parıltıları
  const nebula1 = ctx.createRadialGradient(540, 720, 20, 540, 720, 580);
  nebula1.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
  nebula1.addColorStop(0.4, 'rgba(138, 43, 226, 0.12)');
  nebula1.addColorStop(0.8, 'rgba(20, 14, 40, 0.05)');
  nebula1.addColorStop(1, 'transparent');
  ctx.fillStyle = nebula1;
  ctx.fillRect(0, 0, 1080, 1920);

  const nebula2 = ctx.createRadialGradient(540, 1480, 10, 540, 1480, 450);
  nebula2.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
  nebula2.addColorStop(0.6, 'rgba(75, 0, 130, 0.06)');
  nebula2.addColorStop(1, 'transparent');
  ctx.fillStyle = nebula2;
  ctx.fillRect(0, 0, 1080, 1920);

  // 2. Yıldız Tozu & Takımyıldız Parıltıları
  for (let i = 0; i < 220; i++) {
    const x = ((Math.sin(i * 197.3) * 0.5 + 0.5) * 1040) + 20;
    const y = ((Math.cos(i * 73.7) * 0.5 + 0.5) * 1880) + 20;
    const radius = (i % 7 === 0) ? 2.5 : (i % 3 === 0 ? 1.8 : 1.0);
    const alpha = (i % 5 + 3) / 10;

    ctx.fillStyle = i % 4 === 0 ? '#FFE8A3' : '#FFFFFF';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Bazı parlak yıldızlara 4 köşeli parlama ekle
    if (i % 18 === 0) {
      ctx.strokeStyle = 'rgba(255, 232, 163, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x, y + 8);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1.0;

  // 3. Kutsal Geometri / Astrolabe Kozmik Çemberleri (Merkez: 540, 720)
  const cx = 540;
  const cy = 720;

  ctx.save();
  // Dış Kesikli Halka
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.stroke();

  // İnce İç Halka
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 280, 0, Math.PI * 2);
  ctx.stroke();

  // 12 Astroloji / Felsefe Işını
  for (let a = 0; a < 12; a++) {
    const angle = (a * Math.PI) / 6;
    const x1 = cx + Math.cos(angle) * 280;
    const y1 = cy + Math.sin(angle) * 280;
    const x2 = cx + Math.cos(angle) * 315;
    const y2 = cy + Math.sin(angle) * 315;

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 45 Derece Döndürülmüş Çift Kare (Sekiz Köşeli Ruh Geometrisi)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 1;
  const side = 380;
  ctx.strokeRect(cx - side / 2, cy - side / 2, side, side);
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.strokeRect(-side / 2, -side / 2, side, side);
  ctx.restore();

  // 4. Majestik Kraliyet Çerçevesi (Çift Kat Altın + Köşe Süsleri)
  const borderGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
  borderGrad.addColorStop(0, '#AA820A');
  borderGrad.addColorStop(0.3, '#FFE699');
  borderGrad.addColorStop(0.5, '#D4AF37');
  borderGrad.addColorStop(0.8, '#FFE699');
  borderGrad.addColorStop(1, '#AA820A');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(60, 60, 960, 1800);

  // İç İnce Çerçeve
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(76, 76, 928, 1768);

  // Köşe Baklava / Yıldız Süsleri
  const corners = [
    [76, 76],
    [1004, 76],
    [76, 1844],
    [1004, 1844]
  ];
  corners.forEach(([kx, ky]) => {
    ctx.fillStyle = '#FFE699';
    ctx.beginPath();
    ctx.arc(kx, ky, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(kx - 16, ky);
    ctx.lineTo(kx + 16, ky);
    ctx.moveTo(kx, ky - 16);
    ctx.lineTo(kx, ky + 16);
    ctx.stroke();
  });

  // 5. Başlık Bölümü (Header)
  ctx.textAlign = 'center';

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillText('✦  K O Z M O  -  T E O  ✦', 540, 195);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('B İ L İ N Ç A L T I   İ N A N Ç   A R K E T İ P İ', 540, 245);

  // İnce Ayırıcı Çizgi
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(380, 280);
  ctx.lineTo(700, 280);
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = '18px Georgia, serif';
  ctx.fillText('✧', 540, 286);

  // 6. Arketip Adı & Parıldama
  ctx.save();
  ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 78px Georgia, serif';
  ctx.fillText(result.archetype, 540, 600);
  ctx.restore();

  // 7. Yüzde Göstergesi (%100 vb.)
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 175px Georgia, serif';
  ctx.fillText(`%${result.similarity_percentage}`, 540, 790);
  ctx.restore();

  // 8. İnanç Sistemi Rozeti (Pill Badge)
  const beliefLabel = `✦  ${result.belief_name.toUpperCase()}  ✦`;
  ctx.font = 'bold 34px Georgia, serif';
  const badgeMetrics = ctx.measureText(beliefLabel);
  const badgeWidth = Math.min(840, badgeMetrics.width + 80);
  const badgeHeight = 64;
  const badgeX = 540 - badgeWidth / 2;
  const badgeY = 880;

  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 32);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE8A3';
  ctx.fillText(beliefLabel, 540, badgeY + 44);

  // 9. Metin Sarmalama Yardımcısı
  const wrapText = (text: string, x: number, startY: number, maxW: number, lineH: number, maxLines = 4) => {
    const words = text.split(' ');
    let line = '';
    let currY = startY;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxW && n > 0) {
        lineCount++;
        if (lineCount >= maxLines) {
          ctx.fillText(line.trim() + '...', x, currY);
          return currY;
        }
        ctx.fillText(line.trim(), x, currY);
        line = words[n] + ' ';
        currY += lineH;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currY);
    return currY;
  };

  // 10. Arketip Felsefi Tanımı (Aura Alıntısı)
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 34px Georgia, serif';
  wrapText(`"${result.description}"`, 540, 1070, 820, 52, 4);

  // 11. "Günün Ruhsal Pratiği" Kart Kutusu
  const boxX = 140;
  const boxY = 1320;
  const boxW = 800;
  const boxH = 290;

  ctx.fillStyle = 'rgba(18, 15, 30, 0.7)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✦  G Ü N Ü N   R U H S A L   P R A T İ Ğ İ  ✦', 540, boxY + 60);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(340, boxY + 85);
  ctx.lineTo(740, boxY + 85);
  ctx.stroke();

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'italic 30px Georgia, serif';
  wrapText(result.daily_reflection, 540, boxY + 145, 720, 46, 3);

  // 12. Viral Alt Bilgi (Footer / Watermark)
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Senin inanç pusulan ne söylüyor?', 540, 1715);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText('✦  test.kozmoteo.com  ✦', 540, 1765);

  // 13. Paylaşım & İndirme İşlemi
  if (navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const file = new File([blob], `KozmoTeo_${result.archetype.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Kozmo-Teo: ${result.archetype}`,
            text: `Benim Kozmo-Teo inanç arketipim: ${result.archetype} (%${result.similarity_percentage})! Kendi pusulanı test et: test.kozmoteo.com`,
            files: [file]
          });
          return;
        }
      }
    } catch (e) {
      // Paylaşım hatası durumunda indirmeye devam et
    }
  }

  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.download = `KozmoTeo_${result.archetype.replace(/\s+/g, '_')}.png`;
  a.href = dataUrl;
  a.click();
};
