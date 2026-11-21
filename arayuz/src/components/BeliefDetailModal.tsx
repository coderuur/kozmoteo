'use client';

import React from 'react';
import { MatchResult } from '../lib/types';
import { renderWithTooltips } from '../lib/dictionary';
import { getPhilosophyDeepDive } from '../lib/philosophyData';

interface BeliefDetailModalProps {
  result: MatchResult;
  onClose: () => void;
}

export const BeliefDetailModal: React.FC<BeliefDetailModalProps> = ({ result, onClose }) => {
  const deepDive = getPhilosophyDeepDive(result.belief_name, result.archetype);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 5, 8, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#0d0d12',
        borderRadius: '16px',
        border: '1px solid rgba(255, 230, 153, 0.2)',
        maxWidth: '680px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'min(90vh, 800px)',
        overflow: 'hidden',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)'
      }}>
        {/* Üst Bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 230, 153, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0d0d12',
          flexShrink: 0
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
              ✦ FELSEFİ & TEOLOJİK İNCELEME
            </span>
            <h2 style={{ color: '#FFE699', margin: '4px 0 0 0', fontSize: '20px', fontFamily: 'Georgia, serif' }}>
              {result.belief_name.replace(/\s*\([^)]*\)/g, '').trim()}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '22px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Kaydırılabilir İçerik */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Motto */}
          <div style={{
            backgroundColor: 'rgba(255, 230, 153, 0.05)',
            borderLeft: '3px solid #FFE699',
            padding: '12px 16px',
            borderRadius: '0 8px 8px 0'
          }}>
            <p style={{ color: '#f8fafc', fontSize: '14px', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
              &ldquo;{deepDive.motto}&rdquo;
            </p>
          </div>

          {/* Temel Anlatım (Details & Extended Essay) */}
          <div>
            <h4 style={{ color: '#FFE699', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0', fontWeight: 600 }}>
              ✦ VAROLUŞSAL TEMEL & FELSEFİ ÖZ
            </h4>
            <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.75', margin: '0 0 12px 0', textAlign: 'justify' }}>
              {renderWithTooltips(result.details)}
            </p>
            {deepDive.extended_essay && deepDive.extended_essay.map((paragraph, idx) => (
              <p key={idx} style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.7', margin: '0 0 10px 0', textAlign: 'justify' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Önemli Temsilciler */}
          {result.figures && result.figures.length > 0 && (
            <div>
              <h4 style={{ color: '#FFE699', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0', fontWeight: 600 }}>
                ✦ ÖNEMLİ DÜŞÜNÜRLER & TEMSİLCİLER
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.figures.map((fig, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '5px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '999px',
                      fontSize: '12px',
                      color: '#e2e8f0'
                    }}
                  >
                    {fig}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tarihten İzler / Filozof Sözleri */}
          {deepDive.quotes && deepDive.quotes.length > 0 && (
            <div>
              <h4 style={{ color: '#FFE699', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0', fontWeight: 600 }}>
                ✦ TARİHTEKİ İZLER & KADİM ALINTILAR
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {deepDive.quotes.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '8px'
                    }}
                  >
                    <p style={{ color: '#f1f5f9', fontStyle: 'italic', fontSize: '13.5px', margin: '0 0 4px 0', lineHeight: 1.5 }}>
                      &ldquo;{q.quote}&rdquo;
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#FFE699', fontWeight: 600 }}>{q.author}</span>
                      <span style={{ color: '#64748b' }}>{q.context}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Başucu Kitapları & Kült Filmler */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Kitaplar */}
            {deepDive.books && deepDive.books.length > 0 && (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '16px' }}>
                <h4 style={{ color: '#FFE699', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0', fontWeight: 600 }}>
                  ✦ BAŞUCU KİTAPLARI
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {deepDive.books.map((b, idx) => (
                    <div key={idx} style={{ borderBottom: idx < deepDive.books.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none', paddingBottom: '8px' }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{b.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '3px' }}>{b.author}</div>
                      <p style={{ color: '#cbd5e1', fontSize: '11.5px', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>{b.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filmler */}
            {deepDive.movies && deepDive.movies.length > 0 && (
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '16px' }}>
                <h4 style={{ color: '#FFE699', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0', fontWeight: 600 }}>
                  ✦ SİNEMA ÖNERİLERİ
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {deepDive.movies.map((m, idx) => (
                    <div key={idx} style={{ borderBottom: idx < deepDive.movies.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none', paddingBottom: '8px' }}>
                      <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600 }}>{m.title} <span style={{ color: '#64748b', fontSize: '11px' }}>({m.year})</span></div>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '3px' }}>Yönetmen: {m.director}</div>
                      <p style={{ color: '#cbd5e1', fontSize: '11.5px', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>{m.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
