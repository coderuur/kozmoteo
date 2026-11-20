'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../lib/api';

interface PulseDashboardProps {
  userArchetype: string;
  userVector: number[];
  onClose: () => void;
}

interface PulseData {
  archetype: string;
  count: number;
  percentage: number;
  color: string;
}

interface AgeGroupData {
  group: string;
  archetype: string;
  percentage: number;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#FFE699';

const ARCHETYPE_COLORS: Record<string, string> = {
  'GELENEK MUHAFIZI': '#10b981',
  'MERHAMET ELÇİSİ': '#f472b6',
  'KADİM YASA KORUYUCU': '#f59e0b',
  'İÇSEL GEZGİN': '#60a5fa',
  'DÖNGÜNÜN BİLGESİ': '#a78bfa',
  'AKIŞIN USTASI': '#34d399',
  'KADİM ŞAMAN': '#fbbf24',
  'IŞIĞIN SAVAŞÇISI': '#fb923c',
  'AKILCI MİMAR': '#38bdf8',
  'KOZMİK RUH': '#818cf8',
  'SARSILMAZ İRADE': '#94a3b8',
  'DÜNYEVİ AYDIN': '#6ee7b7',
  'GİZEMLİ BİLGE': '#c084fc',
  'HİÇLİK YOLCUSU': '#6b7280',
  'ABSÜRT İSYANKAR': '#f43f5e',
  'TEKNO-MİMAR': '#22d3ee',
  'BİREYSEL ASİ': '#ef4444',
  'DOĞANIN BÜYÜCÜSÜ': '#86efac',
  'ŞÜPHECİ GÖZLEMCİ': '#d1d5db',
  'AŞKIN DERVİŞ': '#e879f9',
};

// Offline mock data — realistik simülasyon
const MOCK_GLOBAL: PulseData[] = [
  { archetype: 'KOZMİK RUH', count: 8420, percentage: 18, color: ARCHETYPE_COLORS['KOZMİK RUH'] },
  { archetype: 'HİÇLİK YOLCUSU', count: 6230, percentage: 13, color: ARCHETYPE_COLORS['HİÇLİK YOLCUSU'] },
  { archetype: 'GELENEK MUHAFIZI', count: 5980, percentage: 12, color: ARCHETYPE_COLORS['GELENEK MUHAFIZI'] },
  { archetype: 'AKIŞIN USTASI', count: 4870, percentage: 10, color: ARCHETYPE_COLORS['AKIŞIN USTASI'] },
  { archetype: 'SARSILMAZ İRADE', count: 4210, percentage: 9, color: ARCHETYPE_COLORS['SARSILMAZ İRADE'] },
  { archetype: 'AŞKIN DERVİŞ', count: 3760, percentage: 8, color: ARCHETYPE_COLORS['AŞKIN DERVİŞ'] },
  { archetype: 'AKILCI MİMAR', count: 3200, percentage: 7, color: ARCHETYPE_COLORS['AKILCI MİMAR'] },
  { archetype: 'ABSÜRT İSYANKAR', count: 2980, percentage: 6, color: ARCHETYPE_COLORS['ABSÜRT İSYANKAR'] },
  { archetype: 'GİZEMLİ BİLGE', count: 2450, percentage: 5, color: ARCHETYPE_COLORS['GİZEMLİ BİLGE'] },
  { archetype: 'DÜNYEVİ AYDIN', count: 2100, percentage: 4, color: ARCHETYPE_COLORS['DÜNYEVİ AYDIN'] },
];

const MOCK_TR: PulseData[] = [
  { archetype: 'GELENEK MUHAFIZI', count: 2310, percentage: 24, color: ARCHETYPE_COLORS['GELENEK MUHAFIZI'] },
  { archetype: 'KOZMİK RUH', count: 1870, percentage: 19, color: ARCHETYPE_COLORS['KOZMİK RUH'] },
  { archetype: 'AŞKIN DERVİŞ', count: 1540, percentage: 16, color: ARCHETYPE_COLORS['AŞKIN DERVİŞ'] },
  { archetype: 'HİÇLİK YOLCUSU', count: 1200, percentage: 12, color: ARCHETYPE_COLORS['HİÇLİK YOLCUSU'] },
  { archetype: 'SARSILMAZ İRADE', count: 980, percentage: 10, color: ARCHETYPE_COLORS['SARSILMAZ İRADE'] },
];

const MOCK_AGE: AgeGroupData[] = [
  { group: '13-17', archetype: 'ABSÜRT İSYANKAR', percentage: 31 },
  { group: '18-24', archetype: 'HİÇLİK YOLCUSU', percentage: 28 },
  { group: '25-34', archetype: 'KOZMİK RUH', percentage: 26 },
  { group: '35-44', archetype: 'SARSILMAZ İRADE', percentage: 24 },
  { group: '45-54', archetype: 'GELENEK MUHAFIZI', percentage: 29 },
  { group: '55+', archetype: 'AŞKIN DERVİŞ', percentage: 33 },
];

export const PulseDashboard: React.FC<PulseDashboardProps> = ({ userArchetype, userVector, onClose }) => {
  const [view, setView] = useState<'global' | 'turkey' | 'age'>('global');
  const [pulseData, setPulseData] = useState<PulseData[]>(MOCK_GLOBAL);
  const [ageData, setAgeData] = useState<AgeGroupData[]>(MOCK_AGE);
  const [turkeyData, setTurkeyData] = useState<PulseData[]>(MOCK_TR);
  const [liveCount, setLiveCount] = useState(47230);
  const [isLive, setIsLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // "Canlı" sayaç simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Gerçek API'den veri çekmeyi dene
  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/pulse`);
        if (res.ok) {
          const data = await res.json();
          if (data.global) setPulseData(data.global);
          if (data.turkey) setTurkeyData(data.turkey);
          if (data.age) setAgeData(data.age);
          if (data.total_users) setLiveCount(data.total_users);
          setIsLive(true);
        }
      } catch {
        // offline mock kalır
      }
    };
    fetchPulse();
  }, []);

  // Pasta/bar grafik canvas çiz
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = view === 'turkey' ? turkeyData : pulseData;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d0a17';
    ctx.fillRect(0, 0, W, H);

    // Pasta grafik
    const cx = 100, cy = H / 2, R = 75;
    let startAngle = -Math.PI / 2;
    data.slice(0, 7).forEach(d => {
      const slice = (d.percentage / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.strokeStyle = '#0d0a17';
      ctx.lineWidth = 2;
      ctx.stroke();
      startAngle += slice;
    });

    // Merkez daire (donut efekti)
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = '#0d0a17';
    ctx.fill();

    // Legend
    const legendX = 195;
    data.slice(0, 7).forEach((d, i) => {
      const y = 20 + i * 26;
      ctx.fillStyle = d.color;
      ctx.fillRect(legendX, y - 5, 10, 10);
      ctx.font = `${userArchetype === d.archetype ? 'bold ' : ''}10px sans-serif`;
      ctx.fillStyle = userArchetype === d.archetype ? GOLD_LIGHT : '#94a3b8';
      ctx.fillText(`${d.archetype} — %${d.percentage}`, legendX + 14, y + 4);
    });
  }, [view, pulseData, turkeyData, userArchetype]);

  const currentData = view === 'turkey' ? turkeyData : pulseData;
  const userRank = currentData.findIndex(d => d.archetype === userArchetype) + 1;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'linear-gradient(170deg, #07060b 0%, #0d0a17 100%)', border: `1.5px solid ${GOLD}`, borderRadius: '14px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px 24px', position: 'relative', boxShadow: `0 0 60px rgba(212,175,55,0.15)` }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}>×</button>

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite' }} />
            <div style={{ fontSize: '11px', color: '#10b981', letterSpacing: '3px', textTransform: 'uppercase' }}>
              {isLive ? 'CANLI VERİ' : 'SİMÜLASYON MOD'}
            </div>
          </div>
          <h2 style={{ color: GOLD_LIGHT, fontSize: '24px', fontFamily: 'Georgia, serif', margin: '0 0 6px 0' }}>Toplumsal Nabız</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
            Şu ana kadar <strong style={{ color: GOLD_LIGHT }}>{liveCount.toLocaleString('tr-TR')}</strong> kozmik zihin haritalandı.
          </p>
        </div>

        {/* Senin konumun */}
        <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}`, borderRadius: '10px', padding: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', color: GOLD, letterSpacing: '2px', marginBottom: '4px' }}>SENİN ARKETİPİN</div>
            <div style={{ fontSize: '16px', color: GOLD_LIGHT, fontWeight: 'bold' }}>{userArchetype}</div>
          </div>
          {userRank > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>KOZMİK SIRALAMADA</div>
              <div style={{ fontSize: '20px', color: GOLD_LIGHT, fontWeight: 'bold' }}>#{userRank}</div>
            </div>
          )}
        </div>

        {/* Sekme */}
        <div style={{ display: 'flex', gap: '1px', backgroundColor: '#2d2645', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          {(['global', 'turkey', 'age'] as const).map(tab => (
            <button key={tab} onClick={() => setView(tab)} style={{ flex: 1, padding: '10px', background: view === tab ? '#1a1030' : 'transparent', border: 'none', color: view === tab ? GOLD_LIGHT : '#6b7280', fontSize: '12px', cursor: 'pointer', fontWeight: view === tab ? 'bold' : 'normal', transition: 'all 0.2s' }}>
              {tab === 'global' ? '🌍 Dünya' : tab === 'turkey' ? '🇹🇷 Türkiye' : '📊 Yaş Grupları'}
            </button>
          ))}
        </div>

        {view !== 'age' && (
          <>
            {/* Pasta grafik */}
            <div style={{ backgroundColor: '#0d0a17', borderRadius: '10px', border: '1px solid #2d2645', marginBottom: '20px', overflow: 'hidden' }}>
              <canvas ref={canvasRef} width={620} height={200} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            {/* Bar chart tablo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {currentData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: d.archetype === userArchetype ? 'rgba(212,175,55,0.08)' : '#13111f', borderRadius: '8px', padding: '10px 12px', border: d.archetype === userArchetype ? `1px solid ${GOLD}` : '1px solid #2d2645' }}>
                  <span style={{ width: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>#{i + 1}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '12px', color: d.archetype === userArchetype ? GOLD_LIGHT : '#e2e8f0', fontWeight: d.archetype === userArchetype ? 'bold' : 'normal' }}>{d.archetype}</span>
                  <div style={{ width: '100px', height: '6px', backgroundColor: '#1e1a2e', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.percentage}%`, height: '100%', backgroundColor: d.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: d.color, fontWeight: 'bold', width: '36px', textAlign: 'right' }}>%{d.percentage}</span>
                  {d.archetype === userArchetype && <span style={{ fontSize: '10px', color: GOLD, fontWeight: 'bold' }}>← Sen</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'age' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {ageData.map((a, i) => (
              <div key={i} style={{ backgroundColor: '#13111f', borderRadius: '10px', border: '1px solid #2d2645', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{a.group} Yaş Grubu</div>
                  <div style={{ fontSize: '15px', color: ARCHETYPE_COLORS[a.archetype] || '#e2e8f0', fontWeight: 'bold' }}>{a.archetype}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Dominant</div>
                  <div style={{ fontSize: '20px', color: GOLD_LIGHT, fontWeight: 'bold' }}>%{a.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.2)`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '11px', margin: 0 }}>
            {isLive ? '🔴 Veriler gerçek zamanlı yenileniyor.' : '📊 Şu an simülasyon modunda. Kullanıcı verisi birikmesiyle canlı moda geçecek.'} Tüm istatistikler tamamen anonimdir.
          </p>
        </div>
      </div>
    </div>
  );
};
