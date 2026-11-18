'use client';

import React, { useState, useEffect } from 'react';
import { playTone, playCosmicChime } from '../lib/audio';

interface DailyOracleProps {
  onClose: () => void;
  soundEnabled: boolean;
}

interface OracleQuestion {
  id: number;
  question: string;
  leftPole: string;
  rightPole: string;
  leftConcept: string;
  rightConcept: string;
  insight: string;
}

const ORACLES: OracleQuestion[] = [
  {
    id: 1,
    question: "Eğer evrenin başlangıcındaki Büyük Patlama'yı geriye sarsaydın, her şey yine aynı noktaya mı gelirdi yoksa bilinç bir kırılma yaratır mıydı?",
    leftPole: "Mutlak Determinizm (Kader)",
    rightPole: "Özgür İrade & Kuantum Sapma",
    leftConcept: "Kaderci Evren",
    rightConcept: "Özgür İrade",
    insight: "Spinoza evrenin her parçasının zorunlu bir nedensellik zinciriyle aktığını savunurken, varoluşçular bilincin evrende kendi kurallarını yazan yegane sapma olduğunu söyler."
  },
  {
    id: 2,
    question: "Ölüm bilincin sonsuza dek silinmesi midir, yoksa kozmik bir okyanusa geri dökülen bir damla mıdır?",
    leftPole: "Mutlak Hiçlik & Biyolojik Son",
    rightPole: "Aşkın Bilinç & Kozmik Bütünlük",
    leftConcept: "Materyalist Son",
    rightConcept: "Ruhsal Bütünleşme",
    insight: "Epikuros 'Ölüm varken biz yokuz, biz varken ölüm yok' derken; Doğu bilgeliği ölümün sadece bireysellik yanılsamasının yırtılması olduğunu fısıldar."
  },
  {
    id: 3,
    question: "Ahlak ve vicdan evrenin dokusunda saklı objektif bir yasa mıdır, yoksa insanın hayatta kalmak için uydurduğu ortak bir kurgu mu?",
    leftPole: "İnsani ve Evrimsel Kurgu",
    rightPole: "Kozmik & Objektif Vicdan Yasası",
    leftConcept: "Kültürel Kurgu",
    rightConcept: "Kozmik Adalet",
    insight: "Nietzsche ahlakın zayıfların icadı olduğunu iddia ederken, Kant 'üzerimdeki yıldızlı gökyüzü ve içimdeki ahlak yasası' diyerek vicdanı evrensel kabul eder."
  },
  {
    id: 4,
    question: "Evrendeki acı ve ıstırap varoluşun trajik bir hatası mıdır, yoksa ruhun derinleşmesi için zorunlu bir simya mı?",
    leftPole: "Anlamsız ve Trajik Kusur",
    rightPole: "Bilgeliğe Götüren Zorunlu Simya",
    leftConcept: "Varoluşsal Isdırap",
    rightConcept: "Dönüştürücü Çile",
    insight: "Budizm ıstırabın arzulardan doğduğunu söylerken, Dostoyevski insanın ancak acıyla gerçek bilince ve derinliğe ulaşabileceğini savunur."
  }
];

export const DailyOracle: React.FC<DailyOracleProps> = ({ onClose, soundEnabled }) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const oracle = ORACLES[dayOfYear % ORACLES.length];
  const storageKey = `kozmo_oracle_${new Date().toISOString().slice(0, 10)}`;

  const [value, setValue] = useState(0.5);
  const [hasVoted, setHasVoted] = useState(false);
  const [stats, setStats] = useState({ left: 58, right: 42 });

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setValue(parseFloat(saved));
      setHasVoted(true);
    }
  }, [storageKey]);

  const handleVote = () => {
    localStorage.setItem(storageKey, value.toString());
    setHasVoted(true);
    playCosmicChime(soundEnabled);

    // Rastgele hafif dağılım simülasyonu
    const leftPct = Math.round(52 + (1 - value) * 16);
    setStats({ left: leftPct, right: 100 - leftPct });
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
        maxWidth: '520px',
        backgroundColor: '#110f1c',
        border: '1.5px solid #D4AF37',
        borderRadius: '16px',
        padding: '35px 25px',
        boxShadow: '0 0 60px rgba(212, 175, 55, 0.25)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ✦ GÜNÜN KOZMİK KEHANETİ ✦
          </span>
          <h3 style={{ color: '#FFE699', fontSize: '20px', margin: '8px 0 0 0', fontFamily: 'Georgia, serif' }}>
            Ortak Zihin İkilemi
          </h3>
        </div>

        {/* SORU METNİ */}
        <p style={{
          fontSize: '17px',
          color: '#f8fafc',
          lineHeight: '1.6',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          textAlign: 'center',
          backgroundColor: '#0a0912',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #2d2645',
          margin: '0 0 25px 0'
        }}>
          "{oracle.question}"
        </p>

        {/* KUTUPLAR VE SLIDER */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
            <span style={{ maxWidth: '45%', color: value < 0.5 ? '#FFE699' : '#94a3b8', fontWeight: value < 0.5 ? 'bold' : 'normal' }}>
              ← {oracle.leftPole}
            </span>
            <span style={{ maxWidth: '45%', textAlign: 'right', color: value > 0.5 ? '#FFE699' : '#94a3b8', fontWeight: value > 0.5 ? 'bold' : 'normal' }}>
              {oracle.rightPole} →
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={hasVoted}
            value={value}
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
              playTone(380 + parseFloat(e.target.value) * 300, 'sine', 0.15, soundEnabled);
            }}
            style={{ width: '100%', cursor: hasVoted ? 'default' : 'pointer', accentColor: '#D4AF37' }}
          />

          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: '#FFE699', fontWeight: 'bold' }}>
            {value === 0.5 ? 'Tam Denge / Agnostik' : (value < 0.5 ? `%${Math.round((1 - value) * 100)} ${oracle.leftConcept}` : `%${Math.round(value * 100)} ${oracle.rightConcept}`)}
          </div>
        </div>

        {/* OY VER BUTONU VEYA CANLI NABIZ GÖSTERGESİ */}
        {!hasVoted ? (
          <button
            onClick={handleVote}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
              color: '#07060c',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
              marginBottom: '20px'
            }}
          >
            ✦ Kozmik Nabzımı Mühürle (Oy Ver)
          </button>
        ) : (
          <div style={{ backgroundColor: '#0a0912', padding: '18px', borderRadius: '10px', border: '1px solid #D4AF37', marginBottom: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ✓ Oyunuz Mühürlendi • Bugünün Kozmik Nabzı
            </span>

            {/* İkili Dağılım Çubuğu */}
            <div style={{ margin: '14px 0 8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                <span style={{ color: '#FFE699' }}>%{stats.left} {oracle.leftConcept}</span>
                <span style={{ color: '#9d72ff' }}>%{stats.right} {oracle.rightConcept}</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#9d72ff', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${stats.left}%`, height: '100%', backgroundColor: '#D4AF37', transition: 'width 0.6s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* FELSEFİ İÇGÖRÜ / AÇIKLAMA */}
        <div style={{ borderTop: '1px solid #2d2645', paddingTop: '15px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
          <strong style={{ color: '#FFE699', display: 'block', marginBottom: '4px' }}>Felsefi Derinlik:</strong>
          {oracle.insight}
        </div>
      </div>
    </div>
  );
};
