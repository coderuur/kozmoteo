import React, { useState } from 'react';
import { MatchResult } from '../lib/types';
import { downloadStoryCard } from '../lib/canvas';
import { playTone } from '../lib/audio';

interface ArchetypeModalProps {
  result: MatchResult;
  onClose: () => void;
  soundEnabled: boolean;
}

export const ArchetypeModal: React.FC<ArchetypeModalProps> = ({ result, onClose, soundEnabled }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    playTone(720, 'sine', 0.5, soundEnabled);
    try {
      await downloadStoryCard(result);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#07060b',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* 9:16 MAJESTİK HİKAYE ÖNİZLEME KARTI */}
      <div style={{
        width: '340px',
        height: '604px',
        background: 'linear-gradient(180deg, #07060c 0%, #130f26 40%, #0e0a1c 80%, #06050a 100%)',
        border: '2px solid #D4AF37',
        borderRadius: '20px',
        position: 'relative',
        boxShadow: '0 0 60px rgba(212, 175, 55, 0.28), inset 0 0 40px rgba(212, 175, 55, 0.08)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 20px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Arka Plan Ethereal Nebula Parıltısı */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(138, 43, 226, 0.15) 50%, transparent 80%)',
          pointerEvents: 'none',
          borderRadius: '50%'
        }} />

        {/* Kutsal Geometri / Astrolabe Çemberi */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '240px',
          height: '240px',
          border: '1px dashed rgba(212, 175, 55, 0.25)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '210px',
          height: '210px',
          border: '1px solid rgba(212, 175, 55, 0.18)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* İç İnce Altın Çerçeve & Köşe Süsleri */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '14px',
          pointerEvents: 'none'
        }}>
          <span style={{ position: 'absolute', top: '4px', left: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
          <span style={{ position: 'absolute', top: '4px', right: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '4px', left: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '4px', right: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
        </div>

        {/* ÜST BAŞLIK ALANI */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h4 style={{
            color: '#FFE699',
            letterSpacing: '5px',
            fontSize: '11px',
            margin: '0 0 4px 0',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold'
          }}>
            ✦ KOZMO-TEO ✦
          </h4>
          <p style={{
            color: '#9ca3af',
            letterSpacing: '3px',
            fontSize: '9px',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            Bilinçaltı İnanç Arketipi
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
            opacity: 0.6
          }}>
            <span style={{ height: '1px', width: '40px', background: '#D4AF37' }} />
            <span style={{ color: '#D4AF37', fontSize: '10px' }}>✧</span>
            <span style={{ height: '1px', width: '40px', background: '#D4AF37' }} />
          </div>
        </div>

        {/* ORTA ANA BÖLÜM: ARKETİP + YÜZDE + ROZET */}
        <div style={{ position: 'relative', zIndex: 2, margin: '15px 0' }}>
          <h1 style={{
            color: '#FFE699',
            fontSize: '26px',
            margin: '0 0 6px 0',
            letterSpacing: '1px',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            textShadow: '0 0 25px rgba(212, 175, 55, 0.7)'
          }}>
            {result.archetype}
          </h1>

          <div style={{
            color: '#FFFFFF',
            fontSize: '62px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            margin: '6px 0 14px 0',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(212, 175, 55, 0.3)'
          }}>
            %{result.similarity_percentage}
          </div>

          {/* İnanç Rozeti */}
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.55)',
            borderRadius: '20px',
            color: '#FFE8A3',
            fontSize: '12px',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            letterSpacing: '1px',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.15)'
          }}>
            ✦ {result.belief_name.split('/')[0].trim().toUpperCase()} ✦
          </div>

          {/* Felsefi Alıntı / Açıklama Özeti (Parantezsiz ve Akıcı) */}
          <p style={{
            color: '#cbd5e1',
            fontSize: '12px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            lineHeight: '1.5',
            margin: '18px auto 0 auto',
            maxWidth: '280px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            "{result.description.replace(/\s*\([^)]*\)/g, '').trim()}"
          </p>
        </div>

        {/* ALT VİRAL ALAN */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(212, 175, 55, 0.25)',
          paddingTop: '12px'
        }}>
          <p style={{
            fontSize: '10px',
            color: '#94a3b8',
            letterSpacing: '1px',
            margin: '0 0 4px 0'
          }}>
            Senin inanç pusulan ne söylüyor?
          </p>
          <p style={{
            fontSize: '11px',
            color: '#FFE699',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            letterSpacing: '2px',
            margin: 0
          }}>
            ✦ test.kozmoteo.com ✦
          </p>
        </div>
      </div>

      {/* BUTONLAR */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 50%, #AA820A 100%)',
            color: '#07060c',
            border: 'none',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            letterSpacing: '0.5px',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isExporting ? 'Görsel Hazırlanıyor...' : '✨ Hikaye Kartını İndir'}
        </button>

        <button
          onClick={onClose}
          style={{
            padding: '14px 24px',
            backgroundColor: '#12101c',
            color: '#e2e8f0',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
