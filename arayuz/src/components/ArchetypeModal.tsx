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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ width: '320px', height: '568px', backgroundImage: 'linear-gradient(135deg, #0a0a0c 0%, #1a1a1e 100%)', border: '2px solid #D4AF37', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', position: 'relative', boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)', marginBottom: '20px' }}>
        <h4 style={{ color: '#9ca3af', letterSpacing: '4px', fontSize: '12px', marginTop: '20px' }}>KOZMO-TEO PROFİLİ</h4>
        <div style={{ margin: '50px 0 30px 0' }}>
          <h1 style={{ color: '#D4AF37', fontSize: '30px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>{result.archetype}</h1>
          <h2 style={{ color: '#e5e7eb', fontSize: '56px', margin: '10px 0 0 0' }}>%{result.similarity_percentage}</h2>
        </div>
        <p style={{ color: '#d1d5db', fontSize: '17px', fontFamily: '"Georgia", serif', fontStyle: 'italic', marginBottom: '20px', padding: '0 10px' }}>
          {result.belief_name.split('/')[0]}
        </p>
        <div style={{ position: 'absolute', bottom: '30px', width: '100%', left: 0, borderTop: '1px solid #4a4a52', paddingTop: '15px', fontSize: '11px', color: '#6b7280', letterSpacing: '1px' }}>
          Senin arketipin hangisi?<br/>test.kozmoteo.com
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          style={{ padding: '12px 24px', backgroundColor: '#D4AF37', color: '#0a0a0c', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          {isExporting ? 'Görsel Hazırlanıyor...' : '📥 Hikaye Kartını İndir (PNG)'}
        </button>
        <button
          onClick={onClose}
          style={{ padding: '12px 24px', backgroundColor: '#1a1a1e', color: '#e5e7eb', border: '1px solid #4a4a52', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
