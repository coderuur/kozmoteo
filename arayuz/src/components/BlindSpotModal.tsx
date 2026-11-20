'use client';
import React, { useState } from 'react';
import { computeBlindSpot, BlindSpotResult } from '../lib/shadow';
import { playTone } from '../lib/audio';

interface BlindSpotModalProps {
  vector5d: number[];
  archetype: string;
  soundEnabled: boolean;
  onRefinedVector?: (newVec: number[]) => void;
  onClose: () => void;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#FFE699';

export const BlindSpotModal: React.FC<BlindSpotModalProps> = ({
  vector5d, archetype, soundEnabled, onRefinedVector, onClose
}) => {
  const blindSpot: BlindSpotResult = computeBlindSpot(vector5d);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<'intro' | 'questions' | 'result'>('intro');
  const [refinedVec, setRefinedVec] = useState<number[] | null>(null);

  const handleAnswer = (qIdx: number, val: number) => {
    playTone(432, 'triangle', 0.3, soundEnabled);
    setAnswers(prev => ({ ...prev, [qIdx]: val }));
  };

  const handleSubmit = () => {
    const vals = Object.values(answers);
    if (vals.length < blindSpot.deepeningQuestions.length) {
      alert('Lütfen tüm soruları yanıtla.');
      return;
    }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const newVec = [...vector5d];
    newVec[blindSpot.weakestIndex] = avg;
    setRefinedVec(newVec);
    if (onRefinedVector) onRefinedVector(newVec);
    playTone(528, 'sine', 1.5, soundEnabled);
    setPhase('result');
  };

  const weakPct = Math.round(blindSpot.weakScore * 100);
  const refinedPct = refinedVec ? Math.round(refinedVec[blindSpot.weakestIndex] * 100) : null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#0a0912', border: `1.5px solid #3b82f6`, borderRadius: '14px', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px 24px', position: 'relative', boxShadow: '0 0 60px rgba(59,130,246,0.2)' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#60a5fa', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>🔵 KÖR NOKTA SKORU</div>
          <h2 style={{ color: GOLD_LIGHT, fontSize: '24px', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Bilinçaltı Kör Noktası</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>5D vektöründeki en zayıf boyutu derinleştirici sorularla rafine et.</p>
        </div>

        {phase === 'intro' && (
          <>
            {/* Zayıf boyut kartı */}
            <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#60a5fa', letterSpacing: '2px', marginBottom: '8px' }}>Tespit Edilen Kör Noktan</div>
              <div style={{ fontSize: '24px', color: GOLD_LIGHT, fontWeight: 'bold', marginBottom: '6px' }}>{blindSpot.weakestDimension}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <div style={{ flex: 1, maxWidth: '200px', height: '8px', backgroundColor: '#1e1a2e', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${weakPct}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '14px', color: '#60a5fa', fontWeight: 'bold' }}>%{weakPct}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px' }}>Bu boyutta bilinciniz henüz tam derinliğine inmemiş.</p>
            </div>

            {/* Insight */}
            <div style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', fontStyle: 'italic', margin: 0 }}>"{blindSpot.insight}"</p>
            </div>

            {/* 5D bar chart */}
            <div style={{ backgroundColor: '#13111f', borderRadius: '10px', border: '1px solid #2d2645', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Mevcut 5D Profil</div>
              {['Tektanrıcılık','Ritüelizm','Ölüm Sonrası','Dogmatizm','Doğa/Panteizm'].map((dim, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '100px', fontSize: '12px', color: i === blindSpot.weakestIndex ? '#60a5fa' : '#9ca3af', flexShrink: 0 }}>
                    {i === blindSpot.weakestIndex ? '⚠️ ' : ''}{dim}
                  </span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#1e1a2e', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${vector5d[i] * 100}%`, height: '100%', background: i === blindSpot.weakestIndex ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: i === blindSpot.weakestIndex ? '#60a5fa' : '#6b7280', width: '32px', textAlign: 'right' }}>%{Math.round(vector5d[i] * 100)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase('questions')}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', color: '#ffffff', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 0 25px rgba(59,130,246,0.3)' }}
            >
              🔵 Derinleştirici Soruları Başlat
            </button>
          </>
        )}

        {phase === 'questions' && (
          <>
            <div style={{ fontSize: '11px', color: '#60a5fa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
              {blindSpot.weakestDimension} — Derinleştirici Sorular
            </div>

            {blindSpot.deepeningQuestions.map((q, i) => (
              <div key={i} style={{ backgroundColor: '#13111f', borderRadius: '10px', border: `1px solid ${answers[i] !== undefined ? '#3b82f6' : '#2d2645'}`, padding: '16px', marginBottom: '14px', transition: 'border-color 0.3s' }}>
                <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px', fontStyle: 'italic' }}>
                  {i + 1}. {q.question}
                </p>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Katılmıyorum</span>
                  <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                    {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(val => (
                      <button
                        key={val}
                        onClick={() => handleAnswer(i, val)}
                        style={{ flex: 1, height: '28px', borderRadius: '4px', border: answers[i] === val ? '2px solid #60a5fa' : '1px solid #2d2645', backgroundColor: answers[i] === val ? 'rgba(59,130,246,0.3)' : '#0d0a17', cursor: 'pointer', transition: 'all 0.2s' }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Katılıyorum</span>
                </div>
                {answers[i] !== undefined && (
                  <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '11px', color: '#60a5fa' }}>
                    %{Math.round(answers[i] * 100)}
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setPhase('intro')} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid #3d3558', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>← Geri</button>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < blindSpot.deepeningQuestions.length}
                style={{ flex: 2, padding: '11px', background: Object.keys(answers).length >= blindSpot.deepeningQuestions.length ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1e1a2e', border: 'none', color: Object.keys(answers).length >= blindSpot.deepeningQuestions.length ? '#fff' : '#4b5563', borderRadius: '8px', cursor: Object.keys(answers).length >= blindSpot.deepeningQuestions.length ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '13px' }}
              >
                Vektörümü Rafine Et ({Object.keys(answers).length}/{blindSpot.deepeningQuestions.length})
              </button>
            </div>
          </>
        )}

        {phase === 'result' && refinedVec && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>✦</div>
              <h3 style={{ color: GOLD_LIGHT, fontSize: '20px', fontFamily: 'Georgia, serif', margin: '0 0 8px 0' }}>Bilinç Pusulası Rafine Edildi</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Kör noktanın ışığa döndü.</p>
            </div>

            <div style={{ backgroundColor: '#13111f', borderRadius: '10px', border: '1px solid #2d2645', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {blindSpot.weakestDimension} — Önce / Sonra
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Önceki</div>
                  <div style={{ fontSize: '28px', color: '#6b7280', fontWeight: 'bold' }}>%{weakPct}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#10b981' }}>→</div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#60a5fa', marginBottom: '6px' }}>Rafine Edilmiş</div>
                  <div style={{ fontSize: '28px', color: GOLD_LIGHT, fontWeight: 'bold' }}>%{refinedPct}</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                <strong style={{ color: GOLD_LIGHT }}>Kozmik Netlik Artışı:</strong> {blindSpot.weakestDimension} boyutundaki bilinç seviyeni {weakPct === refinedPct ? 'teyit ettin' : refinedPct! > weakPct ? `%${weakPct}'den %${refinedPct}'e yükseltin` : `%${weakPct}'den %${refinedPct}'e rafine ettin`}. Bu boyuttaki arketip eşleşmen şimdi daha doğru.
              </p>
            </div>

            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`, border: 'none', color: '#07060c', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              ✦ Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
