'use client';
import { useState, useEffect, useMemo } from 'react';
import { MatchResult, MatchSessionData, ChatMessageItem } from '../lib/types';
import { QUESTION_POOL, getRandomSample } from '../lib/questions';
import { compressVectorTo5D } from '../lib/dictionary';
import { playTone, playCosmicChime, toggleCosmicAmbient } from '../lib/audio';
import { getApiUrl } from '../lib/api';

import { CosmicBackground } from '../components/CosmicBackground';
import { RadarChart } from '../components/RadarChart';
import { ArchetypeModal } from '../components/ArchetypeModal';
import { BeliefDetailModal } from '../components/BeliefDetailModal';
import { VoiceVerification } from '../components/VoiceVerification';
import { ChatRoom } from '../components/ChatRoom';
import { AuthModal } from '../components/AuthModal';
import { ProfileModal } from '../components/ProfileModal';
import { FooterPolicyModal } from '../components/FooterPolicyModal';
import { analyzeShadowParadox, computeShadowSelf, computeBlindSpot } from '../lib/shadow';
import { saveEvolutionEntry } from '../lib/evolution';
import { DailyOracle } from '../components/DailyOracle';
import { ConstellationModal } from '../components/ConstellationModal';
import { SocraticTrial } from '../components/SocraticTrial';
import { DuoReportModal } from '../components/DuoReportModal';
import { SoulDuelModal } from '../components/SoulDuelModal';
import { ConfessionWallModal } from '../components/ConfessionWallModal';
import { EvolutionModal } from '../components/EvolutionModal';
import { ShadowSelfModal } from '../components/ShadowSelfModal';
import { BlindSpotModal } from '../components/BlindSpotModal';
import { DreamArchiveModal } from '../components/DreamArchiveModal';
import { CosmicCourtModal } from '../components/CosmicCourtModal';
import { PulseDashboard } from '../components/PulseDashboard';
import { getBrutalTruth, decodeSoulDuel, SoulDuelData, getHumanizedPersona } from '../lib/viral';
import { getPhilosophyDeepDive } from '../lib/philosophyData';

