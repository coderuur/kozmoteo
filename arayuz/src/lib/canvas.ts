import { MatchResult } from './types';
import { BrutalTruth, DuoRelationshipReport, ConfessionItem, getHumanizedPersona } from './viral';

// Ortak Kozmik Nebula & Yıldız Arka Planı
const drawSharedBackground = (ctx: CanvasRenderingContext2D) => {
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

  // Yıldız Tozu
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

  // Dış Çerçeve & Köşe Köşegenleri
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1000, 1840);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(55, 55, 970, 1810);

  ctx.fillStyle = '#FFE8A3';
  ctx.font = '22px Georgia, serif';
  ctx.fillText('✦', 65, 80);
  ctx.fillText('✦', 1015, 80);
  ctx.fillText('✦', 65, 1840);
  ctx.fillText('✦', 1015, 1840);
};

// Metin Sarmalama Yardımcısı
const wrapCanvasText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxW: number,
  lineH: number,
  maxLines = 4
) => {
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

// Paylaş veya İndir Tetikleyicisi
const saveOrShareCanvas = async (canvas: HTMLCanvasElement, filename: string, title: string, text: string) => {
  if (navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title, text, files: [file] });
          return;
        }
      }
    } catch (e) {}
  }
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
};

// -------------------------------------------------------------
// 1. TEKLİ MAJESTİK HİKAYE KARTI
// -------------------------------------------------------------
export const downloadStoryCard = async (result: MatchResult): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawSharedBackground(ctx);

  const cx = 540;
  const cy = 720;

  // Astrolabe Çemberleri
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 280, 0, Math.PI * 2);
  ctx.stroke();

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
  ctx.restore();

  // Başlıklar
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('✦   K O Z M O - T E O   ✦', 540, 240);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('B İ L İ N Ç A L T I   İ N A N Ç   A R K E T İ P İ', 540, 285);

  // Arketip Adı
  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
  ctx.shadowBlur = 30;
  ctx.fillText(result.archetype.toUpperCase(), 540, 640);

  // Yüzde
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 150px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.shadowBlur = 45;
  ctx.fillText(`%${result.similarity_percentage}`, 540, 785);
  ctx.shadowBlur = 0;

  // Rozet
  const beliefLabel = `✦  ${result.belief_name.replace(/\s*\([^)]*\)/g, '').trim().toUpperCase()}  ✦`;
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const badgeWidth = Math.max(480, ctx.measureText(beliefLabel).width + 60);
  const badgeX = (1080 - badgeWidth) / 2;
  const badgeY = 880;

  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, 60, 30);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE8A3';
  ctx.fillText(beliefLabel, 540, badgeY + 40);

  // Felsefi Tanım
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 34px Georgia, serif';
  wrapCanvasText(ctx, `"${result.description.replace(/\s*\([^)]*\)/g, '').trim()}"`, 540, 1070, 820, 52, 4);

  // Günün Ruhsal Pratiği
  const boxY = 1320;
  ctx.fillStyle = 'rgba(18, 15, 30, 0.7)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(140, boxY, 800, 290, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✦  G Ü N Ü N   R U H S A L   P R A T İ Ğ İ  ✦', 540, boxY + 60);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'italic 30px Georgia, serif';
  wrapCanvasText(ctx, result.daily_reflection, 540, boxY + 145, 720, 46, 3);

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Senin inanç pusulan ne söylüyor?', 540, 1715);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('kozmoteo.vercel.app  ·  kozmoteo.netlify.app', 540, 1765);

  await saveOrShareCanvas(
    canvas,
    `KozmoTeo_${result.archetype.replace(/\s+/g, '_')}.png`,
    `Kozmo-Teo: ${result.archetype}`,
    `Benim Kozmo-Teo inanç arketipim: ${result.archetype} • %${result.similarity_percentage}! kozmoteo.vercel.app`
  );
};

