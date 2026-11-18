'use client';

import React, { useState } from 'react';
import { playTone, playCosmicChime } from '../lib/audio';

interface SocraticTrialProps {
  archetype: string;
  beliefName: string;
  soundEnabled: boolean;
}

interface OpponentPhilosopher {
  name: string;
  title: string;
  avatarIcon: string;
  challenge: string;
}

const getOpponent = (archetype: string, beliefName: string): OpponentPhilosopher => {
  const norm = (archetype + " " + beliefName).toLowerCase();

  if (norm.includes("hiçlik") || norm.includes("nihil")) {
    return {
      name: "Mevlânâ Celâleddîn-i Rûmî",
      title: "Aşkın ve Varlığın Şairi",
      avatarIcon: "🕯️",
      challenge: "Madem her şey anlamsız bir boşluktan ibaretti dostum; bu testi çözerken kalbinde parlayan o hakikati anlama telaşı ve merak ateşi neyin nesiydi?"
    };
  }

  if (norm.includes("stoa") || norm.includes("kale") || norm.includes("akıl")) {
    return {
      name: "Friedrich Nietzsche",
      title: "Putların Kırıcısı",
      avatarIcon: "⚡",
      challenge: "Duygularını demir bir zırhla bastırmak sence erdem mi, yoksa hayattan, trajediden ve tutkunun fırtınasından korkmanın korkakça bir maskesi mi?"
    };
  }

  if (norm.includes("akış") || norm.includes("pante") || norm.includes("doğa") || norm.includes("tao")) {
    return {
      name: "Arthur Schopenhauer",
      title: "Karanlık İradenin Filozofu",
      avatarIcon: "🥀",
      challenge: "Doğayı tanrı sayıp her şeyin kutsal bir ahenk olduğunu söylüyorsun; peki doğadaki acımasız vahşet, avlanan ceylanın feryadı ve dinmeyen ıstırap da bu ilahi ahengin bir parçası mı?"
    };
  }

  if (norm.includes("deis") || norm.includes("mimar") || norm.includes("rasyon")) {
    return {
      name: "Søren Kierkegaard",
      title: "Varoluşsal Kaygının Savaşçısı",
      avatarIcon: "📜",
      challenge: "Soğuk bir mimar evreni çizip kenara çekildi diyorsun; peki ölüm karşısında kalbinde hissettiğin o açıklanamaz varoluşsal kaygıyı hangi matematiksel formül dindirecek?"
    };
  }

  // Varsayılan Sokrates
  return {
    name: "Sokrates",
    title: "Atina'nın At Sineği",
    avatarIcon: "🏛️",
    challenge: "Bunca soruya yanıt verdin ve kendine bir inanç ismi seçtin; peki gerçekten biliyor musun, yoksa sadece bildiğini mi sanıyorsun?"
  };
};

export const SocraticTrial: React.FC<SocraticTrialProps> = ({ archetype, beliefName, soundEnabled }) => {
  const opponent = getOpponent(archetype, beliefName);
  const [response, setResponse] = useState('');
  const [verdict, setVerdict] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleDefend = () => {
    if (!response.trim() || isEvaluating) return;
    setIsEvaluating(true);
    playTone(460, 'sine', 0.5, soundEnabled);

    setTimeout(() => {
      setIsEvaluating(false);
      playCosmicChime(soundEnabled);
      setVerdict(
        `✦ ${opponent.name}'ın Kararı: Argümanın sarsıcı ve samimi. Karşı taraf başını saygıyla eğdi: "Cevabın, sadece ezberlenmiş kalıplarla değil, kendi varoluşunla samimiyetle güreştiğini gösteriyor. Sorgulanmamış bir hayat yaşamıyorsun." (+25 Kozmik Bilgelik Mührü)`
      );
    }, 1200);
  };

  return (
    <div style={{
      backgroundColor: '#110f1c',
      border: '1.5px solid #332d4a',
      borderRadius: '12px',
      padding: '25px',
      marginTop: '30px',
      textAlign: 'left',
      position: 'relative',
      boxShadow: '0 0 35px rgba(212, 175, 55, 0.12)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', borderBottom: '1px solid #2d2645', paddingBottom: '14px' }}>
        <span style={{ fontSize: '28px' }}>{opponent.avatarIcon}</span>
        <div>
          <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ✦ SOKRATES'İN MAHKEMESİ • FİLOZOFLA YÜZLEŞME
          </span>
          <h4 style={{ margin: '2px 0 0 0', color: '#f8fafc', fontSize: '17px', fontFamily: 'Georgia, serif' }}>
            {opponent.name} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>({opponent.title})</span>
          </h4>
        </div>
      </div>

      <p style={{
        fontSize: '15px',
        color: '#FFE699',
        fontStyle: 'italic',
        lineHeight: '1.6',
        backgroundColor: '#0a0912',
        padding: '16px 18px',
        borderRadius: '8px',
        borderLeft: '3px solid #D4AF37',
        margin: '0 0 18px 0'
      }}>
        "{opponent.challenge}"
      </p>

      {!verdict ? (
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
            Filozofa Kendi Felsefi Savunmanı Yaz:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Cevabını tek bir cümleyle felsefeye haykır..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleDefend(); }}
              style={{
                flex: 1,
                padding: '12px 14px',
                backgroundColor: '#0a0912',
                border: '1px solid #3d3558',
                color: '#f8fafc',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleDefend}
              disabled={!response.trim() || isEvaluating}
              style={{
                padding: '0 20px',
                background: response.trim() ? 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)' : '#221f33',
                color: response.trim() ? '#07060c' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: response.trim() ? 'pointer' : 'default',
                fontSize: '13px'
              }}
            >
              {isEvaluating ? 'Tartışılıyor...' : 'Yüzleş'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#0a0912',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '16px',
          color: '#d1fae5',
          fontSize: '13px',
          lineHeight: '1.6',
          fontStyle: 'italic'
        }}>
          {verdict}
        </div>
      )}
    </div>
  );
};