export default function Home() {
  const [testType, setTestType] = useState<'short' | 'medium' | 'long' | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [currentDilemmas, setCurrentDilemmas] = useState<any[]>([]);
  const [vector, setVector] = useState<number[]>([]);
  const [dilemmaVector, setDilemmaVector] = useState<number[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [pastVector, setPastVector] = useState<number[] | null>(null);

  // Kullanıcı Oturumu & Kozmik Pasaport
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Günün İkilemi & Canlı Zihinler Gökyüzü Modalları
  const [showOracle, setShowOracle] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showDeepLab, setShowDeepLab] = useState(false);

  // Viral & Organik Büyüme Modalları
  const [showDuoReport, setShowDuoReport] = useState(false);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [activeDuel, setActiveDuel] = useState<SoulDuelData | null>(null);
  const [showConfessionWall, setShowConfessionWall] = useState(false);

  // v2.0 Yeni Kompleks Katmanlar
  const [showEvolution, setShowEvolution] = useState(false);
  const [showShadowSelf, setShowShadowSelf] = useState(false);
  const [showBlindSpot, setShowBlindSpot] = useState(false);
  const [showDreamArchive, setShowDreamArchive] = useState(false);
  const [showCosmicCourt, setShowCosmicCourt] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Stepper / Kart Modu
  const [viewMode, setViewMode] = useState<'stepper' | 'list'>('stepper');
  const [currentStep, setCurrentStep] = useState(0);

  // Yarıda Kalan Testi Kurtarma (Auto-Save)
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Duo / Arkadaş Eşleştirme Linki
  const [duoInvite, setDuoInvite] = useState<{ code: string; archetype: string; percentage: number } | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

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

  // Toplam Soru Sayısı
  const totalQuestions = (currentQuestions.length || 0) + (currentDilemmas.length || 0);

  // Sayfa yüklendiğinde hafızadaki son durumu yükle, URL duo parametresini tara ve Render'ı uyandır
  useEffect(() => {
    // 0. Oturum Kontrolü (Token & Kullanıcı)
    try {
      const token = localStorage.getItem('kozmo_auth_token');
      const user = localStorage.getItem('kozmo_user');
      if (token && user) {
        setAuthToken(token);
        setCurrentUser(JSON.parse(user));
      }
    } catch (e) {}

    // 1. Geçmiş Vektör
    const saved = localStorage.getItem('kozmo_past_vector');
    if (saved) {
      try { setPastVector(JSON.parse(saved)); } catch (e) {}
    }

    // 2. Yarıda Kalan Test Kontrolü
    const draft = localStorage.getItem('kozmo_active_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.currentQuestions && parsed.currentQuestions.length > 0) {
          setHasSavedDraft(true);
        }
      } catch (e) {}
    }

    // 3. URL Parametrelerinden Duo Daveti Kontrolü (?duo=10HANE&archetype=...)
    try {
      const params = new URLSearchParams(window.location.search);
      const duoCode = params.get('duo');
      if (duoCode && duoCode.length === 10 && /^\d+$/.test(duoCode)) {
        const archetype = params.get('archetype') || 'Kozmik Yolcu';
        const pct = parseInt(params.get('pct') || '100');
        setDuoInvite({ code: duoCode, archetype, percentage: pct });
        setPartnerCode(duoCode);
      }

      // 3.5. URL Parametrelerinden Felsefi Meydan Okuma (?duel=BASE64)
      const duelToken = params.get('duel');
      if (duelToken) {
        const decoded = decodeSoulDuel(duelToken);
        if (decoded) {
          setActiveDuel(decoded);
        }
      }
    } catch (e) {}

    // 4. Render Cold Start sessiz ping
    try {
      fetch(`${getApiUrl()}/health`).catch(() => {});
    } catch {
      // sessiz geç
    }

    // 5. 432 Hz Kozmik Tınıyı anında başlat (Doğrudan Mount + Mikro Etkileşim Serbest Bırakıcı)
    toggleCosmicAmbient(true);

    const unlockAudio = () => {
      toggleCosmicAmbient(true);
      const events = ['pointerdown', 'pointermove', 'touchstart', 'scroll', 'wheel', 'keydown', 'focus'];
      events.forEach(ev => window.removeEventListener(ev, unlockAudio));
    };

    const audioUnlockEvents = ['pointerdown', 'pointermove', 'touchstart', 'scroll', 'wheel', 'keydown', 'focus'];
    audioUnlockEvents.forEach(ev => window.addEventListener(ev, unlockAudio, { passive: true, once: true }));
  }, []);

  // Yarıda Kalan Testi Geri Yükle
  const resumeDraft = () => {
    try {
      const draft = localStorage.getItem('kozmo_active_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setTestType(parsed.testType);
        setCurrentQuestions(parsed.currentQuestions);
        setCurrentDilemmas(parsed.currentDilemmas);
        setVector(parsed.vector);
        setDilemmaVector(parsed.dilemmaVector);
        setCurrentStep(parsed.currentStep || 0);
        setHasSavedDraft(false);
        playTone(520, 'sine', 0.5, soundEnabled);
      }
    } catch (e) {
      localStorage.removeItem('kozmo_active_draft');
      setHasSavedDraft(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('kozmo_active_draft');
    setHasSavedDraft(false);
  };

  // Test Çözülürken Otomatik Kaydet (Auto-Save)
  useEffect(() => {
    if (testType && !result && currentQuestions.length > 0) {
      try {
        localStorage.setItem('kozmo_active_draft', JSON.stringify({
          testType,
          currentQuestions,
          currentDilemmas,
          vector,
          dilemmaVector,
          currentStep
        }));
      } catch (e) {}
    }
  }, [testType, result, currentQuestions, currentDilemmas, vector, dilemmaVector, currentStep]);

  // Modal açıkken arka plan kaydırmasını kilitle
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      showArchetype || showModal || showAuth || showProfile || showPolicy ||
      showOracle || showConstellation || showDuoReport || showDuelModal || activeDuel || showConfessionWall ||
      showEvolution || showShadowSelf || showBlindSpot || showDreamArchive || showCosmicCourt || showPulse ||
      showDiscoveryModal
    );
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [
    showArchetype, showModal, showAuth, showProfile, showPolicy,
    showOracle, showConstellation, showDuoReport, showDuelModal, activeDuel, showConfessionWall,
    showEvolution, showShadowSelf, showBlindSpot, showDreamArchive, showCosmicCourt, showPulse,
    showDiscoveryModal
  ]);

  // Test Seçimi ve Soru Üretimi (Tekrarsız Fisher-Yates)
  const handleTestSelection = (type: 'short' | 'medium' | 'long') => {
    playTone(432, 'triangle', 0.8, soundEnabled);
    setTestType(type);
    setResult(null);
    setSocialStep('none');
    setDuoResult(null);
    setAiReading(null);
    setCurrentStep(0);
    setHasSavedDraft(false);

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
      localStorage.removeItem('kozmo_active_draft');

      // v2.0: Felsefi Evrim Haritasına kaydet
      saveEvolutionEntry({
        archetype: data.archetype,
        belief_name: data.belief_name,
        similarity_percentage: data.similarity_percentage,
        vector_5d: compressVectorTo5D(vector),
        test_type: testType || 'short'
      });

      // v2.0: Toplumsal Nabız'a anonim kayıt
      try {
        fetch(`${getApiUrl()}/api/pulse/record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archetype: data.archetype })
        }).catch(() => {});
      } catch {}

      // Eğer bir arkadaş davetiyle geldiyse doğrudan otomatik eşleştir
      if (partnerCode && partnerCode.length === 10) {
        const decoded = partnerCode.match(/.{1,2}/g)?.map(n => parseInt(n) / 100);
        if (decoded && decoded.length === 5) {
          setDuoResult(decoded);
        }
      }
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
          id: 'm-1',
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
        id: 'm-1',
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

  // Tek Tıkla Viral Duo Linki Kopyalama
  const handleCopyDuoLink = () => {
    if (!result || !myDuoCode) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kozmoteo.com';
    const link = `${origin}/?duo=${myDuoCode}&archetype=${encodeURIComponent(result.archetype)}&pct=${result.similarity_percentage}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopyToast('✓ Duo Bağlantısı Kopyalandı! Arkadaşına gönder.');
        playTone(680, 'sine', 0.4, soundEnabled);
        setTimeout(() => setCopyToast(null), 3500);
      });
    } else {
      prompt("Duo Linkini Kopyala:", link);
    }
  };

  // Kozmik Pasaporta Test Sonucu Kaydetme
  const handleSaveResultToPassport = async (passedToken?: string, passedUser?: any) => {
    if (!result) return;
    const activeToken = passedToken || authToken;
    const activeUser = passedUser || currentUser;

    if (!activeToken || !activeUser) {
      setShowAuth(true);
      return;
    }

    try {
      const res = await fetch(`${getApiUrl()}/api/user/save-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: activeToken,
          test_type: testType || 'short',
          archetype: result.archetype,
          similarity_percentage: result.similarity_percentage,
          belief_name: result.belief_name,
          vector_5d: compressVectorTo5D(vector)
        })
      });
      if (res.ok) {
        setSaveToast('✓ Sonuç Kozmik Pasaportuna Başarıyla Kaydedildi!');
        playCosmicChime(soundEnabled);
        setTimeout(() => setSaveToast(null), 3500);
      }
    } catch (e) {
      alert("Sonuç kaydedilirken ağ hatası oluştu.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kozmo_auth_token');
    localStorage.removeItem('kozmo_user');
    setAuthToken(null);
    setCurrentUser(null);
    setShowProfile(false);
    playTone(340, 'sine', 0.3, soundEnabled);
  };

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

  // Kozmik Gölge & Bilinçaltı Çelişki Raporu
  const shadowParadox = useMemo(() => {
    if (!result || vector.length === 0) return null;
    return analyzeShadowParadox(compressVectorTo5D(vector));
  }, [result, vector]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07060b', color: '#e5e7eb', fontFamily: '"Georgia", serif', padding: '40px 20px', position: 'relative' }}>
      {/* 🌌 Canlı Kozmik Arka Plan Parçacıkları */}
      <CosmicBackground />

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .pulse { animation: pulse 2s infinite; }
        .pulse-fast { animation: pulse 1s infinite; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

      {/* Üst Bar - Sade, İnsan Yapımı & Editoryal Tasarım */}
      <header style={{
        maxWidth: '740px',
        margin: '0 auto 28px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 18px',
        backgroundColor: 'rgba(15, 13, 22, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 230, 153, 0.15)',
        borderRadius: '999px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Sol: Logo & Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '14px',
            fontFamily: 'Georgia, serif',
            letterSpacing: '2.5px',
            color: '#FFE699',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            KOZMO-TEO
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.5px' }}>
            · Felsefi Pusula
          </span>
        </div>

        {/* Sağ: Pasaport + Keşfet + Ses Açık/Kapalı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentUser ? (
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              style={{
                background: 'rgba(255, 230, 153, 0.1)',
                border: '1px solid rgba(255, 230, 153, 0.35)',
                color: '#FFE699',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.3px',
                cursor: 'pointer'
              }}
            >
              @{currentUser.username}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Pasaport
            </button>
          )}

          {/* Keşfet Menü Butonu */}
          <button
            type="button"
            onClick={() => setShowDiscoveryModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.4px'
            }}
          >
            ✦ Keşfet
          </button>

          {/* Mistik Tını Açık / Kapalı */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              toggleCosmicAmbient(next);
            }}
            style={{
              background: soundEnabled ? 'rgba(255, 230, 153, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: soundEnabled ? '1px solid rgba(255, 230, 153, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: soundEnabled ? '#FFE699' : '#64748b',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {soundEnabled ? 'Tını: Açık' : 'Tını: Kapalı'}
          </button>
        </div>
      </header>

      {/* KAYDEDILDI TOAST BILDIRIMI */}
      {saveToast && (
        <div style={{ position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', color: '#ffffff', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', fontSize: '13px', zIndex: 1001, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {saveToast}
        </div>
      )}

      {/* ARKADAŞ DAVETİ KARŞILAMA BANNERI (?duo=...) */}
      {duoInvite && !result && (
        <div style={{ maxWidth: '720px', margin: '0 auto 25px auto', padding: '16px 20px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(138, 43, 226, 0.15) 100%)', border: '1px solid #D4AF37', borderRadius: '10px', textAlign: 'center', position: 'relative', boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)' }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#FFE699', fontSize: '16px' }}>
            ⚔️ Felsefi Düello & Uyum Daveti!
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
            Arkadaşın seni Kozmo-Teo uyum düellosuna çağırdı! O <strong>"{duoInvite.archetype}" (%{duoInvite.percentage})</strong> çıktı. Testi tamamla, frekanslarınızın ne kadar uyuştuğunu anında gör!
          </p>
        </div>
      )}

      {/* YARIDA KALAN TESTİ KURTARMA BANNERI */}
      {hasSavedDraft && !testType && !result && (
        <div style={{ maxWidth: '720px', margin: '0 auto 25px auto', padding: '16px 20px', backgroundColor: '#13111f', border: '1px solid #D4AF37', borderRadius: '10px', textAlign: 'center', position: 'relative', boxShadow: '0 0 25px rgba(212, 175, 55, 0.2)' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#FFE699', fontSize: '15px' }}>
            💾 Yarıda Kalan Bir Testin Var!
          </h4>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94a3b8' }}>
            Cevapların hafızada saklandı. Sıfırdan başlamadan kaldığın sorudan devam edebilirsin.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={resumeDraft}
              style={{ padding: '8px 20px', backgroundColor: '#D4AF37', color: '#07060c', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              ✦ Kaldığım Yerden Devam Et
            </button>
            <button
              onClick={discardDraft}
              style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #3d3558', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}
            >
              Sil & Yeni Test Seç
            </button>
          </div>
        </div>
      )}

      {/* KOPYALANDI BİLDİRİMİ TOAST */}
      {copyToast && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', color: '#ffffff', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', fontSize: '13px', zIndex: 999, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {copyToast}
        </div>
      )}

      {/* TEST ESNASINDA ÜST BİLGİ & KARARLILIK ÇUBUĞU */}
      {testType && !result && (
        <div style={{ maxWidth: '720px', margin: '0 auto 25px auto', position: 'sticky', top: '15px', zIndex: 50, backgroundColor: 'rgba(15, 13, 24, 0.92)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.5)', borderRadius: '12px', padding: '14px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#FFE699', marginBottom: '8px', fontWeight: 'bold' }}>
            <span className="pulse">● Canlı Bilinçaltı Analizi</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span>İlerleme: %{Math.round(((currentStep + 1) / (totalQuestions || 1)) * 100)}</span>
              {/* Görünüm Modu Değiştirici */}
              <button
                onClick={() => setViewMode(viewMode === 'stepper' ? 'list' : 'stepper')}
                style={{ background: 'transparent', border: '1px solid #4a3e68', color: '#D4AF37', borderRadius: '12px', padding: '2px 8px', fontSize: '10px', cursor: 'pointer' }}
              >
                {viewMode === 'stepper' ? '📜 Tümünü Listele' : '📱 Kart Modu'}
              </button>
            </div>
          </div>
          {/* İlerleme Çubuğu */}
          <div style={{ width: '100%', height: '5px', backgroundColor: '#211d33', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(((currentStep + 1) / (totalQuestions || 1)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37 0%, #FFE699 100%)', transition: 'width 0.3s ease-out' }}></div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
        {/* Popülerlik / Canlı Sosyal Kanıt Rozeti */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 230, 153, 0.08)',
            border: '1px solid rgba(255, 230, 153, 0.25)',
            color: '#FFE699',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} className="pulse" />
            64.000'den fazla zihin kendi içsel sesini aradı
          </span>
        </div>

        <h1 style={{ textAlign: 'center', color: '#FFE699', fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '2px', textShadow: '0 0 25px rgba(212, 175, 55, 0.3)' }}>
          Aslında Neye İnanıyorsun?
        </h1>
        <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '15px', letterSpacing: '0.5px', marginBottom: '35px', maxWidth: '580px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
          Geceleri tek başına kaldığında evrenle fısıldaşan zihnin... 30 kadim ve çağdaş felsefeden hangisinin frekansında titreşiyor?
        </p>

        {/* SONUÇ EKRANI */}
        {result && (
          <div style={{ marginBottom: '40px', padding: '35px 25px', backgroundColor: 'rgba(13, 11, 20, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid #D4AF37', borderRadius: '12px', textAlign: 'center', boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)' }}>
            <p style={{ color: '#9ca3af', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase' }}>Bilinçaltı İnanç Eşleşmesi</p>
            <h3 style={{ margin: '10px 0', color: '#f8fafc', fontSize: '2.2rem', fontFamily: 'Georgia, serif' }}>{result.belief_name.replace(/\s*\([^)]*\)/g, '').trim()}</h3>
            <h2 style={{ margin: '0 0 10px 0', color: '#FFE699', fontSize: '3.4rem', textShadow: '0 0 25px rgba(212, 175, 55, 0.4)' }}>%{result.similarity_percentage}</h2>
            <p style={{ color: '#d1d5db', fontSize: '16px', fontStyle: 'italic', marginBottom: '25px', maxWidth: '580px', margin: '0 auto 25px auto' }}>"{result.description}"</p>

            {/* HALK DİLİYLE SEN • KOZMİK KİMLİK KARTI */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(13, 11, 20, 0.95) 100%)',
              border: '1.5px solid #D4AF37',
              borderRadius: '14px',
              padding: '24px 20px',
              marginBottom: '30px',
              textAlign: 'left',
              boxShadow: '0 0 35px rgba(212, 175, 55, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#FFE699', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  ✦ HALK DİLİYLE SEN • KİMLİK KARTI ✦
                </span>
                <span style={{ fontSize: '12px', color: '#FFE699', backgroundColor: 'rgba(212, 175, 55, 0.12)', padding: '4px 12px', borderRadius: '999px', border: '1px solid rgba(212, 175, 55, 0.35)' }}>
                  Ruh İkizin: {getHumanizedPersona(result.archetype).popCultureTwin}
                </span>
              </div>

              <h3 style={{ color: '#FFE699', fontSize: '22px', margin: '0 0 10px 0', fontFamily: 'Georgia, serif' }}>
                {getHumanizedPersona(result.archetype).title}
              </h3>

              <p style={{ color: '#f1f5f9', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                "{getHumanizedPersona(result.archetype).everydayYou}"
              </p>

              {/* Hashtag'siz Özellik Hapları */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                {getHumanizedPersona(result.archetype).threeWords.map((word, idx) => (
                  <span key={idx} style={{ backgroundColor: 'rgba(255, 230, 153, 0.1)', color: '#FFE699', border: '1px solid rgba(255, 230, 153, 0.3)', padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                    {word}
                  </span>
                ))}
              </div>

              {/* Red Flag & Green Flag */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px', textTransform: 'uppercase' }}>Red Flag · Dikkat Noktan</div>
                  <p style={{ color: '#fda4af', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{getHumanizedPersona(result.archetype).redFlag}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px', textTransform: 'uppercase' }}>Green Flag · Güçlü Yönün</div>
                  <p style={{ color: '#a7f3d0', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{getHumanizedPersona(result.archetype).greenFlag}</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#111019', border: '1px solid rgba(255, 230, 153, 0.15)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong style={{ color: '#FFE699' }}>Hassas Noktan:</strong> {getHumanizedPersona(result.archetype).triggersYou}
                </div>
                <button
                  type="button"
                  onClick={() => setShowArchetype(true)}
                  style={{
                    background: '#FFE699',
                    border: 'none',
                    color: '#07060c',
                    borderRadius: '999px',
                    padding: '6px 16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hikaye Kartını Gör
                </button>
              </div>
            </div>

            {/* DERİN FELSEFİ PORTRE, SÖZLER, KİTAP VE FİLM ÖNERİLERİ */}
            {(() => {
              const deepDive = getPhilosophyDeepDive(result.belief_name, result.archetype);
              return (
                <div style={{
                  backgroundColor: 'rgba(15, 14, 22, 0.9)',
                  border: '1px solid rgba(255, 230, 153, 0.18)',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  marginBottom: '32px',
                  textAlign: 'left',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                }}>
                  {/* Başlık & Motto */}
                  <div style={{ borderBottom: '1px solid rgba(255, 230, 153, 0.12)', paddingBottom: '16px', marginBottom: '22px' }}>
                    <span style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>
                      ✦ DÜNYA GÖRÜŞÜNÜN FELSEFİ ÖZÜ
                    </span>
                    <h3 style={{ color: '#FFE699', fontSize: '22px', margin: '6px 0 8px 0', fontFamily: 'Georgia, serif' }}>
                      {deepDive.name.replace(/\s*\([^)]*\)/g, '').trim()}
                    </h3>
                    <p style={{ color: '#e2e8f0', fontSize: '14.5px', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                      &ldquo;{deepDive.motto}&rdquo;
                    </p>
                  </div>

                  {/* Genişletilmiş Edebi Anlatım (Extended Essay) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                    {deepDive.extended_essay.map((paragraph, pIdx) => (
                      <p key={pIdx} style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.75', margin: 0, textAlign: 'justify' }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Kadim Filozofların Sözleri */}
                  {deepDive.quotes && deepDive.quotes.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <h4 style={{ color: '#FFE699', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>
                        ✦ TARİHTEKİ İZLER & FİLOZOFLARIN SÖZLERİ
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {deepDive.quotes.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.025)',
                              borderLeft: '3px solid #FFE699',
                              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '0 8px 8px 0',
                              padding: '14px 16px'
                            }}
                          >
                            <p style={{ color: '#f8fafc', fontSize: '14px', fontStyle: 'italic', fontFamily: 'Georgia, serif', margin: '0 0 6px 0', lineHeight: 1.5 }}>
                              &ldquo;{q.quote}&rdquo;
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                              <span style={{ color: '#FFE699', fontSize: '12px', fontWeight: 600 }}>
                                {q.author}
                              </span>
                              <span style={{ color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>
                                {q.context}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Başucu Kitapları ve Kült Filmler - Yan Yana 2 Kolon */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {/* Kitaplar */}
                    {deepDive.books && deepDive.books.length > 0 && (
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '18px' }}>
                        <h4 style={{ color: '#FFE699', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px 0', fontWeight: 600 }}>
                          ✦ BAŞUCU KİTAPLARI
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {deepDive.books.map((b, bIdx) => (
                            <div key={bIdx} style={{ borderBottom: bIdx < deepDive.books.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none', paddingBottom: bIdx < deepDive.books.length - 1 ? '10px' : '0' }}>
                              <div style={{ color: '#f8fafc', fontSize: '13.5px', fontWeight: 600 }}>
                                {b.title}
                              </div>
                              <div style={{ color: '#94a3b8', fontSize: '11.5px', marginBottom: '4px' }}>
                                {b.author}
                              </div>
                              <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: 1.4, fontStyle: 'italic' }}>
                                {b.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Filmler */}
                    {deepDive.movies && deepDive.movies.length > 0 && (
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '18px' }}>
                        <h4 style={{ color: '#FFE699', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px 0', fontWeight: 600 }}>
                          ✦ SİNEMA & FİLM ÖNERİLERİ
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {deepDive.movies.map((m, mIdx) => (
                            <div key={mIdx} style={{ borderBottom: mIdx < deepDive.movies.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none', paddingBottom: mIdx < deepDive.movies.length - 1 ? '10px' : '0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#f8fafc', fontSize: '13.5px', fontWeight: 600 }}>
                                  {m.title}
                                </span>
                                <span style={{ color: '#64748b', fontSize: '11px' }}>
                                  {m.year}
                                </span>
                              </div>
                              <div style={{ color: '#94a3b8', fontSize: '11.5px', marginBottom: '4px' }}>
                                Yönetmen: {m.director}
                              </div>
                              <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0, lineHeight: 1.4, fontStyle: 'italic' }}>
                                {m.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Birincil Eylemler: Odaklanmış, İnsan Vari ve Net 3 Seçenek */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowArchetype(true)}
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#FFE699',
                  border: 'none',
                  color: '#07060c',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.4px',
                  boxShadow: '0 10px 25px rgba(255, 230, 153, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                ✦ Hikaye Kartını İndir
              </button>
              <button
                type="button"
                onClick={() => setShowDuelModal(true)}
                style={{
                  padding: '14px 22px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Arkadaşına Meydan Oku
              </button>
              <button
                type="button"
                onClick={() => handleSaveResultToPassport()}
                style={{
                  padding: '14px 22px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Pasaportuma Kaydet
              </button>
            </div>

            {/* İçsel Laboratuvar: Zarif, İsteğe Bağlı Derinleşme */}
            <div style={{
              backgroundColor: '#0c0c11',
              border: '1px solid rgba(255, 230, 153, 0.15)',
              borderRadius: '14px',
              padding: '18px 20px',
              marginBottom: '26px',
              textAlign: 'left'
            }}>
              <div
                onClick={() => setShowDeepLab(!showDeepLab)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                    ✦ İÇSEL LABORATUVAR
                  </span>
                  <h4 style={{ margin: '4px 0 0 0', color: '#f8fafc', fontSize: '15px', fontFamily: 'Georgia, serif', fontWeight: 400 }}>
                    Derin Felsefi Analizler ve Özel Araçlar
                  </h4>
                </div>
                <span style={{ fontSize: '12px', color: '#FFE699', border: '1px solid rgba(255, 230, 153, 0.3)', padding: '5px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {showDeepLab ? 'Gizle ▴' : 'İncele ▾'}
                </span>
              </div>

              {showDeepLab && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setShowShadowSelf(true)}
                    style={{
                      padding: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#e2e8f0'
                    }}
                  >
                    <div style={{ color: '#FFE699', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Gölge Benlik</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Bilinçaltının bastırılmış karanlık kutbu.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBlindSpot(true)}
                    style={{
                      padding: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#e2e8f0'
                    }}
                  >
                    <div style={{ color: '#93c5fd', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Kör Nokta Analizi</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>5D boyutundaki en zayıf halkanın testi.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCosmicCourt(true)}
                    style={{
                      padding: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#e2e8f0'
                    }}
                  >
                    <div style={{ color: '#FFE699', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Kozmik Mahkeme</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Filozofların huzurunda inancını savun.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDreamArchive(true)}
                    style={{
                      padding: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#e2e8f0'
                    }}
                  >
                    <div style={{ color: '#c084fc', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Rüya Arşivi</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Rüyalarının felsefi ve sembolik çözümü.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEvolution(true)}
                    style={{
                      padding: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#e2e8f0'
                    }}
                  >
                    <div style={{ color: '#FFE699', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>Felsefi Evrim</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Zaman içindeki düşünsel seyrin.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDuoReport(true)}
                    style={{
                      padding: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#e2e8f0'
                    }}
                  >
                    <div style={{ color: '#67e8f9', fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>İlişki & Çatışma Raporu</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Zıt ve benzer kutupların ayrıntılı raporu.</div>
                  </button>
                </div>
              )}
            </div>

            {/* Felsefi Portre & Edebi Okuma */}
            <div style={{ backgroundColor: 'rgba(15, 14, 22, 0.85)', border: '1px solid rgba(255, 230, 153, 0.15)', borderRadius: '12px', padding: '24px 20px', textAlign: 'left', marginBottom: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
              <h4 style={{ color: '#FFE699', marginBottom: '10px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>✦ Kişiselleştirilmiş Felsefi Analiz & Derin Okuma</h4>
              {!aiReading && !isAiLoading && (
                <button
                  type="button"
                  onClick={fetchAiReading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: 'rgba(255, 230, 153, 0.05)',
                    border: '1px solid rgba(255, 230, 153, 0.3)',
                    color: '#FFE699',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Karakterine Özel Felsefi Analiz Metnini Oluştur
                </button>
              )}
              {isAiLoading && <p style={{ color: '#94a3af', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', margin: '14px 0' }}>Kadim felsefi metinler ve düşünsel argümanlar inceleniyor...</p>}
              {aiReading && <p style={{ color: '#f1f5f9', fontSize: '14px', lineHeight: '1.85', whiteSpace: 'pre-wrap', fontStyle: 'italic', margin: 0, textAlign: 'justify' }}>{aiReading}</p>}
            </div>

            {/* Günün Ruhsal Pratiği */}
            <div style={{ backgroundColor: 'rgba(214, 175, 55, 0.06)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '8px', padding: '20px', textAlign: 'left', marginBottom: '25px' }}>
              <h4 style={{ color: '#FFE699', marginBottom: '8px', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>✦ Günün Ruhsal Pratiği</h4>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{result.daily_reflection}</p>
            </div>

            {/* Radar Grafiği */}
            <RadarChart vector1={compressVectorTo5D(vector)} vector2={result.belief_base_vector} pastVector={compressVectorTo5D(pastVector || [])} label1="Senin Profilin" label2="İdeal İnanç" color1="#f8fafc" color2="#D4AF37" />

            {/* KOZMİK AYNA: BİLİNÇALTI GÖLGE PARADOKSU */}
            {shadowParadox && (
              <div style={{
                background: 'linear-gradient(135deg, #130f24 0%, #0d0a17 100%)',
                border: '1.5px solid #8A2BE2',
                borderRadius: '12px',
                padding: '24px 20px',
                marginTop: '30px',
                textAlign: 'left',
                boxShadow: '0 0 35px rgba(138, 43, 226, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    ✦ KOZMİK AYNA • GÖLGE PARADOKSU ✦
                  </span>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                    {shadowParadox.tension}
                  </span>
                </div>
                <h3 style={{ color: '#FFE699', fontSize: '20px', margin: '0 0 4px 0', fontFamily: 'Georgia, serif' }}>
                  {shadowParadox.title}
                </h3>
                <p style={{ color: '#d8b4fe', fontSize: '12px', margin: '0 0 14px 0', fontStyle: 'italic' }}>
                  {shadowParadox.subtitle}
                </p>
                <p style={{ color: '#f1f5f9', fontSize: '14px', lineHeight: '1.7', margin: '0 0 14px 0' }}>
                  {shadowParadox.analysis}
                </p>
                <div style={{ backgroundColor: 'rgba(138, 43, 226, 0.12)', borderLeft: '3px solid #c084fc', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', color: '#e2e8f0', fontStyle: 'italic' }}>
                  <strong style={{ color: '#FFE699' }}>Kozmik Tavsiye: </strong>
                  {shadowParadox.advice}
                </div>
              </div>
            )}

            {/* SOKRATES'İN AYNASI: RUH TOKADI (SAVAGE INSIGHT) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(13, 11, 20, 0.95) 100%)',
              border: '1.5px solid #f43f5e',
              borderRadius: '12px',
              padding: '24px 20px',
              marginTop: '30px',
              textAlign: 'left',
              boxShadow: '0 0 30px rgba(244, 63, 94, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#f43f5e', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  ⚡ SOKRATES'İN AYNASI • RUH TOKADI ⚡
                </span>
                <span style={{ fontSize: '11px', color: '#fda4af', fontStyle: 'italic' }}>
                  Acımasız Gerçek
                </span>
              </div>
              <p style={{ color: '#ffffff', fontSize: '15px', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', margin: '0 0 14px 0' }}>
                "{getBrutalTruth(result.archetype).quote}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Tarihteki Ruh İkizin: <strong style={{ color: '#FFE699' }}>{getBrutalTruth(result.archetype).historicalMirror}</strong>
                </span>
                <button
                  onClick={() => setShowArchetype(true)}
                  style={{
                    background: 'rgba(244, 63, 94, 0.2)',
                    border: '1px solid #f43f5e',
                    color: '#fda4af',
                    borderRadius: '16px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  📸 Ruh Tokadı Kartını İndir
                </button>
              </div>
            </div>

            {/* SOKRATES'İN MAHKEMESİ: FİLOZOFLA YÜZLEŞME */}
            <SocraticTrial
              archetype={result.archetype}
              beliefName={result.belief_name}
              soundEnabled={soundEnabled}
            />

            {/* İKİLİ ARKADAŞLIK VE DUO UYUM KARTI */}
            <div style={{ backgroundColor: '#110f1c', padding: '25px', borderRadius: '8px', border: '1px solid #332d4a', marginTop: '30px', textAlign: 'left' }}>
              <h3 style={{ color: '#FFE699', marginBottom: '6px', fontSize: '18px' }}>∞ Duo Uyum & Felsefi Düello</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '18px' }}>
                Arkadaşına özel linki göndererek veya 10 haneli kodları eşleştirerek zıt ve benzer kutuplarınızı keşfedin.
              </p>

              <div style={{ backgroundColor: '#07060b', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #2d2645', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '5px' }}>Senin 10 Haneli Kodun:</p>
                <code style={{ color: '#FFE699', fontSize: '24px', letterSpacing: '5px', fontWeight: 'bold' }}>{myDuoCode}</code>
              </div>

              {!duoResult ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Arkadaşının 10 Haneli Kodunu Gir"
                    value={partnerCode}
                    onChange={e => setPartnerCode(e.target.value.replace(/\D/g, ''))}
                    style={{ flex: 1, padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e5e7eb', borderRadius: '6px', fontSize: '15px', letterSpacing: '2px', textAlign: 'center' }}
                  />
                  <button onClick={handleDuoSync} style={{ padding: '0 24px', backgroundColor: '#D4AF37', border: 'none', color: '#07060c', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}>
                    Eşleştir
                  </button>
                </div>
              ) : (
                <div style={{ backgroundColor: '#171426', padding: '20px', borderRadius: '8px', border: '1px solid #D4AF37', textAlign: 'center', marginTop: '10px' }}>
                  <h4 style={{ color: '#e2e8f0', margin: '0 0 10px 0' }}>
                    İkili Ruhsal Uyum: <span style={{ color: '#FFE699', fontSize: '28px', fontWeight: 'bold' }}>%{duoCompatibilityScore}</span>
                  </h4>

                  {duoAnalysis && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#0a0912', padding: '14px 18px', borderRadius: '6px', margin: '15px 0', border: '1px solid #2d2645', fontSize: '13px' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px', fontSize: '11px' }}>En Güçlü Ortak Frekans:</span>
                        <strong style={{ color: '#10b981', fontSize: '14px' }}>✦ {duoAnalysis.strongestBond}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#9ca3af', display: 'block', marginBottom: '4px', fontSize: '11px' }}>En Büyük Teolojik Ayrışma:</span>
                        <strong style={{ color: '#f43f5e', fontSize: '14px' }}>⚡ {duoAnalysis.potentialConflict}</strong>
                      </div>
                    </div>
                  )}

                  <RadarChart vector1={compressVectorTo5D(vector)} vector2={duoResult} label1="Sen" label2="Partnerin" color1="#D4AF37" color2="#9d72ff" />
                  <button onClick={() => setDuoResult(null)} style={{ marginTop: '12px', background: 'transparent', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}>
                    Farklı Kod Dene
                  </button>
                </div>
              )}
            </div>

            {/* CANLI ANONİM AĞ VE SES DOĞRULAMA MODÜLÜ */}
            <div style={{ backgroundColor: '#110f1c', padding: '25px', borderRadius: '8px', border: '1px solid #2d2645', marginTop: '30px', textAlign: 'left' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>🌌 Kozmos'ta Yalnız mısın? • Anonim Ağ</h3>
              <p style={{ color: '#94a3af', fontSize: '13px', marginBottom: '20px' }}>
                Koda gerek kalmadan sesli canlılık doğrulamasıyla botlardan arındırılmış gerçek insanlarla eşleş ve anonim felsefi sohbet başlat.
              </p>

              {socialStep === 'none' && (
                <button onClick={() => setSocialStep('opt-in')} style={{ width: '100%', padding: '15px', backgroundColor: '#e2e8f0', color: '#07060c', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Anonim Ağa Katıl
                </button>
              )}

              {socialStep === 'opt-in' && (
                <div>
                  <h4 style={{ color: '#FFE699', marginBottom: '12px', fontSize: '14px' }}>Tanışma Amacınız Nedir?</h4>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => { setIntent('friend'); setSocialStep('user-gender'); }} style={{ padding: '15px', backgroundColor: '#171426', border: '1px solid #D4AF37', color: '#FFE699', cursor: 'pointer', flex: 1, borderRadius: '6px', fontWeight: 'bold' }}>Yeni Felsefi Arkadaşlık</button>
                    <button onClick={() => { setIntent('flirt'); setSocialStep('user-gender'); }} style={{ padding: '15px', backgroundColor: '#171426', border: '1px solid #e0245e', color: '#e0245e', cursor: 'pointer', flex: 1, borderRadius: '6px', fontWeight: 'bold' }}>Ruh Eşi & Flört</button>
                  </div>
                </div>
              )}

              {socialStep === 'user-gender' && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '10px', fontSize: '14px' }}>Biyolojik Cinsiyetiniz</h4>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '15px' }}>*Güvenlik ve sahte profilleri engellemek için sesli canlılık analizi yapılacaktır.</p>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => { setUserGender('male'); setSocialStep('voice-verify'); }} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e2e8f0', cursor: 'pointer', flex: 1, borderRadius: '6px' }}>Erkek</button>
                    <button onClick={() => { setUserGender('female'); setSocialStep('voice-verify'); }} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e2e8f0', cursor: 'pointer', flex: 1, borderRadius: '6px' }}>Kadın</button>
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
                  <h4 style={{ color: '#e2e8f0', marginBottom: '15px', fontSize: '14px' }}>Aradığınız Yönelim</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setTargetGender('male'); setSocialStep('belief-preference'); }} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e2e8f0', cursor: 'pointer', flex: 1, borderRadius: '6px' }}>Erkek</button>
                    <button onClick={() => { setTargetGender('female'); setSocialStep('belief-preference'); }} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e2e8f0', cursor: 'pointer', flex: 1, borderRadius: '6px' }}>Kadın</button>
                    <button onClick={() => { setTargetGender('any'); setSocialStep('belief-preference'); }} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e2e8f0', cursor: 'pointer', flex: 1, borderRadius: '6px' }}>Fark Etmez</button>
                  </div>
                </div>
              )}

              {socialStep === 'belief-preference' && (
                <div>
                  <h4 style={{ color: '#e2e8f0', marginBottom: '15px', fontSize: '14px' }}>İnanç Filtresi</h4>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => startMatching('similar')} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #D4AF37', color: '#FFE699', cursor: 'pointer', flex: 1, borderRadius: '6px', fontWeight: 'bold' }}>Benzer İnanç Frekansı</button>
                    <button onClick={() => startMatching('opposite')} style={{ padding: '12px', backgroundColor: '#171426', border: '1px solid #3d3558', color: '#e2e8f0', cursor: 'pointer', flex: 1, borderRadius: '6px' }}>Zıt Kutuplar</button>
                  </div>
                </div>
              )}

              {socialStep === 'matching' && (
                <div style={{ backgroundColor: '#07060b', padding: '30px', borderRadius: '8px', border: '1px dashed #D4AF37', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 15px auto', animation: 'spin 1s linear infinite' }}></div>
                  <h4 style={{ color: '#FFE699', marginBottom: '5px' }}>Kozmik Frekanslar Taranıyor...</h4>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>Vektörüne uygun anonim bilinç aranıyor...</p>
                </div>
              )}

              {socialStep === 'matched' && matchSession && (
                <div style={{ backgroundColor: '#07060b', padding: '25px', borderRadius: '8px', border: '1px solid #D4AF37', textAlign: 'center' }}>
                  <p style={{ color: '#10b981', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' }}>✓ EŞLEŞME BAŞARILI</p>
                  <h3 style={{ color: '#f8fafc', fontSize: '20px', margin: '5px 0' }}>{matchSession.partner_name}</h3>
                  <p style={{ color: '#FFE699', fontSize: '14px', marginBottom: '10px' }}>Arketip: <strong>{matchSession.partner_archetype}</strong></p>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Teolojik Uyum Skoru: <span style={{ color: '#FFE699', fontSize: '18px', fontWeight: 'bold' }}>%{matchSession.compatibility}</span></p>
                  <button onClick={() => setSocialStep('chat')} style={{ padding: '12px 28px', backgroundColor: '#D4AF37', color: '#07060c', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px', fontSize: '14px' }}>
                    ✦ Sohbete Başla
                  </button>
                </div>
              )}

              {(socialStep === 'chat' || socialStep === 'revealed') && matchSession && (
                <ChatRoom
                  session={matchSession}
                  initialMessages={initialMessages}
                  soundEnabled={soundEnabled}
                />
              )}
            </div>

            <button onClick={() => { setResult(null); setTestType(null); setDuoResult(null); setSocialStep('none'); }} style={{ marginTop: '40px', padding: '10px', background: 'transparent', border: 'none', color: '#6b7280', textDecoration: 'underline', cursor: 'pointer' }}>
              Başa Dön / Yeni Test
            </button>
          </div>
        )}


        {/* TEST SEÇİM EKRANI */}
        {!testType && !result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginTop: '30px' }}>
            {/* Hızlı Keşif */}
            <button
              onClick={() => handleTestSelection('short')}
              style={{
                width: '92%',
                maxWidth: '540px',
                padding: '22px 24px',
                backgroundColor: 'rgba(255, 230, 153, 0.04)',
                border: '1px solid rgba(255, 230, 153, 0.35)',
                color: '#FFE699',
                cursor: 'pointer',
                borderRadius: '14px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Georgia, serif', color: '#f8fafc' }}>
                  Hızlı Keşif · 3 Dakika
                </span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255, 230, 153, 0.15)', border: '1px solid rgba(255, 230, 153, 0.4)', color: '#FFE699', padding: '3px 12px', borderRadius: '999px', fontWeight: 600 }}>
                  Önerilen
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Kısa ve odaklanmış profil analizi · 20 Soru ve 1 Hayati İkilem
              </p>
            </button>

            {/* Derinleşme Modu */}
            <button
              onClick={() => handleTestSelection('medium')}
              style={{
                width: '92%',
                maxWidth: '540px',
                padding: '22px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                cursor: 'pointer',
                borderRadius: '14px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Georgia, serif', color: '#f8fafc' }}>
                  Derinleşme · 60 Soru
                </span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', padding: '3px 12px', borderRadius: '999px' }}>
                  Dengeli
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Çok boyutlu felsefi haritalama · 60 Soru ve 1 Hayati İkilem
              </p>
            </button>

            {/* Kapsamlı Analiz */}
            <button
              onClick={() => handleTestSelection('long')}
              style={{
                width: '92%',
                maxWidth: '540px',
                padding: '22px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                color: '#cbd5e1',
                cursor: 'pointer',
                borderRadius: '14px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Georgia, serif', color: '#f8fafc' }}>
                  Kapsamlı Analiz · 100 Soru
                </span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', padding: '3px 12px', borderRadius: '999px' }}>
                  Tam Profil
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Bilinçaltının tüm nüanslarını kapsayan tam envanter · 100 Soru ve 1 Hayati İkilem
              </p>
            </button>
          </div>
        ) : null}

        {/* TEST ÇÖZME EKRANI */}
        {testType && !result ? (
          <div>
            {/* 1. KART / STEPPER MODU (Mobil & Odaklanmış Görünüm) */}
            {viewMode === 'stepper' ? (
              <div style={{ backgroundColor: 'rgba(17, 15, 28, 0.92)', backdropFilter: 'blur(8px)', padding: '35px 25px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.4)', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                {/* Soru Sayacı */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '13px', color: '#FFE699', letterSpacing: '1px' }}>
                  <span>✦ {currentStep < currentQuestions.length ? `SORU ${currentStep + 1} / ${currentQuestions.length}` : 'HAYATİ İKİLEM'}</span>
                  <span style={{ color: '#94a3b8' }}>{testType.toUpperCase()} KEŞİF</span>
                </div>

                {/* Sıcak & Samimi İlerleme Fısıltısı */}
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '20px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {currentStep < 5 && "İlk adımlar: Aklına gelen ilk içgüdüsel hisse güven."}
                  {currentStep >= 5 && currentStep < 12 && "Derinleşiyoruz: Zihinsel desenlerin belirginleşmeye başlıyor."}
                  {currentStep >= 12 && currentStep < 18 && "Derin sulardayız: Yanıtların dengeli bir felsefi portre çiziyor."}
                  {currentStep >= 18 && "Son aşama: Arketipini ortaya çıkarmaya çok az kaldı."}
                </div>

                {/* Normal Soru */}
                {currentStep < currentQuestions.length ? (
                  <div>
                    <p style={{ fontSize: '20px', lineHeight: '1.6', marginBottom: '30px', color: '#f8fafc', minHeight: '65px' }}>
                      {currentQuestions[currentStep]}
                    </p>

                    {/* Hızlı Seçim Butonları (0.0, 0.25, 0.50, 0.75, 1.0) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '25px' }}>
                      {[
                        { label: 'Asla', icon: '✕', val: 0.0 },
                        { label: 'Pek Değil', icon: '—', val: 0.25 },
                        { label: 'Nötr', icon: '•', val: 0.5 },
                        { label: 'Bana Yakın', icon: '✓', val: 0.75 },
                        { label: 'Kesinlikle', icon: '★', val: 1.0 },
                      ].map((btn) => (
                        <button
                          key={btn.val}
                          onClick={() => {
                            handleSliderChange(currentStep, btn.val.toString());
                            playTone(400 + btn.val * 300, 'sine', 0.2, soundEnabled);
                          }}
                          style={{
                            padding: '10px 4px',
                            backgroundColor: vector[currentStep] === btn.val ? 'rgba(212, 175, 55, 0.25)' : '#0e0c18',
                            border: `1px solid ${vector[currentStep] === btn.val ? '#D4AF37' : '#2d2645'}`,
                            borderRadius: '8px',
                            color: vector[currentStep] === btn.val ? '#FFE699' : '#94a3b8',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: vector[currentStep] === btn.val ? 'bold' : 'normal',
                            transition: 'all 0.15s'
                          }}
                        >
                          <span style={{ fontSize: '11px', display: 'block', opacity: 0.7, marginBottom: '2px' }}>{btn.icon}</span>
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {/* Hassas Slider */}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={vector[currentStep]}
                      onChange={(e) => handleSliderChange(currentStep, e.target.value)}
                      style={{ width: '100%', cursor: 'pointer', accentColor: '#D4AF37' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                      <span>Hiç Katılmıyorum</span>
                      <span style={{ color: '#FFE699', fontWeight: 'bold', fontSize: '14px' }}>{vector[currentStep]}</span>
                      <span>Tamamen Katılıyorum</span>
                    </div>
                  </div>
                ) : (
                  /* İkilem Senaryosu */
                  <div>
                    {currentDilemmas.map((d, dIdx) => (
                      <div key={dIdx}>
                        <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '25px', color: '#f8fafc' }}>
                          {d.text}
                        </p>
                        {d.options.map((opt: any, optIndex: number) => (
                          <label
                            key={optIndex}
                            style={{
                              display: 'block',
                              padding: '16px',
                              border: `1px solid ${dilemmaVector[dIdx] === opt.val ? '#D4AF37' : '#332d4a'}`,
                              borderRadius: '8px',
                              marginBottom: '12px',
                              cursor: 'pointer',
                              backgroundColor: dilemmaVector[dIdx] === opt.val ? 'rgba(212, 175, 55, 0.15)' : '#0e0c18',
                              transition: 'all 0.2s'
                            }}
                          >
                            <input
                              type="radio"
                              name={`dilemma-${dIdx}`}
                              value={opt.val}
                              checked={dilemmaVector[dIdx] === opt.val}
                              onChange={() => {
                                handleDilemmaChange(dIdx, opt.val);
                                playTone(540, 'triangle', 0.3, soundEnabled);
                              }}
                              style={{ marginRight: '12px', accentColor: '#D4AF37' }}
                            />
                            <span style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.4' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Gezinme Butonları (Önceki / Sonraki / Tamamla) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px', gap: '12px' }}>
                  <button
                    onClick={() => {
                      if (currentStep > 0) {
                        setCurrentStep(currentStep - 1);
                        playTone(380, 'sine', 0.2, soundEnabled);
                      }
                    }}
                    disabled={currentStep === 0}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: currentStep === 0 ? '#110f1c' : '#1a162b',
                      border: '1px solid #3d3558',
                      color: currentStep === 0 ? '#4b5563' : '#e2e8f0',
                      borderRadius: '6px',
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    ← Önceki Soru
                  </button>

                  {currentStep < totalQuestions - 1 ? (
                    <button
                      onClick={() => {
                        setCurrentStep(currentStep + 1);
                        playTone(520, 'sine', 0.2, soundEnabled);
                      }}
                      style={{
                        padding: '12px 26px',
                        background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
                        border: 'none',
                        color: '#07060c',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
                      }}
                    >
                      Sonraki Soru →
                    </button>
                  ) : (
                    <button
                      onClick={calculateMatch}
                      style={{
                        padding: '12px 30px',
                        background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
                        border: 'none',
                        color: '#07060c',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)'
                      }}
                    >
                      ✦ Analizimi Başlat ✦
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* 2. LİSTE MODU (Klasik Tümünü Alt Alta Görme) */
              <div style={{ backgroundColor: '#110f1c', padding: '35px 25px', borderRadius: '12px', border: '1px solid #2d2645' }}>
                <div style={{ textAlign: 'right', marginBottom: '20px', color: '#FFE699', fontSize: '13px' }}>
                  {currentQuestions.length} Soruluk Test
                </div>

                {currentQuestions.map((q, index) => (
                  <div key={index} style={{ marginBottom: '35px' }}>
                    <p style={{ fontSize: '17px', lineHeight: '1.5', marginBottom: '12px' }}>
                      <span style={{ color: '#FFE699', fontWeight: 'bold' }}>{index + 1}.</span> {q}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={vector[index]}
                      onChange={(e) => handleSliderChange(index, e.target.value)}
                      style={{ width: '100%', cursor: 'pointer', accentColor: '#D4AF37' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                      <span>Hiç Katılmıyorum</span>
                      <span style={{ color: '#FFE699' }}>{vector[index]}</span>
                      <span>Tamamen Katılıyorum</span>
                    </div>
                  </div>
                ))}

                {currentDilemmas.map((d, index) => (
                  <div key={`dilemma-${index}`} style={{ marginBottom: '35px', padding: '20px', backgroundColor: '#171426', border: '1px dashed #e0245e', borderRadius: '8px' }}>
                    <p style={{ fontSize: '17px', lineHeight: '1.5', marginBottom: '18px', color: '#e5e7eb' }}>{d.text}</p>
                    {d.options.map((opt: any, optIndex: number) => (
                      <label key={optIndex} style={{ display: 'block', padding: '14px', border: '1px solid #3d3558', borderRadius: '4px', marginBottom: '10px', cursor: 'pointer', backgroundColor: dilemmaVector[index] === opt.val ? 'rgba(214, 175, 55, 0.15)' : 'transparent' }}>
                        <input type="radio" name={`dilemma-${index}`} value={opt.val} checked={dilemmaVector[index] === opt.val} onChange={() => handleDilemmaChange(index, opt.val)} style={{ marginRight: '10px', accentColor: '#D4AF37' }} />
                        <span style={{ fontSize: '14px', color: '#d1d5db' }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                ))}

                <button onClick={calculateMatch} style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)', color: '#07060c', border: 'none', borderRadius: '6px', fontSize: '17px', cursor: 'pointer', fontWeight: 'bold' }}>
                  RUHSAL UYUMUMU HESAPLA
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* ALT BİLGİ (FOOTER) */}
        <footer style={{ marginTop: '70px', padding: '30px 10px', textAlign: 'center', borderTop: '1px solid rgba(255, 230, 153, 0.1)' }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0', letterSpacing: '1px' }}>
            ✦ KOZMO-TEO · Bilinçaltı Felsefi Harita Platformu
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
            <a href="https://kozmoteo.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#FFE699', textDecoration: 'none' }}>
              kozmoteo.vercel.app
            </a>
            <span>·</span>
            <a href="https://kozmoteo.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: '#FFE699', textDecoration: 'none' }}>
              kozmoteo.netlify.app
            </a>
          </div>
          <button
            type="button"
            onClick={() => setShowPolicy(true)}
            style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Felsefi Gizlilik ve Güvenlik İlkeleri · KVKK
          </button>
        </footer>
      </div>

      {/* KEŞFET MENÜ MODALI */}
      {showDiscoveryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#0d0d12',
            border: '1px solid rgba(255, 230, 153, 0.2)',
            borderRadius: '16px',
            padding: '26px 24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowDiscoveryModal(false)}
              aria-label="Kapat"
              style={{
                position: 'absolute',
                top: '16px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>
                ✦ KOZMİK KEŞİF
              </span>
              <h3 style={{ color: '#f8fafc', fontSize: '20px', margin: '4px 0 0 0', fontFamily: 'Georgia, serif', fontWeight: 400 }}>
                Felsefi Keşif Odaları
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setShowDiscoveryModal(false); setShowOracle(true); }}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#e2e8f0'
                }}
              >
                <div style={{ color: '#FFE699', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Günün İkilemi</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Kadim ahlaki açmazlar ve toplumsal seçimler.</div>
              </button>
              <button
                type="button"
                onClick={() => { setShowDiscoveryModal(false); setShowConstellation(true); }}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#e2e8f0'
                }}
              >
                <div style={{ color: '#67e8f9', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Canlı Zihinler Gökyüzü</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Anlık evren haritasında diğer bilinçler.</div>
              </button>
              <button
                type="button"
                onClick={() => { setShowDiscoveryModal(false); setShowConfessionWall(true); }}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#e2e8f0'
                }}
              >
                <div style={{ color: '#c084fc', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Gece Fısıltıları</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Anonim itiraflar ve gece düşünceleri.</div>
              </button>
              <button
                type="button"
                onClick={() => { setShowDiscoveryModal(false); setShowPulse(true); }}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#e2e8f0'
                }}
              >
                <div style={{ color: '#34d399', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Toplumsal Nabız</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Türkiye genelinde inanç eğilimleri ve harita.</div>
              </button>
              <button
                type="button"
                onClick={() => { setShowDiscoveryModal(false); setShowEvolution(true); }}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#e2e8f0',
                  gridColumn: '1 / -1'
                }}
              >
                <div style={{ color: '#FFE699', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Felsefi Evrim Haritası</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>Zaman içindeki düşünsel dönüşümün ve test geçmişin.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVRENSEL MODALLAR (Stacking context bağımsız - Z-Index 99999) */}
      {showArchetype && result && (
        <ArchetypeModal
          result={result}
          soundEnabled={soundEnabled}
          onClose={() => setShowArchetype(false)}
        />
      )}

      {showModal && result && (
        <BeliefDetailModal
          result={result}
          onClose={() => setShowModal(false)}
        />
      )}

      {showAuth && (
        <AuthModal
          soundEnabled={soundEnabled}
          onClose={() => setShowAuth(false)}
          onSuccess={(user, token) => {
            setCurrentUser(user);
            setAuthToken(token);
            if (result) {
              handleSaveResultToPassport(token, user);
            }
          }}
        />
      )}

      {showProfile && authToken && (
        <ProfileModal
          token={authToken}
          soundEnabled={soundEnabled}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}

      {showPolicy && (
        <FooterPolicyModal onClose={() => setShowPolicy(false)} />
      )}

      {showOracle && (
        <DailyOracle
          soundEnabled={soundEnabled}
          onClose={() => setShowOracle(false)}
        />
      )}

      {showConstellation && (
        <ConstellationModal
          soundEnabled={soundEnabled}
          userArchetype={result?.archetype}
          onClose={() => setShowConstellation(false)}
        />
      )}

      {/* 8. KOZMİK İLİŞKİ & ÇATIŞMA RAPORU (DUO 2.0) */}
      {showDuoReport && result && (
        <DuoReportModal
          userResult={result}
          partnerName={duoInvite?.archetype ? 'Arkadaşın' : 'Partner'}
          partnerArchetype={duoInvite?.archetype || 'Gelenek Muhafızı'}
          partnerPercentage={duoInvite?.percentage || 85}
          soundEnabled={soundEnabled}
          onClose={() => setShowDuoReport(false)}
        />
      )}

      {/* 9. BENİ NE KADAR TANIYORSUN? MEYDAN OKUMA (OLUŞTURUCU) */}
      {showDuelModal && (
        <SoulDuelModal
          mode="create"
          userName={currentUser?.username || 'Gezgin'}
          userArchetype={result?.archetype || 'Kozmik Yolcu'}
          soundEnabled={soundEnabled}
          onClose={() => setShowDuelModal(false)}
        />
      )}

      {/* 10. BENİ NE KADAR TANIYORSUN? MEYDAN OKUMA (MİSAFİR TAHMİN EDER) */}
      {activeDuel && (
        <SoulDuelModal
          mode="play"
          duelData={activeDuel}
          soundEnabled={soundEnabled}
          onClose={() => setActiveDuel(null)}
          onTakeTest={() => {
            setActiveDuel(null);
            handleTestSelection('short');
          }}
        />
      )}

      {/* 11. KOZMİK GECE FISILTILARI & İTİRAF DUVARI */}
      {showConfessionWall && (
        <ConfessionWallModal
          userArchetype={result?.archetype}
          soundEnabled={soundEnabled}
          onClose={() => setShowConfessionWall(false)}
        />
      )}

      {/* ===== v2.0 YENİ KOMPLEKS KATMANLAR ===== */}

      {/* 12. FELSEFİ EVRİM HARİTASI */}
      {showEvolution && (
        <EvolutionModal onClose={() => setShowEvolution(false)} />
      )}

      {/* 13. GÖLGE BENLİK ANALİZİ */}
      {showShadowSelf && result && (
        <ShadowSelfModal
          vector5d={compressVectorTo5D(vector)}
          primaryBelief={result.belief_name}
          primaryArchetype={result.archetype}
          soundEnabled={soundEnabled}
          onClose={() => setShowShadowSelf(false)}
        />
      )}

      {/* 14. KÖR NOKTA SKORU */}
      {showBlindSpot && result && (
        <BlindSpotModal
          vector5d={compressVectorTo5D(vector)}
          archetype={result.archetype}
          soundEnabled={soundEnabled}
          onRefinedVector={(newVec) => {
            // Yeni rafine vektörü kaydet
            localStorage.setItem('kozmo_past_vector', JSON.stringify(newVec));
          }}
          onClose={() => setShowBlindSpot(false)}
        />
      )}

      {/* 15. RÜYA ARŞİVİ */}
      {showDreamArchive && result && (
        <DreamArchiveModal
          archetype={result.archetype}
          vector5d={compressVectorTo5D(vector)}
          soundEnabled={soundEnabled}
          onClose={() => setShowDreamArchive(false)}
        />
      )}

      {/* 16. KOZMİK MAHKEME */}
      {showCosmicCourt && result && (
        <CosmicCourtModal
          archetype={result.archetype}
          vector5d={compressVectorTo5D(vector)}
          soundEnabled={soundEnabled}
          onClose={() => setShowCosmicCourt(false)}
        />
      )}

      {/* 17. TOPLUMSAL NABIZ */}
      {showPulse && result && (
        <PulseDashboard
          userArchetype={result.archetype}
          userVector={compressVectorTo5D(vector)}
          onClose={() => setShowPulse(false)}
        />
      )}
    </div>
  );
}