// -------------------------------------------------------------
// 2. SOKRATES'İN AYNASI (RUH TOKADI) STORY KARTI
// -------------------------------------------------------------
export const downloadSocraticStoryCard = async (result: MatchResult, brutal: BrutalTruth): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawSharedBackground(ctx);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('✦   S O K R A T E S \' İ N   A Y N A S I   ✦', 540, 240);

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('V A R O L U Ş S A L   R U H   T O K A D I', 540, 290);

  // Arketip Rozeti
  const tag = `✦  ${result.archetype.toUpperCase()} • %${result.similarity_percentage}  ✦`;
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagW = ctx.measureText(tag).width + 50;
  ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect((1080 - tagW) / 2, 350, tagW, 50, 25);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fda4af';
  ctx.fillText(tag, 540, 384);

  // Acımasız Gerçek (Tırnak İçinde Büyük Metin)
  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 120px Georgia, serif';
  ctx.fillText('“', 540, 520);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'italic 44px Georgia, serif';
  ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
  ctx.shadowBlur = 25;
  wrapCanvasText(ctx, brutal.quote, 540, 610, 840, 64, 5);
  ctx.shadowBlur = 0;

  // Kutu 1: Zihinsel Çelişkin
  const box1Y = 990;
  ctx.fillStyle = 'rgba(18, 15, 30, 0.85)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(120, box1Y, 840, 220, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚡  Z İ H İ N S E L   Ç E L İ Ş K İ N', 540, box1Y + 50);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '30px Georgia, serif';
  wrapCanvasText(ctx, brutal.contradiction, 540, box1Y + 115, 760, 44, 3);

  // Kutu 2: Tarihteki Ruh İkizin
  const box2Y = 1260;
  ctx.fillStyle = 'rgba(18, 15, 30, 0.85)';
  ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(120, box2Y, 840, 190, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🌌  T A R İ H T E K İ   R U H   İ K İ Z İ N', 540, box2Y + 50);

  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText(brutal.historicalMirror, 540, box2Y + 120);

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Kendi karanlığınla yüzleşmeye cesaretin var mı?', 540, 1715);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('kozmoteo.vercel.app  ·  kozmoteo.netlify.app', 540, 1765);

  await saveOrShareCanvas(
    canvas,
    `KozmoTeo_RuhTokadi_${result.archetype.replace(/\s+/g, '_')}.png`,
    `Kozmo-Teo: Sokrates'in Aynası`,
    `Sokrates'in Aynası bana şunu dedi: "${brutal.quote}" - Kendi karanlığını çöz: kozmoteo.vercel.app`
  );
};

