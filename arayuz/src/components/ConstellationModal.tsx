'use client';

import React, { useState, useEffect, useRef } from 'react';
import { playTone, playCosmicChime } from '../lib/audio';

interface ConstellationModalProps {
  onClose: () => void;
  userArchetype?: string;
  soundEnabled: boolean;
}

interface StarNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  archetype: string;
  whisper: string;
  score: number;
}

const DEFAULT_WHISPERS = [
  { archetype: "Hiçlik Yolcusu", color: "#FFE699", whisper: "Boşluktan geldik, boşluğa dönüyoruz. Bu bir trajedi değil, mutlak bir özgürlük.", score: 98 },
  { archetype: "Akışın Ustası", color: "#67e8f9", whisper: "Su gibi ol; engelle savaşma, etrafından akıp yolunu bul.", score: 92 },
  { archetype: "Kozmik Mimar", color: "#fbbf24", whisper: "Yıldızların dizilişinde tesadüf olamayacak kadar kusursuz bir matematik var.", score: 88 },
  { archetype: "Panteist Aşık", color: "#34d399", whisper: "Ağacın kökünde ve göğün mavisinde kendi kalbimin atışını duyuyorum.", score: 95 },
  { archetype: "Stoacı Bilge", color: "#c084fc", whisper: "Dış dünyayı yönetemezsin; fakat zihninin kalesini fethedebilirsin.", score: 91 },
  { archetype: "Sufi Gezgin", color: "#f472b6", whisper: "Arayan ve aranan aslında tek bir ışığın farklı aynalardaki yansımasıdır.", score: 94 },
  { archetype: "Gnostik Arayıcı", color: "#a78bfa", whisper: "Hakikat dışarıdaki kitaplarda değil, uyanmayı bekleyen içsel kıvılcımdadır.", score: 89 },
];

export const ConstellationModal: React.FC<ConstellationModalProps> = ({ onClose, userArchetype, soundEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedStar, setSelectedStar] = useState<StarNode | null>(null);
  const [myWhisper, setMyWhisper] = useState('');
  const [stars, setStars] = useState<StarNode[]>([]);
  const [customWhispersCount, setCustomWhispersCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const initialStars: StarNode[] = Array.from({ length: 32 }, (_, i) => {
      const template = DEFAULT_WHISPERS[i % DEFAULT_WHISPERS.length];
      return {
        id: i + 1,
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.2 + 2,
        color: template.color,
        archetype: template.archetype,
        whisper: template.whisper,
        score: template.score
      };
    });
    setStars(initialStars);

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Çizgi Bağlantıları (Takımyıldız)
      for (let i = 0; i < initialStars.length; i++) {
        const s1 = initialStars[i];
        s1.x += s1.vx;
        s1.y += s1.vy;

        if (s1.x < 15 || s1.x > width - 15) s1.vx *= -1;
        if (s1.y < 15 || s1.y > height - 15) s1.vy *= -1;

        for (let j = i + 1; j < initialStars.length; j++) {
          const s2 = initialStars[j];
          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          if (dist < 85) {
            ctx.strokeStyle = s1.color;
            ctx.globalAlpha = (1 - dist / 85) * 0.2;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }

        // Yıldız Çizimi
        ctx.fillStyle = s1.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(s1.x, s1.y, s1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Parıldama aurası
        ctx.fillStyle = s1.color;
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.arc(s1.x, s1.y, s1.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [customWhispersCount]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // En yakın yıldıza tıklandı mı?
    const clicked = stars.find(s => Math.hypot(s.x - clickX, s.y - clickY) < 18);
    if (clicked) {
      setSelectedStar(clicked);
      playTone(580, 'sine', 0.25, soundEnabled);
    }
  };

  const handleSendMyWhisper = () => {
    if (!myWhisper.trim()) return;
    const canvas = canvasRef.current;
    const w = canvas?.width || 400;
    const h = canvas?.height || 300;

    const newStar: StarNode = {
      id: Date.now(),
      x: w / 2 + (Math.random() - 0.5) * 100,
      y: h / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 4.5,
      color: "#FFE699",
      archetype: userArchetype || "Senin Bilincin",
      whisper: myWhisper.trim(),
      score: 100
    };

    setStars(prev => [newStar, ...prev]);
    setSelectedStar(newStar);
    setMyWhisper('');
    setCustomWhispersCount(prev => prev + 1);
    playCosmicChime(soundEnabled);
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
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#110f1c',
        border: '1.5px solid #D4AF37',
        borderRadius: '16px',
        padding: '30px 22px',
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

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ✦ CANLI ZİHİNLER GÖKYÜZÜ ✦
          </span>
          <h3 style={{ color: '#FFE699', fontSize: '20px', margin: '6px 0 0 0', fontFamily: 'Georgia, serif' }}>
            Anonim Düşünceler Takımyıldızı
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0 0' }}>
            Yıldızlara dokunarak o an evrende süzülen diğer zihinlerin fısıltılarını dinle.
          </p>
        </div>

        {/* İNTERAKTİF GÖKYÜZÜ CANVAS */}
        <div style={{
          backgroundColor: '#07060c',
          borderRadius: '12px',
          border: '1px solid #2d2645',
          overflow: 'hidden',
          marginBottom: '18px',
          position: 'relative'
        }}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ width: '100%', height: '320px', display: 'block', cursor: 'pointer' }}
          />
          <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '10px', color: '#64748b' }}>
            ✦ Bir yıldıza dokun
          </span>
        </div>

        {/* SEÇİLEN YILDIZIN DETAYI (FISILTI KARTI) */}
        {selectedStar ? (
          <div style={{
            backgroundColor: '#0a0912',
            border: `1px solid ${selectedStar.color}`,
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '18px',
            boxShadow: `0 0 20px ${selectedStar.color}22`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ color: selectedStar.color, fontWeight: 'bold', fontSize: '13px' }}>
                ✦ {selectedStar.archetype} (%{selectedStar.score})
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Anonim Zihin</span>
            </div>
            <p style={{ color: '#f1f5f9', fontSize: '13px', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>
              "{selectedStar.whisper}"
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#0a0912',
            border: '1px dashed #2d2645',
            borderRadius: '10px',
            padding: '14px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '12px',
            marginBottom: '18px'
          }}>
            Gökyüzündeki parıldayan bir yıldıza dokunarak düşüncesini dinle.
          </div>
        )}

        {/* GÖKYÜZÜNE FISILTI BIRAKMA ALANI */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Gökyüzüne felsefi bir düşünce fısılda..."
            value={myWhisper}
            onChange={(e) => setMyWhisper(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMyWhisper(); }}
            maxLength={140}
            style={{
              flex: 1,
              padding: '11px 14px',
              backgroundColor: '#0a0912',
              border: '1px solid #3d3558',
              color: '#f8fafc',
              borderRadius: '6px',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSendMyWhisper}
            disabled={!myWhisper.trim()}
            style={{
              padding: '0 18px',
              backgroundColor: myWhisper.trim() ? '#D4AF37' : '#221f33',
              color: myWhisper.trim() ? '#07060c' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: myWhisper.trim() ? 'pointer' : 'default',
              fontSize: '12px',
              transition: 'background-color 0.2s'
            }}
          >
            Fısılda
          </button>
        </div>
      </div>
    </div>
  );
};
