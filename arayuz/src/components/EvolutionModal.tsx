'use client';
import React, { useRef, useEffect, useState } from 'react';
import { EvolutionEntry, EvolutionAnalysis, analyzeEvolution, getEvolutionLog, clearEvolutionLog, getTimelinePoints } from '../lib/evolution';

interface EvolutionModalProps {
  onClose: () => void;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#FFE699';
const PURPLE = '#8b5cf6';

export const EvolutionModal: React.FC<EvolutionModalProps> = ({ onClose }) => {
  const [log, setLog] = useState<EvolutionEntry[]>([]);
  const [analysis, setAnalysis] = useState<EvolutionAnalysis | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loaded = getEvolutionLog();
    setLog(loaded);
    if (loaded.length >= 2) {
      setAnalysis(analyzeEvolution(loaded));
    }
  }, []);

  // Canvas çiz
  useEffect(() => {
    if (!canvasRef.current || log.length < 2) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Arka plan
    ctx.fillStyle = '#0d0a17';
    ctx.fillRect(0, 0, W, H);

    const pts = getTimelinePoints(log);
    if (pts.length < 2) return;

    const PAD = 32;
    const plotW = W - PAD * 2;
    const plotH = H - PAD * 2;

    // Izgara çizgileri
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD + (i / 4) * plotH;
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
    }

    // Çizgi
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const x = PAD + p.x * plotW;
      const y = PAD + p.y * plotH;
      if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Alan dolgusu
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const x = PAD + p.x * plotW;
      const y = PAD + p.y * plotH;
      if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.lineTo(PAD + pts[pts.length - 1].x * plotW, H - PAD);
    ctx.lineTo(PAD, H - PAD);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(212,175,55,0.25)');
    grad.addColorStop(1, 'rgba(212,175,55,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Noktalar ve etiketler
    pts.forEach(p => {
      const x = PAD + p.x * plotW;
      const y = PAD + p.y * plotH;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.fill();

      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.textAlign = 'center';
      ctx.fillText(`%${p.pct}`, x, y - 12);

      ctx.font = '8px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(p.date, x, H - PAD + 14);
    });

    // Y-eksen etiketleri
    ctx.textAlign = 'right';
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#6b7280';
    for (let i = 0; i <= 4; i++) {
      const pct = 100 - i * 25;
      const y = PAD + (i / 4) * plotH;
      ctx.fillText(`%${pct}`, PAD - 4, y + 3);
    }
  }, [log]);

  const handleClear = () => {
    if (confirm('Tüm evrim kaydın silinecek. Emin misin?')) {
      clearEvolutionLog();
      setLog([]);
      setAnalysis(null);
    }
  };

  const dim_labels = ['Tektanrıcılık', 'Ritüelizm', 'Ölüm Sonrası', 'Dogmatizm', 'Doğa'];
  const latestVec = log.length > 0 ? log[log.length - 1].vector_5d : null;
  const firstVec = log.length > 0 ? log[0].vector_5d : null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#0d0a17', border: `1.5px solid ${GOLD}`, borderRadius: '14px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px 24px', position: 'relative', boxShadow: `0 0 60px rgba(212,175,55,0.2)` }}>
        
        {/* Kapat */}
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>✦ FELSEFİ EVRİM HARİTASI ✦</div>
          <h2 style={{ color: GOLD_LIGHT, fontSize: '24px', fontFamily: 'Georgia, serif', margin: 0 }}>Ruhsal Dönüşüm Çizelgesi</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Her test, bilinçaltının bir anlık fotoğrafıdır.</p>
        </div>

        {log.length < 2 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#13111f', borderRadius: '10px', border: '1px dashed #332d4a' }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>📊</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.7' }}>
              Felsefi evrim haritası oluşabilmesi için en az <strong style={{ color: GOLD_LIGHT }}>2 ayrı test</strong> tamamlaman gerekiyor.<br />
              {log.length === 1 ? '1 test kayıtlı. Bir test daha çöz ve dönüşümünü gör!' : 'Henüz hiç test kaydın yok.'}
            </p>
          </div>
        ) : (
          <>
            {/* Evre badge */}
            {analysis && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ backgroundColor: 'rgba(139,92,246,0.2)', border: `1px solid ${PURPLE}`, color: '#c084fc', padding: '6px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  🌀 Evrim Evresi: {analysis.stageName}
                </span>
              </div>
            )}

            {/* Timeline Canvas */}
            <div style={{ backgroundColor: '#0d0a17', borderRadius: '8px', border: '1px solid #2d2645', marginBottom: '20px', overflow: 'hidden' }}>
              <canvas ref={canvasRef} width={580} height={180} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            {/* Arketip Yolculuğu */}
            {analysis && analysis.archetypeJourney.length > 1 && (
              <div style={{ backgroundColor: '#13111f', borderRadius: '10px', border: '1px solid #2d2645', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Arketip Yolculuğun</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {analysis.archetypeJourney.map((arch, i) => (
                    <React.Fragment key={i}>
                      <span style={{ backgroundColor: i === 0 ? 'rgba(107,114,128,0.2)' : i === analysis.archetypeJourney.length - 1 ? 'rgba(212,175,55,0.2)' : 'rgba(139,92,246,0.15)', border: `1px solid ${i === analysis.archetypeJourney.length - 1 ? GOLD : '#4a3e68'}`, color: i === analysis.archetypeJourney.length - 1 ? GOLD_LIGHT : '#d1d5db', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                        {arch}
                      </span>
                      {i < analysis.archetypeJourney.length - 1 && <span style={{ color: '#4a3e68', fontSize: '14px' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Boyut karşılaştırma */}
            {firstVec && latestVec && (
              <div style={{ backgroundColor: '#13111f', borderRadius: '10px', border: '1px solid #2d2645', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>5 Boyutlu Dönüşüm</div>
                {dim_labels.map((label, i) => {
                  const diff = latestVec[i] - firstVec[i];
                  const isUp = diff > 0.03;
                  const isDown = diff < -0.03;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ width: '100px', fontSize: '12px', color: '#9ca3af', flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#1e1a2e', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${latestVec[i] * 100}%`, height: '100%', background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: isUp ? '#10b981' : isDown ? '#f43f5e' : '#6b7280', width: '36px', textAlign: 'right', flexShrink: 0 }}>
                        {isUp ? `↑ +${diff.toFixed(2)}` : isDown ? `↓ ${diff.toFixed(2)}` : '→'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Evrim hikayesi */}
            {analysis && (
              <div style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Kozmik Hikaye</div>
                <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: analysis.evolutionStory.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${GOLD_LIGHT}">$1</strong>`) }}
                />
              </div>
            )}

            {/* İstatistik */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Toplam Test', val: `${analysis?.totalEntries ?? log.length}` },
                { label: 'Dominant Boyut', val: analysis?.dominantTheme ?? '—' },
                { label: 'En Büyük Kayma', val: analysis ? `${analysis.biggestShift.dimension} ${analysis.biggestShift.direction === 'up' ? '↑' : '↓'}` : '—' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#13111f', borderRadius: '8px', border: '1px solid #2d2645', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '13px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{s.val}</div>
                </div>
              ))}
            </div>

            <button onClick={handleClear} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #3d3558', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
              🗑 Tüm Evrim Kaydını Sil
            </button>
          </>
        )}
      </div>
    </div>
  );
};
