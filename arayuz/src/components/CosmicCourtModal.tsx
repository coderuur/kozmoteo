'use client';
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../lib/api';
import { playTone, playCosmicChime } from '../lib/audio';

interface CosmicCourtModalProps {
  archetype: string;
  vector5d: number[];
  soundEnabled: boolean;
  onClose: () => void;
}

interface CourtArgument {
  text: string;
  score?: number;
  verdict?: string;
}

interface CourtSession {
  topic: string;
  userArguments: CourtArgument[];
  partnerArchetype: string;
  partnerArguments: CourtArgument[];
  verdict?: string;
  winner?: 'user' | 'partner' | 'draw';
  philosophicalDepth?: number;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#FFE699';
const RED = '#f43f5e';
const BLUE = '#3b82f6';

const DEBATE_TOPICS = [
  { topic: 'Tanrı var mı?', category: 'Teoloji' },
  { topic: 'Özgür irade bir yanılsama mı?', category: 'Felsefe' },
  { topic: 'Ölümden sonra yaşam var mı?', category: 'Metafizik' },
  { topic: 'Ahlak Tanrı\'dan mı, insanlıktan mı gelir?', category: 'Etik' },
  { topic: 'Bilim mi din mi insanlığı kurtarır?', category: 'Epistemoloji' },
  { topic: 'Anlamsız bir evrende mutluluk mümkün mü?', category: 'Varoluş' },
  { topic: 'Ruh beden olmadan var olabilir mi?', category: 'Metafizik' },
  { topic: 'Reenkarnasyon mümkün mü?', category: 'Teoloji' },
];

const PARTNER_ARCHETYPES = [
  'HİÇLİK YOLCUSU', 'GELENEK MUHAFIZI', 'AKIŞIN USTASI', 'KOZMİK RUH',
  'SARSILMAZ İRADE', 'AKILCI MİMAR', 'ABSÜRT İSYANKAR', 'DÜNYEVİ AYDIN',
  'GİZEMLİ BİLGE', 'KADİM ŞAMAN', 'AŞKIN DERVİŞ'
];

const evaluateOffline = (session: CourtSession): { verdict: string; winner: 'user' | 'partner' | 'draw'; depth: number } => {
  const userScore = session.userArguments.length * 10 + session.userArguments.reduce((s, a) => s + a.text.length, 0) / 20;
  const partnerScore = session.partnerArguments.length * 10 + session.partnerArguments.reduce((s, a) => s + a.text.length, 0) / 20;
  const diff = userScore - partnerScore;
  const winner: 'user' | 'partner' | 'draw' = Math.abs(diff) < 5 ? 'draw' : diff > 0 ? 'user' : 'partner';
  const depth = Math.round(Math.min(100, (userScore + partnerScore) / 2));
  const verdicts = {
    user: `${session.userArguments.length} argümanla güçlü bir felsefi duruş sergilediz. Karşı tarafın pozisyonu daha az derinlik gösterdi. Bu tartışmanın hakemi olarak: Zaferin felsefi derinlik ve tutarlılıkla sana aittir.`,
    partner: `${session.partnerArchetype} arketipinin argümanları bu tartışmada daha tutarlı bir çizgi izledi. Senin pozisyonun duygusal güçte öne çıksa da, mantıksal tutarlılıkta geride kaldı.`,
    draw: 'Bu tartışma filozofların yüzyıllardır çözemediği bir soruyu yeniden keşfetti. İki taraf da güçlü ve kırılgan yanlarıyla tartışmayı renklendirdi. Mahkeme berabere ilan ediyor.'
  };
  return { verdict: verdicts[winner], winner, depth };
};

export const CosmicCourtModal: React.FC<CosmicCourtModalProps> = ({
  archetype, vector5d, soundEnabled, onClose
}) => {
  const [phase, setPhase] = useState<'setup' | 'argue' | 'partner' | 'verdict'>('setup');
  const [session, setSession] = useState<CourtSession>({
    topic: '',
    userArguments: [],
    partnerArguments: [],
    partnerArchetype: ''
  });
  const [currentArg, setCurrentArg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const MAX_ARGS = 3;

  const selectTopic = (topic: string) => {
    playTone(432, 'triangle', 0.4, soundEnabled);
    const randomPartner = PARTNER_ARCHETYPES.filter(p => !archetype.toUpperCase().includes(p.split(' ')[0]))[
      Math.floor(Math.random() * (PARTNER_ARCHETYPES.length - 1))
    ];
    setSession(prev => ({ ...prev, topic, partnerArchetype: randomPartner }));
    setPhase('argue');
  };

  const addArgument = () => {
    if (!currentArg.trim() || currentArg.trim().length < 15) {
      alert('Lütfen en az 15 karakter içeren bir argüman yaz.');
      return;
    }
    playTone(520, 'sine', 0.4, soundEnabled);
    setSession(prev => ({
      ...prev,
      userArguments: [...prev.userArguments, { text: currentArg.trim() }]
    }));
    setCurrentArg('');
  };

  const proceedToVerdict = async () => {
    setIsLoading(true);
    playTone(180, 'sine', 1.5, soundEnabled);

    // Sahte partner argümanları üret
    const partnerArgs: CourtArgument[] = [
      { text: `${session.partnerArchetype} perspektifinden bakıldığında, "${session.topic}" sorusu aslında yanlış kurulmuş bir ikilemin ürünüdür. Gerçek soru şu: Biz doğru soruyu mu soruyoruz?` },
      { text: `Tarihin en derin düşünürleri bu soruyla yüzleşti. ${session.partnerArchetype === 'HİÇLİK YOLCUSU' ? 'Nietzsche\u2019nin "Tanrı öldü" dediğinde kastettiği şey' : 'Ezoterik geleneğin merkezi sorularından biri'} tam da buydu. Cevap ne değil, cevabı arayan zihnin kalitesi önemlidir.` },
      { text: `Karşı tarafın argümanları güçlü; fakat gözden kaçırdığı nokta şu: ${session.topic.includes('Tanrı') ? 'İnancın rasyonel bir kanıt gerektirmediği, varoluşun kendisinin bir kanıt olduğu' : 'Bu sorunun cevabının her zaman bakan kişiye göre farklılaştığı'} gerçeğidir.` }
    ];

    setSession(prev => ({ ...prev, partnerArguments: partnerArgs }));

    let verdict = '';
    let winner: 'user' | 'partner' | 'draw' = 'draw';
    let depth = 50;

    try {
      const res = await fetch(`${getApiUrl()}/api/cosmic-court`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: session.topic,
          user_archetype: archetype,
          partner_archetype: session.partnerArchetype,
          user_arguments: session.userArguments.map(a => a.text),
          partner_arguments: partnerArgs.map(a => a.text),
          vector: vector5d
        })
      });
      if (res.ok) {
        const data = await res.json();
        verdict = data.verdict;
        winner = data.winner;
        depth = data.philosophical_depth;
      } else throw new Error('API');
    } catch {
      const offline = evaluateOffline({ ...session, partnerArguments: partnerArgs });
      verdict = offline.verdict;
      winner = offline.winner;
      depth = offline.depth;
    }

