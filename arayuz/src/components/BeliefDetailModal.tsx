import React from 'react';
import { MatchResult } from '../lib/types';
import { renderWithTooltips } from '../lib/dictionary';

interface BeliefDetailModalProps {
  result: MatchResult;
  onClose: () => void;
}

export const BeliefDetailModal: React.FC<BeliefDetailModalProps> = ({ result, onClose }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#07060b', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, padding: '20px' }}>
      <div style={{ backgroundColor: '#121215', borderRadius: '12px', border: '1px solid #D4AF37', maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflow: 'hidden' }}>
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #2a2a30', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121215', zIndex: 10 }}>
          <h2 style={{ color: '#D4AF37', margin: 0, fontSize: '24px' }}>{result.belief_name}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '32px', cursor: 'pointer', lineHeight: '1', padding: '0 5px' }}>×</button>
        </div>
        <div className="hide-scroll" style={{ padding: '30px', overflowY: 'auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #2a2a30' }}>Felsefi ve Teolojik İnceleme</p>
          <p style={{ color: '#e5e7eb', fontSize: '15px', lineHeight: '1.8', marginBottom: '30px', textAlign: 'justify' }}>
            {renderWithTooltips(result.details)}
          </p>
          <h4 style={{ color: '#e5e7eb', marginBottom: '15px', letterSpacing: '1px' }}>Önemli Temsilciler:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
            {result.figures.map((fig, i) => (
              <span key={i} style={{ padding: '6px 14px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', borderRadius: '20px', fontSize: '13px', color: '#d1d5db' }}>
                {fig}
              </span>
            ))}
          </div>
          <h4 style={{ color: '#e5e7eb', marginBottom: '15px', letterSpacing: '1px' }}>Tarihten İzler:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.quotes.map((q, i) => (
              <div key={i} style={{ padding: '15px', backgroundColor: 'rgba(214, 175, 55, 0.05)', borderLeft: '3px solid #D4AF37', fontStyle: 'italic', fontSize: '14px', color: '#d1d5db', lineHeight: '1.6' }}>
                "{q}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
