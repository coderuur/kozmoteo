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
        maxWidth: '580px',
        maxHeight: '90vh',
        backgroundColor: '#110f1c',
        border: '1.5px solid #c084fc',
        borderRadius: '18px',
        padding: '30px 22px',
        boxShadow: '0 0 60px rgba(192, 132, 252, 0.25)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
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
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: '#c084fc', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ✦ KOZMİK GECE FISILTILARI ✦
          </span>
          <h3 style={{ color: '#FFE699', fontSize: '22px', margin: '4px 0 2px 0', fontFamily: 'Georgia, serif' }}>
            Anonim Zihinlerin İtirafları
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
            Gece yalnız kaldığında evrenle paylaştığın en derin, filtresiz sırlar.
          </p>
        </div>

        {/* Filtre Rozetleri */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '18px',
          justifyContent: 'center'
        }}>
          {['ALL', 'HİÇLİK YOLCUSU', 'GELENEK MUHAFIZI', 'AKIŞIN USTASI', 'KOZMİK RUH', 'SARSILMAZ İRADE'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                playTone(560, 'sine', 0.15, soundEnabled);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filter === f ? '1.5px solid #c084fc' : '1px solid #2d2645',
                backgroundColor: filter === f ? 'rgba(192, 132, 252, 0.25)' : '#120f1e',
                color: filter === f ? '#f3e8ff' : '#94a3b8',
                fontSize: '11px',
                fontWeight: filter === f ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f === 'ALL' ? '✦ Tüm Zihinler' : f}
            </button>
          ))}
        </div>

        {/* İtiraflar Listesi */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '4px' }}>
          {filteredConfessions.map((conf) => (
            <div
              key={conf.id}
              style={{
                backgroundColor: '#0a0912',
                border: '1px solid #231c38',
                borderRadius: '12px',
                padding: '14px 16px',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ color: '#c084fc', fontSize: '11px', fontWeight: 'bold' }}>
                  ✦ {conf.archetype}
                </span>
                <span style={{ color: '#64748b', fontSize: '11px' }}>
                  {conf.timestamp}
                </span>
              </div>

              <p style={{ color: '#f1f5f9', fontSize: '13px', fontStyle: 'italic', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                "{conf.text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => handleEcho(conf.id)}
                  style={{
                    background: conf.isUserEchoed ? 'rgba(192, 132, 252, 0.2)' : 'transparent',
                    border: '1px solid #3d3558',
                    color: conf.isUserEchoed ? '#e9d5ff' : '#cbd5e1',
                    borderRadius: '14px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🌌 Yankıla • {conf.echoCount}
                </button>

                <button
                  onClick={() => handleDownloadCard(conf)}
                  disabled={isExporting === conf.id}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFE699',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {isExporting === conf.id ? 'İndiriliyor...' : '📸 Story Kartı İndir'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Yeni Fısıltı Gönder Formu */}
        <form onSubmit={handleAddConfession} style={{ borderTop: '1px solid #231c38', paddingTop: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <select
              value={selectedArch}
              onChange={(e) => setSelectedArch(e.target.value)}
              style={{
                backgroundColor: '#0a0912',
                border: '1px solid #3d3558',
                color: '#FFE699',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              <option value="HİÇLİK YOLCUSU">Hiçlik Yolcusu</option>
              <option value="GELENEK MUHAFIZI">Gelenek Muhafızı</option>
              <option value="AKIŞIN USTASI">Akışın Ustası</option>
              <option value="KOZMİK RUH">Kozmik Ruh</option>
              <option value="SARSILMAZ İRADE">Sarsılmaz İrade</option>
              <option value="ABSÜRT İSYANKAR">Absürt İsyankar</option>
            </select>
            <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>
              %100 Anonim
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Gece evrene fısıldamak istediğin bir itiraf yaz..."
              style={{
                flex: 1,
                backgroundColor: '#0a0912',
                border: '1px solid #3d3558',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
              maxLength={250}
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              style={{
                padding: '10px 18px',
                background: newText.trim() ? 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)' : '#231c38',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: newText.trim() ? 'pointer' : 'default'
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