// -------------------------------------------------------------
// 3. KOZMİK İLİŞKİ & ÇATIŞMA (DUO 2.0) STORY KARTI
// -------------------------------------------------------------
export const downloadDuoStoryCard = async (
  userResult: MatchResult,
  partnerName: string,
  report: DuoRelationshipReport
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawSharedBackground(ctx);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('✦   K O Z M O - T E O   ✦', 540, 220);

  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('F E L S E F İ   U Y U M   &   Ç A T I Ş M A   R A P O R U', 540, 265);

  // İki Ruhun Karşılaşması (Sol: Ben, Sağ: Partner)
  // Sol Kart (Ben)
  ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(100, 340, 390, 180, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#9ca3af';
  ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('BENİM ARKETİPİM', 295, 380);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText(userResult.archetype, 295, 430);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`%${userResult.similarity_percentage}`, 295, 485);

  // Sağ Kart (Partner)
  ctx.fillStyle = 'rgba(103, 232, 249, 0.1)';
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(590, 340, 390, 180, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#9ca3af';
  ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${(partnerName || 'PARTNER').toUpperCase()}`, 785, 380);

  ctx.fillStyle = '#a5f3fc';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText(report.partnerArchetype, 785, 430);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('EŞLEŞTİ', 785, 485);

  // Merkez Uyum Skoru Çemberi
  ctx.fillStyle = '#07060c';
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(540, 680, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 88px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
  ctx.shadowBlur = 35;
  ctx.fillText(`%${report.compatibilityScore}`, 540, 710);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#9ca3af';
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('RUHSAL UYUM', 540, 755);

  // Karar Rozeti
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const bText = report.verdictBadge;
  const bW = ctx.measureText(bText).width + 60;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect((1080 - bW) / 2, 850, bW, 54, 27);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE8A3';
  ctx.fillText(bText, 540, 886);

  // İlişki Başlığı
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.fillText(`"${report.title}"`, 540, 960);

  // Zehirli Çatışma Riski Barı
  ctx.fillStyle = '#9ca3af';
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Zehirli Çatışma Riski: %${report.conflictRisk} • ${report.conflictLabel}`, 540, 1020);

  ctx.fillStyle = '#1e1b2e';
  ctx.beginPath();
  ctx.roundRect(240, 1045, 600, 16, 8);
  ctx.fill();

  const fillGrad = ctx.createLinearGradient(240, 0, 840, 0);
  fillGrad.addColorStop(0, '#10b981');
  fillGrad.addColorStop(0.5, '#f59e0b');
  fillGrad.addColorStop(1, '#ef4444');
  ctx.fillStyle = fillGrad;
  ctx.beginPath();
  ctx.roundRect(240, 1045, 600 * (report.conflictRisk / 100), 16, 8);
  ctx.fill();

  // Kutu: İlişkinizin Felsefi Paradoksu
  const boxY = 1100;
  ctx.fillStyle = 'rgba(18, 15, 30, 0.85)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(100, boxY, 880, 270, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✦  A Ş K I N I Z I N   P A R A D O K S U  ✦', 540, boxY + 45);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 28px Georgia, serif';
  wrapCanvasText(ctx, report.dynamics, 540, boxY + 105, 800, 42, 4);

  // Kutu 2: En Büyük Kavga Noktanız
  const box2Y = 1400;
  ctx.fillStyle = 'rgba(18, 15, 30, 0.85)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(100, box2Y, 880, 180, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚠️  E N   B Ü Y Ü K   K A V G A   N O K T A N I Z', 540, box2Y + 45);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = '26px Georgia, serif';
  wrapCanvasText(ctx, report.biggestFightTopic, 540, box2Y + 95, 800, 38, 2);

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Sizin frekansınız yüzde kaç uyuşuyor?', 540, 1715);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('kozmoteo.vercel.app  ·  kozmoteo.netlify.app', 540, 1765);

  await saveOrShareCanvas(
    canvas,
    `KozmoTeo_Duo_${userResult.archetype}_${report.partnerArchetype}.png`,
    `Kozmo-Teo: Felsefi Uyum Raporu`,
    `Bizim felsefi uyumumuz %${report.compatibilityScore} çıktı! • ${report.title} - Seninki kaç? kozmoteo.vercel.app`
  );
};

// -------------------------------------------------------------
// 4. KOZMİK İTİRAF & GECE FISILTISI KARTI
// -------------------------------------------------------------
export const downloadConfessionCard = async (confession: ConfessionItem): Promise<void> => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawSharedBackground(ctx);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('✦   K O Z M O - T E O   ✦', 540, 260);

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('G E C E   F I S I L T I S I   &   İ T İ R A F', 540, 310);

  // Tag
  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`✦ ${confession.archetype} • ${confession.timestamp} ✦`, 540, 420);

  // Büyük Tırnak
  ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
  ctx.font = 'bold 160px Georgia, serif';
  ctx.fillText('“', 540, 620);

  // İtiraf Metni
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'italic 46px Georgia, serif';
  ctx.shadowColor = 'rgba(192, 132, 252, 0.5)';
  ctx.shadowBlur = 30;
  wrapCanvasText(ctx, `"${confession.text}"`, 540, 720, 840, 68, 8);
  ctx.shadowBlur = 0;

  // Yankılanma Sayısı
  ctx.fillStyle = 'rgba(192, 132, 252, 0.15)';
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(280, 1340, 520, 70, 35);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e9d5ff';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`🌌  ${confession.echoCount} Zihin Bu Fısıltıyı Yankıladı`, 540, 1385);

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Senin zihninde hangi fısıltı yankılanıyor?', 540, 1715);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('kozmoteo.vercel.app  ·  kozmoteo.netlify.app', 540, 1765);

  await saveOrShareCanvas(
    canvas,
    `KozmoTeo_Fisilti_${confession.id}.png`,
    `Kozmo-Teo Gece Fısıltısı`,
    `"${confession.text}" - Kozmik fısıltıları dinle: kozmoteo.vercel.app`
  );
};

