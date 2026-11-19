'use client';

import React, { useState } from 'react';
import {
  SOUL_DUEL_QUESTIONS,
  encodeSoulDuel,
  evaluateSoulDuel,
  SoulDuelData
} from '../lib/viral';
import { playTone, playCosmicChime } from '../lib/audio';

interface SoulDuelModalProps {
  mode: 'create' | 'play';
  duelData?: SoulDuelData | null;
  userArchetype?: string;
  userName?: string;
  soundEnabled: boolean;
  onClose: () => void;
  onTakeTest?: () => void;
}

export const SoulDuelModal: React.FC<SoulDuelModalProps> = ({
  mode,
  duelData,
  userArchetype = 'Bilinmeyen Yolcu',
  userName = 'Gezgin',
  soundEnabled,
  onClose,
  onTakeTest
}) => {
  // Creator State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [creatorName, setCreatorName] = useState(userName || 'Gezgin');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Guest State
  const [guestAnswers, setGuestAnswers] = useState<number[]>([]);
  const [duelResult, setDuelResult] = useState<{
    score: number;
    matchCount: number;
    title: string;
    comment: string;
  } | null>(null);

  const currentQ = SOUL_DUEL_QUESTIONS[currentQIndex];

  // Creator Seçim Yapar
  const handleCreatorSelect = (optionIndex: number) => {
    playTone(520, 'sine', 0.2, soundEnabled);
    const updated = [...selectedAnswers, optionIndex];
    setSelectedAnswers(updated);

    if (currentQIndex < SOUL_DUEL_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Bitti, Link Üret
      playCosmicChime(soundEnabled);
      const token = encodeSoulDuel(creatorName, userArchetype, updated);
      if (typeof window !== 'undefined') {
        const link = `${window.location.origin}?duel=${token}`;
        setGeneratedLink(link);
      }
    }
  };

  // Guest Tahmin Yapar
  const handleGuestSelect = (optionIndex: number) => {
    playTone(580, 'triangle', 0.2, soundEnabled);
    const updated = [...guestAnswers, optionIndex];
    setGuestAnswers(updated);

    if (currentQIndex < SOUL_DUEL_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Bitti, Skoru Hesapla
      playCosmicChime(soundEnabled);
      if (duelData && duelData.ownerAnswers) {
        const res = evaluateSoulDuel(duelData.ownerAnswers, updated);
        setDuelResult(res);
      }
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    playTone(660, 'sine', 0.3, soundEnabled);
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
        maxWidth: '540px',
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

        {/* -------------------------------------------------------- */}
        {/* MOD 1: MEYDAN OKUMA OLUŞTURUCU (CREATOR) */}
        {/* -------------------------------------------------------- */}
        {mode === 'create' && !generatedLink && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                ✦ ARKADAŞLARINA MEYDAN OKU ✦
              </span>
              <h3 style={{ color: '#FFE699', fontSize: '22px', margin: '6px 0 4px 0', fontFamily: 'Georgia, serif' }}>
                Beni Ne Kadar Tanıyorsun?
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                Aşağıdaki 5 soruya kendi gerçek düşünceni seç; arkadaşlarının seni tahmin etmesi için özel linkini üret!
              </p>
            </div>

            {/* İlerleme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#D4AF37', marginBottom: '8px' }}>
              <span>Soru {currentQIndex + 1} / {SOUL_DUEL_QUESTIONS.length}</span>
              <span>Kozmik Tahmin Düellosu</span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#211d33', borderRadius: '2px', marginBottom: '22px', overflow: 'hidden' }}>
              <div style={{ width: `${((currentQIndex + 1) / SOUL_DUEL_QUESTIONS.length) * 100}%`, height: '100%', backgroundColor: '#D4AF37', transition: 'width 0.3s' }} />
            </div>

            {/* Soru */}
            <h4 style={{ color: '#f8fafc', fontSize: '17px', lineHeight: '1.5', fontFamily: 'Georgia, serif', marginBottom: '18px' }}>
              {currentQ.question}
            </h4>

            {/* Şıklar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleCreatorSelect(i)}
                  style={{
                    padding: '14px 18px',
                    backgroundColor: '#171426',
                    border: '1px solid #3d3558',
                    color: '#e2e8f0',
                    borderRadius: '10px',
                    textAlign: 'left',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    lineHeight: '1.4'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D4AF37';
                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#3d3558';
                    e.currentTarget.style.backgroundColor = '#171426';
                  }}
                >
                  <span style={{ color: '#D4AF37', fontWeight: 'bold', marginRight: '8px' }}>
                    {String.fromCharCode(65 + i)})
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MOD 1 SONUÇ: LİNK OLUŞTU */}
        {mode === 'create' && generatedLink && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '44px', display: 'block', marginBottom: '10px' }}>⚔️</span>
            <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              ✦ DÜELLO LİNKİN HAZIR ✦
            </span>
            <h3 style={{ color: '#FFE699', fontSize: '22px', margin: '8px 0', fontFamily: 'Georgia, serif' }}>
              Bakalım Seni Kim Gerçekten Tanıyor?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
              Bu linki Instagram hikayene, WhatsApp gruplarına veya arkadaşlarına at. Senin iç dünyanı ve inançlarını tahmin etsinler!
            </p>

            <div style={{
              backgroundColor: '#0a0912',
              border: '1px dashed #D4AF37',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              wordBreak: 'break-all',
              fontSize: '11px',
              color: '#cbd5e1'
            }}>
              {generatedLink}
            </div>

            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
                color: '#07060c',
                border: 'none',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px',
                boxShadow: '0 4px 25px rgba(212, 175, 55, 0.3)'
              }}
            >
              {copied ? '✅ Link Kopyalandı! Şimdi Paylaş' : '🔗 Linki Kopyala & Hikayede Paylaş'}
            </button>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* MOD 2: MİSAFİR TAHMİN EDER (GUEST) */}
        {/* -------------------------------------------------------- */}
        {mode === 'play' && duelData && !duelResult && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#67e8f9', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                ✦ FELSEFİ MEYDAN OKUMA ✦
              </span>
              <h3 style={{ color: '#FFE699', fontSize: '22px', margin: '6px 0 4px 0', fontFamily: 'Georgia, serif' }}>
                {duelData.ownerName}'i Ne Kadar Tanıyorsun?
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                {duelData.ownerName} ({duelData.ownerArchetype}) kendi cevaplarını kilitledi. Bakalım onun kafasının içini bilebilecek misin?
              </p>
            </div>

            {/* İlerleme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#67e8f9', marginBottom: '8px' }}>
              <span>Tahmin {currentQIndex + 1} / {SOUL_DUEL_QUESTIONS.length}</span>
              <span>Felsefi Zihin Okuma</span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#211d33', borderRadius: '2px', marginBottom: '22px', overflow: 'hidden' }}>
              <div style={{ width: `${((currentQIndex + 1) / SOUL_DUEL_QUESTIONS.length) * 100}%`, height: '100%', backgroundColor: '#67e8f9', transition: 'width 0.3s' }} />
            </div>

            {/* Soru */}
            <h4 style={{ color: '#f8fafc', fontSize: '17px', lineHeight: '1.5', fontFamily: 'Georgia, serif', marginBottom: '18px' }}>
              {currentQ.question.replace('ben', duelData.ownerName).replace('benim', `${duelData.ownerName}'in`)}
            </h4>

            {/* Şıklar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleGuestSelect(i)}
                  style={{
                    padding: '14px 18px',
                    backgroundColor: '#171426',
                    border: '1px solid #3d3558',
                    color: '#e2e8f0',
                    borderRadius: '10px',
                    textAlign: 'left',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    lineHeight: '1.4'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#67e8f9';
                    e.currentTarget.style.backgroundColor = 'rgba(103, 232, 249, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#3d3558';
                    e.currentTarget.style.backgroundColor = '#171426';
                  }}
                >
                  <span style={{ color: '#67e8f9', fontWeight: 'bold', marginRight: '8px' }}>
                    {String.fromCharCode(65 + i)})
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MOD 2 SONUÇ: SKOR REVEAL */}
        {mode === 'play' && duelResult && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '44px', display: 'block', marginBottom: '8px' }}>
              {duelResult.score >= 60 ? '🔮' : '🎭'}
            </span>
            <span style={{ fontSize: '11px', color: '#67e8f9', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              ✦ DÜELLO SONUCU ✦
            </span>
            <div style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#FFE699',
              margin: '6px 0',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.5)'
            }}>
              %{duelResult.score}
            </div>
            <h4 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 12px 0', fontFamily: 'Georgia, serif' }}>
              {duelResult.title}
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.6', margin: '0 0 24px 0', backgroundColor: '#0a0912', padding: '16px', borderRadius: '12px', border: '1px solid #2d2645' }}>
              "{duelResult.comment}"
            </p>

            <button
              onClick={() => {
                onClose();
                if (onTakeTest) onTakeTest();
              }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
                color: '#07060c',
                border: 'none',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px',
                boxShadow: '0 4px 25px rgba(212, 175, 55, 0.3)'
              }}
            >
              🚀 Şimdi Sen De Kendi Testini Çöz & Arkadaşlarına Meydan Oku!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
