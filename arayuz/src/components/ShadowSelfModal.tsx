'use client';
import React, { useState, useRef } from 'react';
import { computeShadowSelf, ShadowSelf } from '../lib/shadow';
import { playTone } from '../lib/audio';

interface ShadowSelfModalProps {
  vector5d: number[];
  primaryBelief: string;
  primaryArchetype: string;
  soundEnabled: boolean;
  onClose: () => void;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#FFE699';
const PURPLE_DARK = '#130f24';
const PURPLE_BORDER = '#8A2BE2';

export const ShadowSelfModal: React.FC<ShadowSelfModalProps> = ({
  vector5d, primaryBelief, primaryArchetype, soundEnabled, onClose
}) => {
  const shadow: ShadowSelf = computeShadowSelf(vector5d, primaryBelief);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'reveal' | 'integrate'> ('intro');

  const handleReveal = () => {
    playTone(180, 'sine', 1.2, soundEnabled);
    setTimeout(() => playTone(216, 'sine', 0.8, soundEnabled), 400);
    setRevealed(true);
    setPhase('reveal');
  };

  const suppressionPct = Math.round(shadow.suppressionScore * 100);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.90)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: PURPLE_DARK, border: `1.5px solid ${PURPLE_BORDER}`, borderRadius: '14px', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px 24px', position: 'relative', boxShadow: '0 0 80px rgba(138,43,226,0.35)' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}>×</button>

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>✦ GÖLGE BENLİK ANALİZİ ✦</div>
          <h2 style={{ color: GOLD_LIGHT, fontSize: '24px', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Bilinçaltındaki Bastırılmış Kimlik</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>C.G. Jung'un deyimiyle: "Gölgeyi görmezden gelmek onu güçlendirir."</p>
        </div>

        {phase === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            {/* Birincil arketip */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}`, borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', marginBottom: '6px' }}>Bilinçli Kimliğin</div>
              <div style={{ fontSize: '20px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{primaryArchetype}</div>
            </div>

            <div style={{ color: '#c084fc', fontSize: '28px', margin: '14px 0' }}>↓</div>

            {/* Gizli gölge */}
            <div style={{ backgroundColor: 'rgba(138,43,226,0.12)', border: `1px solid ${PURPLE_BORDER}`, borderRadius: '10px', padding: '20px', marginBottom: '24px', filter: revealed ? 'none' : 'blur(6px)', transition: 'filter 0.5s ease', userSelect: revealed ? 'auto' : 'none' }}>
              <div style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '2px', marginBottom: '6px' }}>Bastırılmış Gölge Arketipin</div>
              <div style={{ fontSize: '20px', color: '#f0abfc', fontWeight: 'bold' }}>{shadow.suppressedArchetype}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{shadow.suppressedBelief}</div>
            </div>

            {!revealed ? (
              <button
                onClick={handleReveal}
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #8A2BE2 0%, #6b21a8 100%)', border: 'none', color: '#ffffff', borderRadius: '24px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 0 30px rgba(138,43,226,0.5)' }}
              >
                🌑 Gölgeni Görmek İstiyor musun?
              </button>
            ) : (
              <button
                onClick={() => setPhase('reveal')}
                style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`, border: 'none', color: '#07060c', borderRadius: '24px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                Derinleşmeye Devam Et →
              </button>
            )}
          </div>
        )}

        {phase === 'reveal' && (
          <>
            {/* Baskı skoru */}
            <div style={{ backgroundColor: '#1a1030', borderRadius: '10px', border: '1px solid #3d2d6a', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Baskı Yoğunluğu</span>
                <span style={{ fontSize: '14px', color: '#c084fc', fontWeight: 'bold' }}>{suppressionPct}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#251a40', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${suppressionPct}%`, height: '100%', background: 'linear-gradient(90deg, #8A2BE2, #c084fc)', borderRadius: '4px', transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '10px', color: '#6b7280' }}>Hafif Latent</span>
                <span style={{ fontSize: '10px', color: '#6b7280' }}>Derin Baskı</span>
              </div>
            </div>

            {/* Jungian etiket + çatışma ekseni */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, backgroundColor: '#13111f', borderRadius: '8px', border: '1px solid #2d2645', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Jungian Kategori</div>
                <div style={{ fontSize: '12px', color: '#c084fc', fontWeight: 'bold' }}>{shadow.jungianLabel}</div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#13111f', borderRadius: '8px', border: '1px solid #2d2645', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>En Büyük Çatışma Ekseni</div>
                <div style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 'bold' }}>{shadow.conflictAxis}</div>
              </div>
            </div>

            {/* Gölge arketipin sesi */}
            <div style={{ backgroundColor: 'rgba(138,43,226,0.1)', border: `1px solid ${PURPLE_BORDER}`, borderRadius: '10px', padding: '18px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Gölgenin Sesi — {shadow.suppressedArchetype}</div>
              <p style={{ color: '#f0e6ff', fontSize: '15px', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.7', margin: 0 }}>
                {shadow.shadowQuote}
              </p>
            </div>

            {/* Entegrasyon tavsiyesi */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Jungian Entegrasyon Tavsiyesi</div>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{shadow.integrationAdvice}</p>
            </div>

            <button
              onClick={() => setPhase('integrate')}
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #8A2BE2 0%, #6b21a8 100%)', border: 'none', color: '#ffffff', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginBottom: '10px' }}
            >
              🧬 Gölgeyi Entegre Et — Tamamlanmış Arketip
            </button>
            <button onClick={() => setPhase('intro')} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #3d2d6a', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>← Geri</button>
          </>
        )}

        {phase === 'integrate' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>☯️</div>
              <h3 style={{ color: GOLD_LIGHT, fontSize: '20px', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Tamamlanmış Ruh Portresi</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Işık ve gölgenin birliği — Jung'un individuasyon süreci</p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: GOLD, letterSpacing: '2px', marginBottom: '8px' }}>IŞIK BENLİK</div>
                <div style={{ fontSize: '16px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{primaryArchetype}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Bilinçli kimliğin</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#c084fc' }}>+</div>
              <div style={{ flex: 1, backgroundColor: 'rgba(138,43,226,0.12)', border: `1px solid ${PURPLE_BORDER}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#c084fc', letterSpacing: '2px', marginBottom: '8px' }}>GÖLGE BENLİK</div>
                <div style={{ fontSize: '16px', color: '#f0abfc', fontWeight: 'bold' }}>{shadow.suppressedArchetype}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Bastırılmış potansiyelin</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#1a1030', border: '1px solid #4a3e68', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Entegrasyon Pratiği</div>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.8', margin: '0 0 12px 0' }}>
                Bu hafta <strong style={{ color: GOLD_LIGHT }}>{shadow.suppressedArchetype}</strong> arketipine ait bir perspektifi bilinçli olarak dene. Reddettiğin o düşüncenin taşıdığı bilgeliği, kendi inancınla çatıştırmak yerine onu bir ayna olarak kullan.
              </p>
              <div style={{ backgroundColor: 'rgba(212,175,55,0.08)', borderLeft: '3px solid #c084fc', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', color: '#d1d5db', fontStyle: 'italic' }}>
                "{shadow.integrationAdvice}"
              </div>
            </div>

            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`, border: 'none', color: '#07060c', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              ✦ Kapat ve Devam Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