// -------------------------------------------------------------
// 5. HALK DİLİYLE SEN • KOZMİK KİMLİK KARTI (STORY)
// -------------------------------------------------------------
export const downloadHumanizedStoryCard = async (result: MatchResult): Promise<void> => {
  if (typeof window === 'undefined') return;

  const persona = getHumanizedPersona(result.archetype);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawSharedBackground(ctx);

  ctx.textAlign = 'center';

  // Üst Başlık
  ctx.fillStyle = '#FFE58F';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('✦   K O Z M O - T E O   ✦', 540, 220);

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('H A L K   D İ L İ Y L E   S E N   •   K İ M L İ K   K A R T I', 540, 265);

  // Arketip & Yüzde
  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 48px Georgia, serif';
  ctx.fillText(result.archetype, 540, 370);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Uyum: %${result.similarity_percentage}`, 540, 420);

  // Pop-Kültür İkizi Rozeti
  const twinText = `Ruh İkizin: ${persona.popCultureTwin}`;
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const twinW = ctx.measureText(twinText).width + 60;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect((1080 - twinW) / 2, 460, twinW, 56, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.fillText(twinText, 540, 497);

  // Popüler Başlık & Alıntı
  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.fillText(persona.title, 540, 600);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'italic 34px Georgia, serif';
  wrapCanvasText(ctx, `"${persona.everydayYou}"`, 540, 670, 840, 52, 4);

  // Özellikler (Hashtagsiz, Nokta Ayraçlı)
  const tagsStr = persona.threeWords.join('   ·   ');
  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(tagsStr, 540, 930);

  // Kutu 1: Red Flag
  const redBoxY = 1010;
  ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(120, redBoxY, 840, 190, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('R E D   F L A G', 540, redBoxY + 50);

  ctx.fillStyle = '#fda4af';
  ctx.font = '28px Georgia, serif';
  wrapCanvasText(ctx, persona.redFlag, 540, redBoxY + 110, 760, 42, 2);

  // Kutu 2: Green Flag
  const greenBoxY = 1240;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(120, greenBoxY, 840, 190, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('G R E E N   F L A G', 540, greenBoxY + 50);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = '28px Georgia, serif';
  wrapCanvasText(ctx, persona.greenFlag, 540, greenBoxY + 110, 760, 42, 2);

  // Hassas Noktan
  const triggerY = 1490;
  ctx.fillStyle = 'rgba(18, 15, 30, 0.85)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(120, triggerY, 840, 140, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✦   H A S S A S   N O K T A N   ✦', 540, triggerY + 45);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '26px Georgia, serif';
  wrapCanvasText(ctx, persona.triggersYou, 540, triggerY + 95, 760, 38, 2);

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Senin bilinçaltı arketipin ne?', 540, 1715);

  ctx.fillStyle = '#FFE699';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('kozmoteo.vercel.app  ·  kozmoteo.netlify.app', 540, 1765);

  await saveOrShareCanvas(
    canvas,
    `KozmoTeo_Kimlik_${result.archetype.replace(/\s+/g, '_')}.png`,
    `Kozmo-Teo Kimlik Kartım: ${result.archetype}`,
    `Benim Kozmo-Teo kimliğim: ${persona.title} - ${result.archetype}! Seninki ne? Çöz: kozmoteo.vercel.app`
  );
};
