'use client';

import React, { useState } from 'react';
import { MatchResult } from '../lib/types';
import { getDuoRelationshipReport, DuoRelationshipReport } from '../lib/viral';
import { downloadDuoStoryCard } from '../lib/canvas';
import { playTone, playCosmicChime } from '../lib/audio';

interface DuoReportModalProps {
  userResult: MatchResult;
  partnerName?: string;
  partnerArchetype: string;
  partnerPercentage: number;
  soundEnabled: boolean;
  onClose: () => void;
}

export const DuoReportModal: React.FC<DuoReportModalProps> = ({
  userResult,
  partnerName = 'Arkadaşın',
  partnerArchetype,
  partnerPercentage,
  soundEnabled,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const report: DuoRelationshipReport = getDuoRelationshipReport(
    userResult,
    partnerArchetype,
    partnerPercentage
  );

  const handleDownloadStory = async () => {
    setIsExporting(true);
    playTone(720, 'sine', 0.5, soundEnabled);
    try {
      await downloadDuoStoryCard(userResult, partnerName, report);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyShareLink = () => {
    playCosmicChime(soundEnabled);
    if (typeof window !== 'undefined') {
      const shareText = `Bizim Kozmo-Teo felsefi uyumumuz %${report.compatibilityScore} çıktı! • ${report.title} 🔥 Bakalım seninki kaç: ${window.location.origin}`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
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
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        backgroundColor: '#110f1c',
        border: '1.5px solid #D4AF37',
        borderRadius: '18px',
        padding: '30px 24px',
        boxShadow: '0 0 60px rgba(212, 175, 55, 0.28)',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Üst Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ✦ KOZMO-TEO İLİŞKİ & DÜELLO ✦
          </span>
          <h3 style={{ color: '#FFE699', fontSize: '24px', margin: '6px 0 2px 0', fontFamily: 'Georgia, serif' }}>
            {report.title}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
            {report.subtitle}
          </p>
        </div>

        {/* Karşılaştırma Kartları (Sol: Ben, Sağ: Partner) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid #D4AF37',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', letterSpacing: '1px' }}>SEN</span>
            <h4 style={{ color: '#FFE699', margin: '4px 0', fontSize: '14px', fontFamily: 'Georgia, serif' }}>
              {userResult.archetype}
            </h4>
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '20px' }}>
              %{userResult.similarity_percentage}
            </span>
          </div>

          <div style={{
            backgroundColor: 'rgba(103, 232, 249, 0.08)',
            border: '1px solid #67e8f9',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', letterSpacing: '1px' }}>{partnerName.toUpperCase()}</span>
            <h4 style={{ color: '#67e8f9', margin: '4px 0', fontSize: '14px', fontFamily: 'Georgia, serif' }}>
              {partnerArchetype}
            </h4>
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '20px' }}>
              %{partnerPercentage || 80}
            </span>
          </div>
        </div>

        {/* Uyum Skoru Rozeti */}
        <div style={{
          textAlign: 'center',
          backgroundColor: '#0a0912',
          border: '1px solid #2d2645',
          borderRadius: '14px',
          padding: '20px 16px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Ruhsal Çekim & Frekans Uyumu
          </span>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#FFE699',
            margin: '4px 0',
            textShadow: '0 0 25px rgba(212, 175, 55, 0.4)'
          }}>
            %{report.compatibilityScore}
          </div>
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #D4AF37',
            color: '#FFE8A3',
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '4px 14px',
            borderRadius: '20px'
          }}>
            {report.verdictBadge}
          </span>

          {/* Zehirli Çatışma Riski */}
          <div style={{ marginTop: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px' }}>
              <span>⚔️ Zehirli Çatışma Riski:</span>
              <span style={{ color: report.conflictRisk >= 75 ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                %{report.conflictRisk} • {report.conflictLabel}
              </span>
            </div>
            <div style={{ width: '100%', height: '7px', backgroundColor: '#1e1b2e', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${report.conflictRisk}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ef4444 100%)'
              }} />
            </div>
          </div>
        </div>

        {/* Dinamik İlişki Paradoksu */}
        <div style={{
          backgroundColor: '#0e0c18',
          border: '1px solid #2d2645',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h5 style={{ color: '#FFE699', fontSize: '13px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✦ Aşkınızın / Arkadaşlığınızın Paradoksu
          </h5>
          <p style={{ color: '#e2e8f0', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
            "{report.dynamics}"
          </p>
        </div>

        {/* En Büyük Kavga Noktanız */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <h5 style={{ color: '#f87171', fontSize: '12px', margin: '0 0 4px 0' }}>
            ⚠️ En Çok Neden Kavga Edeceksiniz?
          </h5>
          <p style={{ color: '#fca5a5', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
            {report.biggestFightTopic}
          </p>
        </div>

        {/* Butonlar: Story İndir + WhatsApp Paylaş */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleDownloadStory}
            disabled={isExporting}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
              color: '#07060c',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isExporting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
            }}
          >
            {isExporting ? '⏳ Hikaye Kartı Hazırlanıyor...' : '📸 İkili Hikaye Kartı İndir'}
          </button>

          <button
            onClick={handleCopyShareLink}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #3d3558',
              color: '#cbd5e1',
              borderRadius: '24px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {copied ? '✅ Uyum Raporu Panoya Kopyalandı!' : '🔗 WhatsApp & Mesajla Paylaş'}
          </button>
        </div>
      </div>
    </div>
  );
};
