'use client';

import React, { useState } from 'react';
import { MatchResult } from '../lib/types';
import { downloadStoryCard, downloadSocraticStoryCard, downloadHumanizedStoryCard } from '../lib/canvas';
import { getBrutalTruth, BrutalTruth, getHumanizedPersona, HumanizedPersona } from '../lib/viral';
import { playTone, playCosmicChime } from '../lib/audio';

interface ArchetypeModalProps {
  result: MatchResult;
  onClose: () => void;
  soundEnabled: boolean;
}

export const ArchetypeModal: React.FC<ArchetypeModalProps> = ({ result, onClose, soundEnabled }) => {
  const [activeSlide, setActiveSlide] = useState<0 | 1 | 2 | 3>(1);
  const [isExporting, setIsExporting] = useState(false);

  const brutal: BrutalTruth = getBrutalTruth(result.archetype);
  const persona: HumanizedPersona = getHumanizedPersona(result.archetype);

  const handleDownloadActive = async () => {
    setIsExporting(true);
    playTone(720, 'sine', 0.5, soundEnabled);
    try {
      if (activeSlide === 0) {
        await downloadStoryCard(result);
      } else if (activeSlide === 1) {
        await downloadHumanizedStoryCard(result);
      } else if (activeSlide === 2) {
        await downloadSocraticStoryCard(result, brutal);
      } else {
        await downloadStoryCard(result);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsExporting(true);
    playCosmicChime(soundEnabled);
    try {
      await downloadHumanizedStoryCard(result);
      await new Promise((r) => setTimeout(r, 600));
      await downloadStoryCard(result);
      await new Promise((r) => setTimeout(r, 600));
      await downloadSocraticStoryCard(result, brutal);
    } finally {
      setIsExporting(false);
    }
  };

  const cleanDescription = result.description.replace(/\s*\([^)]*\)/g, '').trim();
  const cleanBeliefName = result.belief_name.replace(/\s*\([^)]*\)/g, '').trim();

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
      zIndex: 99999,
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* SPOTIFY WRAPPED TARZI SLIDE SEÇİCİ TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => { setActiveSlide(0); playTone(540, 'sine', 0.15, soundEnabled); }}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: activeSlide === 0 ? '1px solid #D4AF37' : '1px solid #2d2645',
            backgroundColor: activeSlide === 0 ? 'rgba(212, 175, 55, 0.2)' : '#110f1c',
            color: activeSlide === 0 ? '#FFE699' : '#9ca3af',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ✦ 1. Kozmik Kimlik
        </button>

        <button
          onClick={() => { setActiveSlide(1); playTone(560, 'sine', 0.15, soundEnabled); }}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: activeSlide === 1 ? '1px solid #c084fc' : '1px solid #2d2645',
            backgroundColor: activeSlide === 1 ? 'rgba(192, 132, 252, 0.2)' : '#110f1c',
            color: activeSlide === 1 ? '#e9d5ff' : '#9ca3af',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🎭 2. Halk Diliyle Sen
        </button>

        <button
          onClick={() => { setActiveSlide(2); playTone(580, 'sine', 0.15, soundEnabled); }}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: activeSlide === 2 ? '1px solid #f43f5e' : '1px solid #2d2645',
            backgroundColor: activeSlide === 2 ? 'rgba(244, 63, 94, 0.2)' : '#110f1c',
            color: activeSlide === 2 ? '#fda4af' : '#9ca3af',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ⚡ 3. Sokrates'in Aynası
        </button>

        <button
          onClick={() => { setActiveSlide(3); playTone(620, 'sine', 0.15, soundEnabled); }}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: activeSlide === 3 ? '1px solid #67e8f9' : '1px solid #2d2645',
            backgroundColor: activeSlide === 3 ? 'rgba(103, 232, 249, 0.2)' : '#110f1c',
            color: activeSlide === 3 ? '#a5f3fc' : '#9ca3af',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🌌 4. Tarihteki Ruh İkizin
        </button>
      </div>

      {/* 9:16 MAJESTİK HİKAYE ÖNİZLEME KARTI */}
      <div style={{
        width: '340px',
        height: '604px',
        background: activeSlide === 2
          ? 'linear-gradient(180deg, #09050b 0%, #1a0814 40%, #12050f 80%, #060205 100%)'
          : activeSlide === 1
          ? 'linear-gradient(180deg, #080512 0%, #180d28 40%, #10081c 80%, #06030c 100%)'
          : 'linear-gradient(180deg, #07060c 0%, #130f26 40%, #0e0a1c 80%, #06050a 100%)',
        border: activeSlide === 2 ? '2px solid #f43f5e' : activeSlide === 1 ? '2px solid #c084fc' : '2px solid #D4AF37',
        borderRadius: '20px',
        position: 'relative',
        boxShadow: activeSlide === 2 ? '0 0 60px rgba(244, 63, 94, 0.28)' : activeSlide === 1 ? '0 0 60px rgba(192, 132, 252, 0.28)' : '0 0 60px rgba(212, 175, 55, 0.28)',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 18px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Köşe Süsleri */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '14px',
          pointerEvents: 'none'
        }}>
          <span style={{ position: 'absolute', top: '4px', left: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
          <span style={{ position: 'absolute', top: '4px', right: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '4px', left: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '4px', right: '6px', color: '#FFE699', fontSize: '10px' }}>✦</span>
        </div>

        {/* -------------------------------------------------------- */}
        {/* SLIDE 0: KOZMİK KİMLİK */}
        {/* -------------------------------------------------------- */}
        {activeSlide === 0 && (
          <>
            <div>
              <h4 style={{ color: '#FFE699', letterSpacing: '4px', fontSize: '10px', margin: '0 0 2px 0', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                ✦ KOZMO-TEO ✦
              </h4>
              <p style={{ color: '#9ca3af', letterSpacing: '2px', fontSize: '8px', margin: 0, textTransform: 'uppercase' }}>
                Bilinçaltı İnanç Arketipi
              </p>
            </div>

            <div>
              <h1 style={{ color: '#FFE699', fontSize: '20px', letterSpacing: '2px', margin: '0 0 4px 0', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>
                {result.archetype}
              </h1>
              <h2 style={{ fontSize: '56px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0', textShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}>
                %{result.similarity_percentage}
              </h2>

              <div style={{ display: 'inline-block', border: '1px solid rgba(212, 175, 55, 0.5)', borderRadius: '20px', padding: '4px 14px', backgroundColor: 'rgba(212, 175, 55, 0.08)', marginBottom: '14px' }}>
                <span style={{ color: '#FFE8A3', fontSize: '10px', letterSpacing: '1px', fontWeight: 'bold' }}>
                  ✦ {cleanBeliefName.toUpperCase()} ✦
                </span>
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '12px', fontStyle: 'italic', lineHeight: '1.4', margin: '0 auto', maxWidth: '270px' }}>
                "{cleanDescription}"
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(18, 15, 30, 0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '12px 10px', margin: '0 6px' }}>
              <span style={{ color: '#FFE699', fontSize: '9px', letterSpacing: '2px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                ✦ GÜNÜN RUHSAL PRATİĞİ ✦
              </span>
              <p style={{ color: '#f1f5f9', fontSize: '11px', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>
                "{result.daily_reflection}"
              </p>
            </div>
          </>
        )}

        {/* -------------------------------------------------------- */}
        {/* SLIDE 1: HALK DİLİYLE SEN (KOZMİK KİMLİK KARTI) */}
        {/* -------------------------------------------------------- */}
        {activeSlide === 1 && (
          <>
            <div>
              <h4 style={{ color: '#FFE699', letterSpacing: '4px', fontSize: '10px', margin: '0 0 2px 0', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                ✦ KOZMO-TEO ✦
              </h4>
              <p style={{ color: '#c084fc', letterSpacing: '2px', fontSize: '8px', margin: 0, textTransform: 'uppercase', fontWeight: 'bold' }}>
                Halk Diliyle Sen • Kimlik Kartı
              </p>
            </div>

            <div>
              <span style={{ color: '#FFE699', fontSize: '10px', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '12px', padding: '2px 10px', display: 'inline-block', marginBottom: '6px' }}>
                ✦ {result.archetype} • %{result.similarity_percentage} ✦
              </span>
              <h3 style={{ color: '#FFE699', fontSize: '16px', margin: '0 0 6px 0', fontFamily: 'Georgia, serif' }}>
                {persona.title}
              </h3>
              <p style={{ color: '#e2e8f0', fontSize: '11px', fontStyle: 'italic', lineHeight: '1.4', margin: '0 auto 8px auto', maxWidth: '270px' }}>
                "{persona.everydayYou}"
              </p>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                {persona.threeWords.map((w, i) => (
                  <span key={i} style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#FFE699', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold' }}>
                    #{w}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '5px 8px', textAlign: 'left' }}>
                <span style={{ color: '#f43f5e', fontSize: '9px', fontWeight: 'bold', display: 'block' }}>🚩 Kırmızı Bayrağın:</span>
                <span style={{ color: '#fda4af', fontSize: '9px', lineHeight: '1.3' }}>{persona.redFlag}</span>
              </div>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '5px 8px', textAlign: 'left' }}>
                <span style={{ color: '#10b981', fontSize: '9px', fontWeight: 'bold', display: 'block' }}>💚 Yeşil Bayrağın:</span>
                <span style={{ color: '#a7f3d0', fontSize: '9px', lineHeight: '1.3' }}>{persona.greenFlag}</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(138, 43, 226, 0.15)', border: '1px solid rgba(138, 43, 226, 0.35)', borderRadius: '8px', padding: '5px 8px' }}>
              <span style={{ color: '#c084fc', fontSize: '9px', fontWeight: 'bold' }}>🎭 Pop-Kültür İkizin: </span>
              <span style={{ color: '#FFE699', fontSize: '10px', fontWeight: 'bold' }}>{persona.popCultureTwin}</span>
            </div>
          </>
        )}

        {/* -------------------------------------------------------- */}
        {/* SLIDE 2: SOKRATES'İN AYNASI (RUH TOKADI) */}
        {/* -------------------------------------------------------- */}
        {activeSlide === 2 && (
          <>
            <div>
              <h4 style={{ color: '#FFE699', letterSpacing: '4px', fontSize: '10px', margin: '0 0 2px 0', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                ✦ SOKRATES'İN AYNASI ✦
              </h4>
              <p style={{ color: '#f43f5e', letterSpacing: '2px', fontSize: '8px', margin: 0, textTransform: 'uppercase', fontWeight: 'bold' }}>
                Varoluşsal Ruh Tokadı
              </p>
            </div>

            <div>
              <span style={{ color: '#fda4af', fontSize: '10px', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '12px', padding: '2px 10px', display: 'inline-block', marginBottom: '10px' }}>
                ✦ {result.archetype} ✦
              </span>
              <p style={{ color: '#ffffff', fontSize: '14px', fontStyle: 'italic', lineHeight: '1.5', fontFamily: 'Georgia, serif', margin: '0 auto 12px auto', maxWidth: '280px', textShadow: '0 0 20px rgba(244, 63, 94, 0.3)' }}>
                "{brutal.quote}"
              </p>

              <div style={{ backgroundColor: 'rgba(18, 15, 30, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '8px', padding: '10px', marginBottom: '8px', textAlign: 'left' }}>
                <span style={{ color: '#FFE699', fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
                  ⚡ Zihinsel Çelişkin:
                </span>
                <p style={{ color: '#cbd5e1', fontSize: '10px', margin: 0, lineHeight: '1.4' }}>
                  {brutal.contradiction}
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(138, 43, 226, 0.1)', border: '1px solid rgba(138, 43, 226, 0.3)', borderRadius: '8px', padding: '8px 10px' }}>
              <span style={{ color: '#c084fc', fontSize: '9px', fontWeight: 'bold', display: 'block' }}>
                🌌 Tarihteki Ruh İkizin:
              </span>
              <span style={{ color: '#FFE699', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                {brutal.historicalMirror}
              </span>
            </div>
          </>
        )}

        {/* -------------------------------------------------------- */}
        {/* SLIDE 3: TARİHTEKİ RUH İKİZİ & DERİN FELSEFE */}
        {/* -------------------------------------------------------- */}
        {activeSlide === 3 && (
          <>
            <div>
              <h4 style={{ color: '#FFE699', letterSpacing: '4px', fontSize: '10px', margin: '0 0 2px 0', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                ✦ KOZMO-TEO ✦
              </h4>
              <p style={{ color: '#c084fc', letterSpacing: '2px', fontSize: '8px', margin: 0, textTransform: 'uppercase' }}>
                Tarihsel Rezonans
              </p>
            </div>

            <div>
              <h3 style={{ color: '#FFE699', fontSize: '17px', margin: '0 0 8px 0', fontFamily: 'Georgia, serif' }}>
                Kozmik Felsefi Akrabaların
              </h3>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                {(result.figures || ['Spinoza', 'Nietzsche']).map((fig, idx) => (
                  <span key={idx} style={{ padding: '3px 10px', backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '1px solid #D4AF37', borderRadius: '14px', color: '#FFE8A3', fontSize: '10px', fontWeight: 'bold' }}>
                    ✦ {fig}
                  </span>
                ))}
              </div>

              <div style={{ backgroundColor: '#0a0912', border: '1px solid #2d2645', borderRadius: '10px', padding: '12px', margin: '0 auto', maxWidth: '280px' }}>
                <span style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                  KADİM ALINTI
                </span>
                <p style={{ color: '#f8fafc', fontSize: '12px', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>
                  "{result.quotes?.[0] || 'Kendini bilmek, tüm bilgeliğin başlangıcıdır.'}"
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(18, 15, 30, 0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '10px', padding: '10px' }}>
              <span style={{ color: '#FFE699', fontSize: '9px', letterSpacing: '2px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                ✦ BİLİNÇALTI DETAYI ✦
              </span>
              <p style={{ color: '#cbd5e1', fontSize: '10px', margin: 0, lineHeight: '1.4' }}>
                {result.details?.slice(0, 140)}...
              </p>
            </div>
          </>
        )}

        {/* ALT BİLGİ */}
        <div>
          <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0 0 2px 0' }}>
            Senin inanç pusulan ne söylüyor?
          </p>
          <p style={{ fontSize: '10px', color: '#FFE699', fontFamily: 'Georgia, serif', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>
            ✦ kozmoteo.netlify.app ✦
          </p>
        </div>
      </div>

      {/* BUTONLAR */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleDownloadActive}
          disabled={isExporting}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 50%, #AA820A 100%)',
            color: '#07060c',
            border: 'none',
            borderRadius: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px',
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isExporting ? 'Görsel Hazırlanıyor...' : '📸 Bu Kartı İndir'}
        </button>

        <button
          onClick={handleDownloadAll}
          disabled={isExporting}
          style={{
            padding: '12px 18px',
            backgroundColor: '#12101c',
            color: '#FFE699',
            border: '1px solid #D4AF37',
            borderRadius: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✨ Tüm Seriyi İndir — Story Paketi
        </button>

        <button
          onClick={onClose}
          style={{
            padding: '12px 20px',
            backgroundColor: '#12101c',
            color: '#e2e8f0',
            border: '1px solid #3d3558',
            borderRadius: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