    setSession(prev => ({ ...prev, partnerArguments: partnerArgs, verdict, winner, philosophicalDepth: depth }));
    playCosmicChime(soundEnabled);
    setIsLoading(false);
    setPhase('verdict');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.90)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'linear-gradient(170deg, #0a0712 0%, #0f0a1a 100%)', border: `1.5px solid ${GOLD}`, borderRadius: '14px', maxWidth: '660px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px 24px', position: 'relative', boxShadow: `0 0 80px rgba(212,175,55,0.2)` }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>⚖️ KOZMİK MAHKEME</div>
          <h2 style={{ color: GOLD_LIGHT, fontSize: '24px', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Felsefi Düello Mahkemesi</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Argümanını sun, Yapay Zeka hakemlik yapsın.</p>
        </div>

        {phase === 'setup' && (
          <>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center' }}>Bir tartışma konusu seç veya kendi konunu yaz:</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {DEBATE_TOPICS.map((t, i) => (
                <button key={i} onClick={() => selectTopic(t.topic)} style={{ padding: '12px 16px', backgroundColor: '#13111f', border: '1px solid #2d2645', color: '#e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}>
                  <span>⚖️ {t.topic}</span>
                  <span style={{ fontSize: '10px', color: '#6b7280', backgroundColor: '#1e1a2e', padding: '2px 8px', borderRadius: '10px' }}>{t.category}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                placeholder="Kendi tartışma konunu yaz..."
                style={{ flex: 1, padding: '11px 14px', backgroundColor: '#13111f', border: '1px solid #3d3558', color: '#e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              />
              <button
                onClick={() => customTopic.trim() && selectTopic(customTopic.trim())}
                style={{ padding: '0 20px', backgroundColor: GOLD, border: 'none', color: '#07060c', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                Seç
              </button>
            </div>
          </>
        )}

        {phase === 'argue' && (
          <>
            {/* Konu başlığı */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}`, borderRadius: '10px', padding: '14px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', marginBottom: '4px' }}>TARTIŞMA KONUSU</div>
              <div style={{ fontSize: '18px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{session.topic}</div>
            </div>

            {/* Karşı taraf */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', backgroundColor: '#1a1030', borderRadius: '8px', padding: '10px 14px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Senin Arketipin</div>
                <div style={{ fontSize: '13px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{archetype}</div>
              </div>
              <div style={{ fontSize: '20px', color: '#4a3e68' }}>⚡</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Karşı Arketip</div>
                <div style={{ fontSize: '13px', color: '#c084fc', fontWeight: 'bold' }}>{session.partnerArchetype}</div>
              </div>
            </div>

            {/* Mevcut argümanlar */}
            {session.userArguments.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Argümanların ({session.userArguments.length}/{MAX_ARGS})</div>
                {session.userArguments.map((arg, i) => (
                  <div key={i} style={{ backgroundColor: '#13111f', border: '1px solid #2d2645', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: GOLD, fontWeight: 'bold', marginRight: '8px' }}>#{i + 1}</span>
                    <span style={{ color: '#e2e8f0', fontSize: '13px' }}>{arg.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Yeni argüman */}
            {session.userArguments.length < MAX_ARGS && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  Argüman #{session.userArguments.length + 1} — "{session.topic}" hakkında ne düşünüyorsun?
                </label>
                <textarea
                  value={currentArg}
                  onChange={e => setCurrentArg(e.target.value)}
                  placeholder="Felsefi argümanını yaz. Ne kadar derin ve özgün olursa, yapay zeka o kadar güçlü bir analiz yapacak..."
                  rows={3}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#13111f', border: '1px solid #3d3558', color: '#e5e7eb', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
                <button onClick={addArgument} style={{ marginTop: '8px', padding: '10px 24px', backgroundColor: GOLD, border: 'none', color: '#07060c', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                  Argümanı Ekle
                </button>
              </div>
            )}

            {session.userArguments.length >= 1 && (
              <button
                onClick={proceedToVerdict}
                disabled={isLoading}
                style={{ width: '100%', padding: '14px', background: isLoading ? '#1e1a2e' : 'linear-gradient(135deg, #D4AF37 0%, #b8860b 100%)', border: 'none', color: isLoading ? '#4b5563' : '#07060c', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: isLoading ? 'none' : `0 0 25px rgba(212,175,55,0.3)` }}
              >
                {isLoading ? '⚖️ Mahkeme değerlendiriyor...' : `⚖️ Mahkeme Kararını İstiyorum (${session.userArguments.length} argüman)`}
              </button>
            )}
          </>
        )}

        {phase === 'verdict' && (
          <>
            {/* Verdict banner */}
            <div style={{
              backgroundColor: session.winner === 'user' ? 'rgba(16,185,129,0.15)' : session.winner === 'partner' ? 'rgba(244,63,94,0.15)' : 'rgba(212,175,55,0.15)',
              border: `2px solid ${session.winner === 'user' ? '#10b981' : session.winner === 'partner' ? RED : GOLD}`,
              borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                {session.winner === 'user' ? '🏆' : session.winner === 'partner' ? '⚡' : '☯️'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '2px', marginBottom: '6px' }}>MAHKEME KARARI</div>
              <div style={{ fontSize: '20px', color: session.winner === 'user' ? '#10b981' : session.winner === 'partner' ? RED : GOLD_LIGHT, fontWeight: 'bold' }}>
                {session.winner === 'user' ? `${archetype} Galip` : session.winner === 'partner' ? `${session.partnerArchetype} Galip` : 'Felsefi Beraberlik'}
              </div>
              {session.philosophicalDepth !== undefined && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                  Felsefi Derinlik Skoru: <strong style={{ color: GOLD_LIGHT }}>{session.philosophicalDepth}/100</strong>
                </div>
              )}
            </div>

            {/* Mahkeme gerekçesi */}
            <div style={{ backgroundColor: '#13111f', border: '1px solid #2d2645', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Hakemlik Gerekçesi</div>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>{session.verdict}</p>
            </div>

            {/* Argümanlar karşılaştırma */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '1px', marginBottom: '8px' }}>{archetype}</div>
                {session.userArguments.map((a, i) => (
                  <div key={i} style={{ backgroundColor: '#13111f', border: '1px solid #2d2645', borderRadius: '6px', padding: '8px', marginBottom: '6px', fontSize: '11px', color: '#d1d5db', lineHeight: '1.4' }}>
                    {a.text.slice(0, 100)}{a.text.length > 100 ? '...' : ''}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '1px', marginBottom: '8px' }}>{session.partnerArchetype}</div>
                {session.partnerArguments.map((a, i) => (
                  <div key={i} style={{ backgroundColor: '#1a1030', border: '1px solid #3d2d6a', borderRadius: '6px', padding: '8px', marginBottom: '6px', fontSize: '11px', color: '#d1d5db', lineHeight: '1.4' }}>
                    {a.text.slice(0, 100)}{a.text.length > 100 ? '...' : ''}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setPhase('setup'); setSession({ topic: '', userArguments: [], partnerArguments: [], partnerArchetype: '' }); }} style={{ flex: 1, padding: '11px', background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD_LIGHT, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                Yeni Dava Aç
              </button>
              <button onClick={onClose} style={{ flex: 1, padding: '11px', backgroundColor: '#1e1a2e', border: '1px solid #3d3558', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Kapat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
