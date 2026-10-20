'use client';
import { useState, useEffect, useMemo } from 'react';
import { MatchResult, MatchSessionData, ChatMessageItem } from '../lib/types';
import { QUESTION_POOL, getRandomSample } from '../lib/questions';
import { compressVectorTo5D } from '../lib/dictionary';
import { playTone, playCosmicChime } from '../lib/audio';
import { getApiUrl } from '../lib/api';

import { RadarChart } from '../components/RadarChart';
import { ArchetypeModal } from '../components/ArchetypeModal';
import { BeliefDetailModal } from '../components/BeliefDetailModal';
import { VoiceVerification } from '../components/VoiceVerification';
import { ChatRoom } from '../components/ChatRoom';

export default function Home() {
  const [testType, setTestType] = useState<'short' | 'medium' | 'long' | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [currentDilemmas, setCurrentDilemmas] = useState<any[]>([]);
  const [vector, setVector] = useState<number[]>([]);
  const [dilemmaVector, setDilemmaVector] = useState<number[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [pastVector, setPastVector] = useState<number[] | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showArchetype, setShowArchetype] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sosyal Tanışma & Anonim Ağ Durumları
  const [socialStep, setSocialStep] = useState<
    'none' | 'opt-in' | 'intent' | 'user-gender' | 'voice-verify' | 'target-gender' | 'belief-preference' | 'matching' | 'matched' | 'chat' | 'revealed'
  >('none');
  const [intent, setIntent] = useState<'friend' | 'flirt' | null>(null);
  const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);
  const [targetGender, setTargetGender] = useState<'male' | 'female' | 'any'>('any');

  // Eşleşme ve Sohbet Odası State'leri
  const [matchSession, setMatchSession] = useState<MatchSessionData | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessageItem[]>([]);

  // İkili Arkadaşlık Kodu
  const [partnerCode, setPartnerCode] = useState("");
  const [duoResult, setDuoResult] = useState<number[] | null>(null);

  // Yapay Zeka Kozmik Okuma
  const [aiReading, setAiReading] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sayfa yüklendiğinde hafızadaki son durumu yükle
  useEffect(() => {
    const saved = localStorage.getItem('kozmo_past_vector');
    if (saved) {
      setPastVector(JSON.parse(saved));
    }
  }, []);

  // Test Seçimi ve Soru Üretimi (Tekrarsız Fisher-Yates)
  const handleTestSelection = (type: 'short' | 'medium' | 'long') => {
    playTone(432, 'triangle', 0.8, soundEnabled);
    setTestType(type);
    setResult(null);
    setSocialStep('none');
    setDuoResult(null);
    setAiReading(null);

    let questionsPerCategory = 4;
    if (type === 'medium') questionsPerCategory = 12;
    if (type === 'long') questionsPerCategory = 20;

    const getQuestions = (cat: string[]) => getRandomSample(cat, questionsPerCategory);

    const generatedQuestions = [
      ...getQuestions(QUESTION_POOL.tektanricilik),
      ...getQuestions(QUESTION_POOL.rituelizm),
      ...getQuestions(QUESTION_POOL.olum_sonrasi),
      ...getQuestions(QUESTION_POOL.dogma),
      ...getQuestions(QUESTION_POOL.doga)
    ];

    const dilemmas = getRandomSample(QUESTION_POOL.senaryolar, 1);

    setCurrentQuestions(generatedQuestions);
    setCurrentDilemmas(dilemmas);
    setVector(new Array(generatedQuestions.length).fill(0.5));
    setDilemmaVector(new Array(dilemmas.length).fill(0.5));
  };

  const handleSliderChange = (index: number, value: string) => {
    const newVector = [...vector];
    newVector[index] = parseFloat(value);
    setVector(newVector);
  };

  const handleDilemmaChange = (index: number, value: number) => {
    const newDV = [...dilemmaVector];
    newDV[index] = value;
    setDilemmaVector(newDV);
  };

  const calculateMatch = async () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playTone(528, 'sine', 1.5, soundEnabled);
      const response = await fetch(`${getApiUrl()}/api/match/religion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_vector: vector, test_type: testType })
      });
      if (!response.ok) throw new Error("Ağ hatası");
      const data = await response.json();
      setResult(data);
      playCosmicChime(soundEnabled);
      localStorage.setItem('kozmo_past_vector', JSON.stringify(vector));
    } catch (error) {
      alert(`Sunucu bağlantısı kurulamadı. Backend servisinin açık olduğundan emin olun: ${getApiUrl()}`);
    }
  };

  const fetchAiReading = async () => {
    if (!result) return;
    setIsAiLoading(true);
    playTone(580, 'sine', 1.0, soundEnabled);
    try {
      const response = await fetch(`${getApiUrl()}/api/ai-reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype: result.archetype,
          similarity: result.similarity_percentage,
          vector: compressVectorTo5D(vector)
        })
      });
      const data = await response.json();
      setAiReading(data.reading);
      playTone(720, 'sine', 1.2, soundEnabled);
    } catch (err) {
      setAiReading("Kozmik bağ zayıf... Yıldızlar şu an yanıt vermiyor.");
    }
    setIsAiLoading(false);
  };

  // Anonim Eşleşme Başlatma
  const startMatching = async (pref: 'similar' | 'opposite') => {
    setSocialStep('matching');
    playTone(432, 'triangle', 2.0, soundEnabled);
    try {
      const res = await fetch(`${getApiUrl()}/api/match/anonymous`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Kozmik Yolcu',
          gender: userGender || 'male',
          target_gender: targetGender,
          intent: intent || 'friend',
          preference: pref,
          vector: compressVectorTo5D(vector)
        })
      });
      const data = await res.json();
      if (res.ok && data.session_id) {
        setMatchSession(data);
        setInitialMessages([{
          id: 1,
          sender: 'partner',
          sender_name: data.partner_name,
          text: data.greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        playCosmicChime(soundEnabled);
        setSocialStep('matched');
      } else {
        throw new Error("Eşleşme sunucu hatası");
      }
    } catch (e) {
      const mockSession: MatchSessionData = {
        session_id: 'kozmo_yerel',
        partner_name: 'Kozmik Yolcu #482',
        partner_archetype: 'AKIŞIN USTASI',
        partner_gender: targetGender === 'female' ? 'female' : 'male',
        compatibility: 93,
        greeting: 'Selam olsun yolcu. Kozmosun sonsuzluğunda senin frekansınla karşılaştım.'
      };
      setMatchSession(mockSession);
      setInitialMessages([{
        id: 1,
        sender: 'partner',
        sender_name: mockSession.partner_name,
        text: mockSession.greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      playCosmicChime(soundEnabled);
      setSocialStep('matched');
    }
  };

  const answeredCount = vector.filter(v => v !== 0.5).length;
  const certainty = Math.min(100, Math.round((answeredCount / (vector.length || 1)) * 100));

  const myDuoCode = useMemo(() => {
    if (vector.length === 0) return "";
    const compressed = compressVectorTo5D(vector);
    return compressed.map(n => {
      const val = Math.min(99, Math.max(0, Math.round(n * 100)));
      return val.toString().padStart(2, '0');
    }).join('');
  }, [vector]);

  const handleDuoSync = () => {
    try {
      if (partnerCode.length !== 10 || !/^\d+$/.test(partnerCode)) {
        alert("Hata: Partner kodu tam olarak 10 haneli sayısal bir kod olmalıdır.");
        return;
      }
      const decoded = partnerCode.match(/.{1,2}/g)?.map(n => parseInt(n) / 100);
      if (decoded && decoded.length === 5) {
        setDuoResult(decoded);
        playCosmicChime(soundEnabled);
      } else {
        alert("Geçersiz veya bozuk partner kodu.");
      }
    } catch (e) {
      alert("Geçersiz Kod!");
    }
  };

  const duoCompatibilityScore = duoResult && result ?
    Math.round(100 - (compressVectorTo5D(vector).reduce((acc, val, i) => acc + Math.abs(val - duoResult[i]), 0) / 5 * 100))
    : 0;

  const duoAnalysis = useMemo(() => {
    if (!duoResult || vector.length === 0) return null;
    const myCompressed = compressVectorTo5D(vector);
    const axes = ["Tektanrıcılık", "Ritüelizm", "Ölüm Sonrası", "Metin/Dogma", "Doğa Bütünlüğü"];
    const diffs = myCompressed.map((val, i) => ({ axis: axes[i], diff: Math.abs(val - duoResult[i]) }));
    diffs.sort((a, b) => a.diff - b.diff);
    return { strongestBond: diffs[0].axis, potentialConflict: diffs[4].axis };
  }, [duoResult, vector]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c', color: '#e5e7eb', fontFamily: '"Georgia", serif', padding: '40px 20px', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .pulse { animation: pulse 2s infinite; }
        .pulse-fast { animation: pulse 1s infinite; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

      {/* Üst Çubuk - Mistik Ses Kontrolü */}
      <div style={{ maxWidth: '700px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{ background: 'transparent', border: '1px solid #2a2a30', color: soundEnabled ? '#D4AF37' : '#6b7280', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}
        >
          {soundEnabled ? '🔊 Mistik Ses: Açık' : '🔇 Mistik Ses: Sessiz'}
        </button>
      </div>

      {testType && !result && (
        <div style={{ position: 'sticky', top: '10px', zIndex: 50, backgroundColor: '#121215', border: '1px solid #D4AF37', borderRadius: '8px', padding: '15px', marginBottom: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#D4AF37', marginBottom: '5px', fontWeight: 'bold' }}>
            <span className="pulse">● Canlı Bilinçaltı Analizi</span>
            <span>Kararlılık: %{certainty}</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#2a2a30', borderRadius: '2px' }}>
            <div style={{ width: `${certainty}%`, height: '100%', backgroundColor: '#D4AF37', transition: 'width 0.4s ease-out' }}></div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#D4AF37', fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '2px' }}>KOZMO-TEO KEŞFİ</h1>

        {result && (
          <div style={{ marginBottom: '40px', padding: '30px', backgroundColor: '#0a0a0c', border: '1px solid #D4AF37', borderRadius: '4px', textAlign: 'center', boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' }}>
            <p style={{ color: '#9ca3af', fontSize: '14px', letterSpacing: '2px' }}>Bilinçaltı Eşleşmesi</p>
            <h3 style={{ margin: '10px 0', color: '#e5e7eb', fontSize: '2rem' }}>{result.belief_name}</h3>
            <h2 style={{ margin: '0 0 10px 0', color: '#D4AF37', fontSize: '3rem' }}>%{result.similarity_percentage}</h2>
            <p style={{ color: '#d1d5db', fontSize: '16px', fontStyle: 'italic', marginBottom: '20px' }}>"{result.description}"</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', borderRadius: '20px', fontSize: '13px' }}>
                ✦ İnancı Keşfet
              </button>
              <button onClick={() => setShowArchetype(true)} style={{ padding: '10px 20px', backgroundColor: '#D4AF37', border: 'none', color: '#0a0a0c', cursor: 'pointer', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                ⌲ Hikayede Paylaş
              </button>
            </div>

            {/* Yapay Zeka Kozmik Okuması */}
            <div style={{ backgroundColor: '#121215', border: '1px solid #2a2a30', borderRadius: '8px', padding: '20px', textAlign: 'left', marginBottom: '30px' }}>
              <h4 style={{ color: '#D4AF37', marginBottom: '10px', fontSize: '14px', textTransform: 'uppercase' }}>Yapay Zeka Kozmik Okuması</h4>
              {!aiReading && !isAiLoading && (
                <button onClick={fetchAiReading} style={{ width: '100%', padding: '12px', backgroundColor: '#1a1a1e', border: '1px dashed #D4AF37', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                  Senin İçin Özel Felsefi Analiz Yarat
                </button>
              )}
              {isAiLoading && <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic', textAlign: 'center' }}>Yıldızlar okunuyor, zihnin analiz ediliyor...</p>}
              {aiReading && <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>{aiReading}</p>}
            </div>

            {/* Günün Ruhsal Pratiği */}
            <div style={{ backgroundColor: 'rgba(214, 175, 55, 0.05)', border: '1px solid #D4AF37', borderRadius: '8px', padding: '20px', textAlign: 'left', marginBottom: '30px' }}>
              <h4 style={{ color: '#D4AF37', marginBottom: '10px', fontSize: '14px', textTransform: 'uppercase' }}>Günün Ruhsal Pratiği</h4>
              <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6' }}>{result.daily_reflection}</p>
            </div>

            <RadarChart vector1={compressVectorTo5D(vector)} vector2={result.belief_base_vector} pastVector={compressVectorTo5D(pastVector || [])} label1="Şu Anki Profiliniz" label2="İdeal İnanç" color1="#e5e7eb" color2="#D4AF37" />

            {/* Tüm İnançlara Yakınlık Çubukları */}
            <div style={{ marginTop: '30px', textAlign: 'left', backgroundColor: '#121215', padding: '25px', borderRadius: '8px', border: '1px solid #2a2a30' }}>
              <p style={{ color: '#D4AF37', fontSize: '14px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>TÜM İNANÇLARA YAKINLIĞINIZ</p>
              {result.secondary_matches.map((match, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span style={{ color: '#e5e7eb' }}>{match.name.split('/')[0]}</span>
                    <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>%{match.percentage}</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#2a2a30', height: '8px', borderRadius: '4px' }}>
                    <div style={{ width: `${match.percentage}%`, backgroundColor: '#D4AF37', height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '40px', paddingTop: '30px', borderTop: '1px dashed #D4AF37', textAlign: 'left' }}>
              {/* Arkadaşlık Kodu Senkronizasyonu */}
              <div style={{ backgroundColor: '#121215', padding: '25px', borderRadius: '8px', border: '1px solid #2a2a30' }}>
                <h3 style={{ color: '#D4AF37', marginBottom: '10px' }}>∞ Arkadaşlık Kodu (Kozmik Bağ)</h3>
                <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Sana özel üretilen 10 haneli sayısal kodu arkadaşınla paylaşarak aranızdaki teolojik uyumu ölçün.</p>
                <div style={{ backgroundColor: '#0a0a0c', padding: '15px', borderRadius: '4px', marginBottom: '20px', border: '1px solid #4a4a52', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '5px' }}>Senin Numaran:</p>
                  <code style={{ color: '#D4AF37', fontSize: '24px', letterSpacing: '4px', fontWeight: 'bold' }}>{myDuoCode}</code>
                </div>
                {!duoResult ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" maxLength={10} placeholder="10 Haneli Kodu Gir" value={partnerCode} onChange={e => setPartnerCode(e.target.value.replace(/\D/g, ''))} style={{ flex: 1, padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', borderRadius: '4px', fontSize: '16px', letterSpacing: '2px', textAlign: 'center' }} />
                    <button onClick={handleDuoSync} style={{ padding: '0 20px', backgroundColor: '#D4AF37', border: 'none', color: '#0a0a0c', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>Eşleştir</button>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#1a1a1e', padding: '20px', borderRadius: '8px', border: '1px solid #D4AF37', textAlign: 'center', marginTop: '10px' }}>
                    <h4 style={{ color: '#e5e7eb' }}>İkili Uyum Skoru: <span style={{ color: '#D4AF37', fontSize: '24px' }}>%{duoCompatibilityScore}</span></h4>

                    {duoAnalysis && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#121215', padding: '15px', borderRadius: '4px', margin: '15px 0', border: '1px solid #2a2a30', fontSize: '13px' }}>
                        <div style={{ textAlign: 'left' }}><span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>En Güçlü Bağ:</span><strong style={{ color: '#28a745' }}>{duoAnalysis.strongestBond}</strong></div>
                        <div style={{ textAlign: 'right' }}><span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Potansiyel Çatışma:</span><strong style={{ color: '#e0245e' }}>{duoAnalysis.potentialConflict}</strong></div>
                      </div>
                    )}

                    <RadarChart vector1={compressVectorTo5D(vector)} vector2={duoResult} label1="Sen" label2="Partnerin" color1="#D4AF37" color2="#e0245e" />
                    <button onClick={() => setDuoResult(null)} style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#6b7280', textDecoration: 'underline', cursor: 'pointer' }}>Yeni Kod Gir</button>
                  </div>
                )}
              </div>

              {/* CANLI ANONİM AĞ VE SES DOĞRULAMA MODÜLÜ */}
              <div style={{ backgroundColor: '#121215', padding: '25px', borderRadius: '8px', border: '1px solid #2a2a30' }}>
                <h3 style={{ color: '#e5e7eb', marginBottom: '10px' }}>🌌 Kozmos'ta Yalnız mısın? (Anonim Ağ)</h3>
                <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Koda ihtiyacın yok. Sesli canlılık doğrulamasıyla güvenli bir şekilde inanç frekansına uygun gerçek insanlarla eşleş ve anonimce sohbet et.</p>

                {socialStep === 'none' && (
                  <button onClick={() => setSocialStep('opt-in')} style={{ width: '100%', padding: '15px', backgroundColor: '#e5e7eb', color: '#0a0a0c', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                    Anonim Ağa Katıl
                  </button>
                )}

                {socialStep === 'opt-in' && (
                  <div>
                    <h4 style={{ color: '#D4AF37', marginBottom: '12px', fontSize: '14px' }}>Tanışma Amacınız Nedir?</h4>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button onClick={() => { setIntent('friend'); setSocialStep('user-gender'); }} style={{ padding: '15px', backgroundColor: '#1a1a1e', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', flex: 1, borderRadius: '4px', fontWeight: 'bold' }}>Yeni Felsefi Arkadaşlık</button>
                      <button onClick={() => { setIntent('flirt'); setSocialStep('user-gender'); }} style={{ padding: '15px', backgroundColor: '#1a1a1e', border: '1px solid #e0245e', color: '#e0245e', cursor: 'pointer', flex: 1, borderRadius: '4px', fontWeight: 'bold' }}>Ruh Eşi & Flört</button>
                    </div>
                  </div>
                )}

                {socialStep === 'user-gender' && (
                  <div>
                    <h4 style={{ color: '#e5e7eb', marginBottom: '10px', fontSize: '14px' }}>Biyolojik Cinsiyetiniz</h4>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '15px' }}>*Güvenlik ve sahte profilleri engellemek için sesli canlılık analizi yapılacaktır.</p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button onClick={() => { setUserGender('male'); setSocialStep('voice-verify'); }} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', cursor: 'pointer', flex: 1, borderRadius: '4px' }}>Erkek</button>
                      <button onClick={() => { setUserGender('female'); setSocialStep('voice-verify'); }} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', cursor: 'pointer', flex: 1, borderRadius: '4px' }}>Kadın</button>
                    </div>
                  </div>
                )}

                {socialStep === 'voice-verify' && userGender && (
                  <VoiceVerification
                    userGender={userGender}
                    vector={compressVectorTo5D(vector)}
                    soundEnabled={soundEnabled}
                    onVerified={() => setSocialStep('target-gender')}
                  />
                )}

                {socialStep === 'target-gender' && (
                  <div>
                    <h4 style={{ color: '#e5e7eb', marginBottom: '15px', fontSize: '14px' }}>Aradığınız Yönelim</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { setTargetGender('male'); setSocialStep('belief-preference'); }} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', cursor: 'pointer', flex: 1, borderRadius: '4px' }}>Erkek</button>
                      <button onClick={() => { setTargetGender('female'); setSocialStep('belief-preference'); }} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', cursor: 'pointer', flex: 1, borderRadius: '4px' }}>Kadın</button>
                      <button onClick={() => { setTargetGender('any'); setSocialStep('belief-preference'); }} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', cursor: 'pointer', flex: 1, borderRadius: '4px' }}>Fark Etmez</button>
                    </div>
                  </div>
                )}

                {socialStep === 'belief-preference' && (
                  <div>
                    <h4 style={{ color: '#e5e7eb', marginBottom: '15px', fontSize: '14px' }}>İnanç Filtresi</h4>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button onClick={() => startMatching('similar')} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', flex: 1, borderRadius: '4px', fontWeight: 'bold' }}>Benzer İnanç Frekansı</button>
                      <button onClick={() => startMatching('opposite')} style={{ padding: '12px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', cursor: 'pointer', flex: 1, borderRadius: '4px' }}>Zıt Kutuplar (Teolojik Zıtlık)</button>
                    </div>
                  </div>
                )}

                {socialStep === 'matching' && (
                  <div style={{ backgroundColor: '#0a0a0c', padding: '30px', borderRadius: '8px', border: '1px dashed #D4AF37', textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 15px auto', animation: 'spin 1s linear infinite' }}></div>
                    <h4 style={{ color: '#D4AF37', marginBottom: '5px' }}>Kozmik Frekanslar Taranıyor...</h4>
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>Vektörüne uygun anonim bilinç aranıyor...</p>
                  </div>
                )}

                {socialStep === 'matched' && matchSession && (
                  <div style={{ backgroundColor: '#0a0a0c', padding: '25px', borderRadius: '8px', border: '1px solid #D4AF37', textAlign: 'center' }}>
                    <p style={{ color: '#28a745', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>✓ EŞLEŞME BAŞARILI</p>
                    <h3 style={{ color: '#e5e7eb', fontSize: '20px', margin: '5px 0' }}>{matchSession.partner_name}</h3>
                    <p style={{ color: '#D4AF37', fontSize: '14px', marginBottom: '10px' }}>Arketip: <strong>{matchSession.partner_archetype}</strong></p>
                    <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Teolojik Uyum Skoru: <span style={{ color: '#D4AF37', fontSize: '18px', fontWeight: 'bold' }}>%{matchSession.compatibility}</span></p>
                    <button onClick={() => setSocialStep('chat')} style={{ padding: '12px 28px', backgroundColor: '#D4AF37', color: '#0a0a0c', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', fontSize: '14px' }}>
                      ✦ Sohbete Başla
                    </button>
                  </div>
                )}

                {/* MODÜLER CANLI SOHBET ODASI */}
                {(socialStep === 'chat' || socialStep === 'revealed') && matchSession && (
                  <ChatRoom
                    session={matchSession}
                    initialMessages={initialMessages}
                    soundEnabled={soundEnabled}
                  />
                )}
              </div>
            </div>

            <button onClick={() => {setResult(null); setTestType(null); setDuoResult(null); setSocialStep('none');}} style={{ marginTop: '40px', padding: '10px', background: 'transparent', border: 'none', color: '#6b7280', textDecoration: 'underline', cursor: 'pointer' }}>Başa Dön / Yeni Test</button>
          </div>
        )}

        {/* HİKAYEDE PAYLAŞ MODALI */}
        {showArchetype && result && (
          <ArchetypeModal
            result={result}
            soundEnabled={soundEnabled}
            onClose={() => setShowArchetype(false)}
          />
        )}

        {/* İNANÇ DETAYLARI MODALI */}
        {showModal && result && (
          <BeliefDetailModal
            result={result}
            onClose={() => setShowModal(false)}
          />
        )}

        {!testType && !result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginTop: '50px' }}>
            <button onClick={() => handleTestSelection('short')} style={{ width: '80%', padding: '20px', backgroundColor: '#1a1a1e', border: '1px solid #D4AF37', color: '#D4AF37', fontSize: '18px', cursor: 'pointer', borderRadius: '4px' }}>
              Kısa Analiz <br/><span style={{fontSize: '14px', color: '#9ca3af'}}>20 Soru (Rastgele Seçim) + 1 İkilem</span>
            </button>
            <button onClick={() => handleTestSelection('medium')} style={{ width: '80%', padding: '20px', backgroundColor: '#1a1a1e', border: '1px solid #8b7322', color: '#e5e7eb', fontSize: '18px', cursor: 'pointer', borderRadius: '4px' }}>
              Orta Keşif <br/><span style={{fontSize: '14px', color: '#9ca3af'}}>60 Soru (Rastgele Seçim) + 1 İkilem</span>
            </button>
            <button onClick={() => handleTestSelection('long')} style={{ width: '80%', padding: '20px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', fontSize: '18px', cursor: 'pointer', borderRadius: '4px' }}>
              Derin Çözümleme <br/><span style={{fontSize: '14px', color: '#9ca3af'}}>100 Soru (Rastgele Seçim) + 1 İkilem</span>
            </button>
          </div>
        ) : null}

        {testType && !result ? (
          <div style={{ backgroundColor: '#121215', padding: '40px', borderRadius: '8px', border: '1px solid #2a2a30' }}>
            <div style={{ textAlign: 'right', marginBottom: '20px', color: '#D4AF37', fontFamily: 'sans-serif', fontSize: '14px' }}>
              {currentQuestions.length} Soruluk Test
            </div>

            {currentQuestions.map((q, index) => (
              <div key={index} style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '15px' }}><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{index + 1}.</span> {q}</p>
                <input type="range" min="0" max="1" step="0.1" value={vector[index]} onChange={(e) => handleSliderChange(index, e.target.value)} style={{ width: '100%', cursor: 'pointer', accentColor: '#D4AF37' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif' }}>
                  <span>Hiç Katılmıyorum</span>
                  <span style={{color: '#D4AF37'}}>{vector[index]}</span>
                  <span>Tamamen Katılıyorum</span>
                </div>
              </div>
            ))}

            {currentDilemmas.map((d, index) => (
              <div key={`dilemma-${index}`} style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#1a1a1e', border: '1px dashed #e0245e', borderRadius: '8px' }}>
                <p style={{ fontSize: '18px', lineHeight: '1.5', marginBottom: '20px', color: '#e5e7eb' }}>{d.text}</p>
                {d.options.map((opt: any, optIndex: number) => (
                  <label key={optIndex} style={{ display: 'block', padding: '15px', border: '1px solid #4a4a52', borderRadius: '4px', marginBottom: '10px', cursor: 'pointer', backgroundColor: dilemmaVector[index] === opt.val ? 'rgba(214, 175, 55, 0.1)' : 'transparent' }}>
                    <input type="radio" name={`dilemma-${index}`} value={opt.val} checked={dilemmaVector[index] === opt.val} onChange={() => handleDilemmaChange(index, opt.val)} style={{ marginRight: '10px', accentColor: '#D4AF37' }} />
                    <span style={{ fontSize: '14px', color: '#d1d5db' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            ))}

            <button onClick={calculateMatch} style={{ width: '100%', padding: '18px', backgroundColor: '#D4AF37', color: '#0a0a0c', border: 'none', borderRadius: '4px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>RUHSAL UYUMUMU HESAPLA</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
