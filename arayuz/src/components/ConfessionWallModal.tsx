'use client';

import React, { useState, useEffect } from 'react';
import { ConfessionItem, INITIAL_CONFESSIONS } from '../lib/viral';
import { downloadConfessionCard } from '../lib/canvas';
import { playTone, playCosmicChime } from '../lib/audio';

interface ConfessionWallModalProps {
  userArchetype?: string;
  soundEnabled: boolean;
  onClose: () => void;
}

const ARCHETYPES_LIST = [
  'ALL',
  'HİÇLİK YOLCUSU',
  'GELENEK MUHAFIZI',
  'AKIŞIN USTASI',
  'KOZMİK RUH',
  'SARSILMAZ İRADE',
  'ABSÜRT İSYANKAR'
];

export const ConfessionWallModal: React.FC<ConfessionWallModalProps> = ({
  userArchetype,
  soundEnabled,
  onClose
}) => {
  const [confessions, setConfessions] = useState<ConfessionItem[]>(INITIAL_CONFESSIONS);
  const [filter, setFilter] = useState<string>('ALL');
  const [newText, setNewText] = useState('');
  const [selectedArch, setSelectedArch] = useState(userArchetype || 'HİÇLİK YOLCUSU');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kozmo_confessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConfessions(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const handleEcho = (id: string) => {
    playTone(640, 'sine', 0.25, soundEnabled);
    const updated = confessions.map((c) => {
      if (c.id === id) {
        const isEchoed = !c.isUserEchoed;
        return {
          ...c,
          echoCount: isEchoed ? c.echoCount + 1 : c.echoCount - 1,
          isUserEchoed: isEchoed
        };
      }
      return c;
    });
    setConfessions(updated);
    try {
      localStorage.setItem('kozmo_confessions', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    playCosmicChime(soundEnabled);
    const now = new Date();
    const timeStr = `Gece ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newConf: ConfessionItem = {
      id: `c-${Date.now()}`,
      archetype: selectedArch,
      text: newText.trim(),
      echoCount: 1,
      timestamp: timeStr,
      isUserEchoed: true
    };

    const updated = [newConf, ...confessions];
    setConfessions(updated);
    setNewText('');
    try {
      localStorage.setItem('kozmo_confessions', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDownloadCard = async (conf: ConfessionItem) => {
    setIsExporting(conf.id);
    playTone(720, 'sine', 0.4, soundEnabled);
    try {
      await downloadConfessionCard(conf);
    } finally {
      setIsExporting(null);
    }
  };

  const filteredConfessions = filter === 'ALL'
    ? confessions
    : confessions.filter((c) => c.archetype.toUpperCase().includes(filter.toUpperCase()));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: 'min(90vh, 760px)',
        backgroundColor: '#0d0d12',
        border: '1px solid rgba(255, 230, 153, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 230, 153, 0.25)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          aria-label="Kapat"
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
            lineHeight: 1,
            zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Üst Başlık - flexShrink 0 */}
        <div style={{ textAlign: 'center', marginBottom: '18px', flexShrink: 0 }}>
          <span style={{
            fontSize: '11px',
            color: '#d4af37',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'block',
            marginBottom: '4px'
          }}>
            ✦ KOZMİK GECE FISILTILARI
          </span>
          <h3 style={{
            color: '#f8fafc',
            fontSize: '22px',
            margin: '0 0 6px 0',
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            letterSpacing: '0.5px'
          }}>
            Anonim Zihinlerin İtirafları
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
            Gece yalnız kaldığında evrenle paylaştığın filtresiz düşünceler.
          </p>
        </div>

        {/* Filtre Rozetleri - flexShrink 0 ve düzgün gap */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {ARCHETYPES_LIST.map((f) => {
            const isSelected = filter === f;
            const label = f === 'ALL' ? '✦ Tüm Zihinler' : f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  playTone(560, 'sine', 0.15, soundEnabled);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: isSelected
                    ? '1px solid rgba(255, 230, 153, 0.7)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isSelected
                    ? 'rgba(255, 230, 153, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#FFE699' : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: isSelected ? 600 : 400,
                  letterSpacing: '0.4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.2'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* İtiraflar Listesi - flex: 1, minHeight: 0, taşmayı önler */}
        <div style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '16px',
          paddingRight: '6px'
        }}>
          {filteredConfessions.map((conf) => (
            <div
              key={conf.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '12px',
                padding: '14px 16px',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  color: '#FFE699',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  ✦ {conf.archetype}
                </span>
                <span style={{ color: '#64748b', fontSize: '11px' }}>
                  {conf.timestamp}
                </span>
              </div>

              <p style={{
                color: '#e2e8f0',
                fontSize: '13.5px',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
                margin: '0 0 12px 0',
                lineHeight: '1.55'
              }}>
                &ldquo;{conf.text}&rdquo;
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleEcho(conf.id)}
                  style={{
                    background: conf.isUserEchoed ? 'rgba(255, 230, 153, 0.15)' : 'transparent',
                    border: conf.isUserEchoed ? '1px solid rgba(255, 230, 153, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: conf.isUserEchoed ? '#FFE699' : '#94a3b8',
                    borderRadius: '999px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>✦</span>
                  <span>Yankıla · {conf.echoCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadCard(conf)}
                  disabled={isExporting === conf.id}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#d4af37',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    letterSpacing: '0.3px',
                    fontWeight: 500
                  }}
                >
                  {isExporting === conf.id ? 'Hazırlanıyor...' : 'Story Kartı İndir ↗'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Yeni Fısıltı Gönder Formu - flexShrink 0 */}
        <form
          onSubmit={handleAddConfession}
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '14px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <select
              value={selectedArch}
              onChange={(e) => setSelectedArch(e.target.value)}
              style={{
                backgroundColor: '#14141c',
                border: '1px solid rgba(255, 230, 153, 0.25)',
                color: '#FFE699',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="HİÇLİK YOLCUSU">Hiçlik Yolcusu</option>
              <option value="GELENEK MUHAFIZI">Gelenek Muhafızı</option>
              <option value="AKIŞIN USTASI">Akışın Ustası</option>
              <option value="KOZMİK RUH">Kozmik Ruh</option>
              <option value="SARSILMAZ İRADE">Sarsılmaz İrade</option>
              <option value="ABSÜRT İSYANKAR">Absürt İsyankar</option>
            </select>
            <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center', letterSpacing: '0.3px' }}>
              %100 Anonim · Kayıt Tutulmaz
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Gece evrene fısıldamak istediğin bir düşünce yaz..."
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#f8fafc',
                fontSize: '12px',
                outline: 'none'
              }}
              maxLength={250}
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              style={{
                padding: '10px 18px',
                background: newText.trim()
                  ? '#FFE699'
                  : 'rgba(255, 255, 255, 0.06)',
                color: newText.trim() ? '#0a0a0c' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: newText.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              Fısılda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
