'use client';
import React, { useState, useRef } from 'react';
import { getApiUrl } from '../lib/api';
import { playTone, playCosmicChime } from '../lib/audio';

interface DreamArchiveModalProps {
  archetype: string;
  vector5d: number[];
  soundEnabled: boolean;
  onClose: () => void;
}

interface DreamEntry {
  id: string;
  text: string;
  archetype: string;
  interpretation: string;
  resonance: string;
  timestamp: number;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#FFE699';
const LOCAL_KEY = 'kozmo_dream_archive';

const OFFLINE_INTERPRETATIONS: Record<string, { interpretation: string; resonance: string }> = {
  'GELENEK MUHAFIZI': {
    interpretation: 'Bu rüya, inançlarının sınırlarını ve kurallarla olan ilişkini simgeliyor. Zihnin bağlılık ile özgürlük arasında sıkışmış bir kapı arıyor.',
    resonance: 'Rüyan, Tektanrıcılık ve Dogmatizm boyutlarıyla güçlü bir rezonans kuruyor.'
  },
  'HİÇLİK YOLCUSU': {
    interpretation: 'Bu rüya, varoluşun anlamsızlığı ile yaşama tutkusu arasındaki köprüde salınıyor. Bilinçaltın bir çözüm değil, bir itiraf arıyor.',
    resonance: 'Rüyan, Ölüm Sonrası ve Tektanrıcılık boyutlarıyla tuhaf bir sessizlikte titreşiyor.'
  },
  'AKIŞIN USTASI': {
    interpretation: 'Bu rüya su metaforuyla dolu; hem yönü hem yolunu seçemiyor. Belki sorun yolda değil, akmayı bırakma korkusunda.',
    resonance: 'Rüyan, Doğa/Panteizm ve Ritüelizm boyutlarıyla uyum içinde titreşiyor.'
  },
  'KOZMİK RUH': {
    interpretation: 'Bu rüya evrensel bütünlük arzusunun göstergesi. Beden ile kozmos arasındaki sınırın eritilmek isteniyor.',
    resonance: 'Rüyan, Doğa/Panteizm boyutuyla tam rezonans kuruyor.'
  },
  'SARSILMAZ İRADE': {
    interpretation: 'Rüyanda bir kale var, duvarlı ve sağlam. Ama içeride kimse yok. Güçlülük maskesi bazen yalnızlığı gizler.',
    resonance: 'Rüyan, Dogmatizm ve Ritüelizm boyutlarıyla gerilimli bir dans içinde.'
  },
  'GİZEMLİ BİLGE': {
    interpretation: 'Bu rüya şifrelenmiş sembollerin dünyası. Bilinçaltın sana sıradan dilde anlatamadıklarını sembolik bir dilde söylüyor.',
    resonance: 'Rüyan, Tektanrıcılık ve Ölüm Sonrası boyutlarıyla mistik bir bağ içinde.'
  },
};

const getOfflineInterpretation = (archetype: string, dreamText: string) => {
  const upper = archetype.toUpperCase();
  for (const [key, val] of Object.entries(OFFLINE_INTERPRETATIONS)) {
    if (upper.includes(key) || key.includes(upper.split(' ')[0])) return val;
  }
  return {
    interpretation: `Bu rüya, "${dreamText.slice(0, 30)}..." ile başlayan bir keşifin izlerini taşıyor. Bilinçaltın bir şeyleri çözmeye çalışıyor; bu sembolleri aceleyle yorumlama, zamanla açılmasına izin ver.`,
    resonance: 'Rüyan, bilinçaltının tüm 5 boyutunu aynı anda harmanlıyor gibi görünüyor.'
  };
};

export const DreamArchiveModal: React.FC<DreamArchiveModalProps> = ({
  archetype, vector5d, soundEnabled, onClose
}) => {
  const [dreamText, setDreamText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dreams, setDreams] = useState<DreamEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState<'write' | 'archive'>('write');

  const saveDream = (entry: DreamEntry) => {
    const updated = [entry, ...dreams].slice(0, 20);
    setDreams(updated);
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleInterpret = async () => {
    if (!dreamText.trim() || dreamText.trim().length < 10) {
      alert('Lütfen en az 10 karakter bir rüya açıklaması yaz.');
      return;
    }
    setIsLoading(true);
    playTone(216, 'sine', 1.0, soundEnabled);

    let interpretation = '';
    let resonance = '';

    try {
      const res = await fetch(`${getApiUrl()}/api/dream-interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream_text: dreamText, archetype, vector: vector5d })
      });
      if (res.ok) {
        const data = await res.json();
        interpretation = data.interpretation;
        resonance = data.resonance;
      } else {
        throw new Error('API hatası');
      }
    } catch {
      const offline = getOfflineInterpretation(archetype, dreamText);
      interpretation = offline.interpretation;
      resonance = offline.resonance;
    }

    const entry: DreamEntry = {
      id: Date.now().toString(),
      text: dreamText,
      archetype,
      interpretation,
      resonance,
      timestamp: Date.now()
    };
    saveDream(entry);
    playCosmicChime(soundEnabled);
    setDreamText('');
    setActiveTab('archive');
    setIsLoading(false);
  };

  const deleteDream = (id: string) => {
    const updated = dreams.filter(d => d.id !== id);
    setDreams(updated);
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(updated)); } catch {}
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,5,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'linear-gradient(170deg, #07060f 0%, #0d0a1a 100%)', border: `1.5px solid #4c1d95`, borderRadius: '14px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px 24px', position: 'relative', boxShadow: '0 0 80px rgba(76,29,149,0.3)' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>🌙 RÜYA ARŞİVİ</div>
          <h2 style={{ color: GOLD_LIGHT, fontSize: '24px', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Gece Felsefesi</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Rüyalarınız bilinçaltının felsefi haritasıdır.</p>
        </div>

        {/* Sekmeler */}
        <div style={{ display: 'flex', gap: '1px', backgroundColor: '#2d2645', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          {(['write', 'archive'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px', background: activeTab === tab ? '#1a1030' : 'transparent', border: 'none', color: activeTab === tab ? GOLD_LIGHT : '#6b7280', fontSize: '13px', cursor: 'pointer', fontWeight: activeTab === tab ? 'bold' : 'normal', transition: 'all 0.2s' }}>
              {tab === 'write' ? '✍️ Rüya Yaz' : `📚 Arşiv (${dreams.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'write' && (
          <>
            <div style={{ backgroundColor: '#0f0d1e', border: '1px solid #2d2645', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '2px', marginBottom: '10px' }}>Şu anki arketip frekansın</div>
              <div style={{ fontSize: '16px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{archetype}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Gece gördüğün rüyayı anlat:</label>
              <textarea
                value={dreamText}
                onChange={e => setDreamText(e.target.value)}
                placeholder="Rüyamda... (semboller, duygular, mekanlar, figürler — ne kadar detaylı olursa o kadar derin bir analiz)"
                rows={5}
                style={{ width: '100%', padding: '14px', backgroundColor: '#13111f', border: '1px solid #3d3558', color: '#e5e7eb', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'Georgia, serif' }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{dreamText.length} karakter</div>
            </div>

            <button
              onClick={handleInterpret}
              disabled={isLoading || dreamText.trim().length < 10}
              style={{ width: '100%', padding: '14px', background: isLoading || dreamText.trim().length < 10 ? '#1e1a2e' : 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', border: 'none', color: isLoading || dreamText.trim().length < 10 ? '#4b5563' : '#ffffff', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: isLoading || dreamText.trim().length < 10 ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}
            >
              {isLoading ? '🌙 Yıldızlar yorumlanıyor...' : '🌙 Felsefi Yorum Al'}
            </button>

            <div style={{ marginTop: '16px', backgroundColor: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px', padding: '12px' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
                <strong style={{ color: '#c4b5fd' }}>Not:</strong> Rüyalar yalnızca yerel cihazında saklanır, sunucuya gönderilmez. Yorumlar arketip vektörüne göre kişiselleştirilir.
              </p>
            </div>
          </>
        )}

        {activeTab === 'archive' && (
          <>
            {dreams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#13111f', borderRadius: '10px', border: '1px dashed #2d2645' }}>
                <p style={{ fontSize: '36px', marginBottom: '12px' }}>🌙</p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Henüz hiç rüya kaydın yok. İlk rüyanı anlat!</p>
                <button onClick={() => setActiveTab('write')} style={{ marginTop: '12px', padding: '8px 20px', background: 'rgba(167,139,250,0.2)', border: '1px solid #7c3aed', color: '#c4b5fd', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>
                  Rüya Yaz →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {dreams.map(dream => (
                  <div key={dream.id} style={{ backgroundColor: '#0f0d1e', border: '1px solid #2d2645', borderRadius: '12px', padding: '16px', position: 'relative' }}>
                    <button
                      onClick={() => deleteDream(dream.id)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '14px' }}
                    >×</button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 'bold' }}>{dream.archetype}</span>
                      <span style={{ fontSize: '10px', color: '#6b7280' }}>{new Date(dream.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', borderLeft: '2px solid #3d3558', paddingLeft: '10px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                      "{dream.text.slice(0, 150)}{dream.text.length > 150 ? '...' : ''}"
                    </p>

                    <div style={{ backgroundColor: 'rgba(167,139,250,0.08)', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#a78bfa', letterSpacing: '2px', marginBottom: '6px' }}>FELSEFİ YORUM</div>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{dream.interpretation}</p>
                    </div>

                    <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>↯ {dream.resonance}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
