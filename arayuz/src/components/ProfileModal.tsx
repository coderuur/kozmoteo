'use client';

import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../lib/api';
import { RadarChart } from './RadarChart';
import { playTone } from '../lib/audio';

interface ProfileModalProps {
  onClose: () => void;
  onLogout: () => void;
  token: string;
  soundEnabled: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onLogout, token, soundEnabled }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copyToast, setCopyToast] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/user/profile?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error('Profil yüklenemedi:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleCopyPublicLink = () => {
    if (!profileData) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kozmoteo.com';
    const link = `${origin}/u/${profileData.user.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopyToast(true);
        playTone(600, 'sine', 0.3, soundEnabled);
        setTimeout(() => setCopyToast(false), 3000);
      });
    } else {
      prompt("Kişisel Kozmik Linkin:", link);
    }
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
        maxHeight: '90vh',
        backgroundColor: '#110f1c',
        border: '1.5px solid #D4AF37',
        borderRadius: '16px',
        padding: '35px 25px',
        boxShadow: '0 0 60px rgba(212, 175, 55, 0.25)',
        position: 'relative',
        overflowY: 'auto'
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
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#FFE699' }}>
            ✦ Kozmik Pasaportun Taranıyor...
          </div>
        ) : profileData ? (
          <div>
            {/* BAŞLIK & ROZET */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid #2d2645', paddingBottom: '20px', marginBottom: '22px' }}>
              <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                ✦ KOZMİK PASAPORT ✦
              </span>
              <h2 style={{ color: '#f8fafc', fontSize: '24px', margin: '8px 0 4px 0', fontFamily: 'Georgia, serif' }}>
                @{profileData.user.username}
              </h2>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid #D4AF37',
                  borderRadius: '14px',
                  color: '#FFE699',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {profileData.user.archetype || 'Arayış Yolcusu'}
                </span>
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: '#1b172a',
                  border: '1px solid #3d3558',
                  borderRadius: '14px',
                  color: '#94a3b8',
                  fontSize: '11px'
                }}>
                  {profileData.user.auth_provider === 'google' ? '⚡ Google Hesabı' : '🎭 %100 Anonim Mahlas'}
                </span>
              </div>
            </div>

            {/* KİŞİSEL LİNK & İSTATİSTİKLER */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: '#0a0912', padding: '14px', borderRadius: '8px', border: '1px solid #2d2645', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>Kozmik Keşif Sayısı</span>
                <strong style={{ fontSize: '20px', color: '#FFE699' }}>{profileData.total_tests}</strong>
              </div>
              <div style={{ backgroundColor: '#0a0912', padding: '14px', borderRadius: '8px', border: '1px solid #2d2645', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>Kayıt Tarihi</span>
                <strong style={{ fontSize: '15px', color: '#e2e8f0' }}>{profileData.user.created_at}</strong>
              </div>
            </div>

            {/* Kişisel Link Butonu */}
            <button
              onClick={handleCopyPublicLink}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a162b',
                border: '1px dashed #D4AF37',
                color: '#FFE699',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {copyToast ? '✓ Kişisel Link Panoya Kopyalandı!' : '🔗 Kişisel Profil Bağlantını Kopyala'}
            </button>

            {/* İNANÇ EVRİMİ (Felsefi Zaman Çizelgesi & Radar) */}
            {profileData.history && profileData.history.length >= 2 && (
              <div style={{ backgroundColor: '#0a0912', padding: '20px', borderRadius: '8px', border: '1px solid #2d2645', marginBottom: '25px', textAlign: 'center' }}>
                <h4 style={{ color: '#FFE699', fontSize: '14px', margin: '0 0 4px 0', letterSpacing: '1px' }}>
                  ✦ İNANÇ EVRİMİN (FELSEFİ DÖNÜŞÜM)
                </h4>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 15px 0' }}>
                  İlk testin (Kırmızı) ile en son testin (Altın) arasındaki zihinsel değişim:
                </p>
                <RadarChart
                  vector1={profileData.history[0].vector_5d}
                  vector2={profileData.history[profileData.history.length - 1].vector_5d}
                  label1="Son Testin"
                  label2="İlk Testin"
                  color1="#D4AF37"
                  color2="#e0245e"
                />
              </div>
            )}

            {/* GEÇMİŞ TESTLER LİSTESİ */}
            <div>
              <h4 style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '12px', letterSpacing: '1px' }}>
                📜 Test Geçmişin
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profileData.history && profileData.history.length > 0 ? (
                  profileData.history.map((test: any) => (
                    <div
                      key={test.id}
                      style={{
                        backgroundColor: '#0a0912',
                        border: '1px solid #2d2645',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#FFE699', fontSize: '14px', display: 'block' }}>
                          {test.archetype} (%{test.similarity_percentage})
                        </strong>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {test.belief_name} • {test.test_type.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {test.created_at}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>
                    Henüz kayıtlı bir testin yok. Bir test çöz ve pasaportuna kaydet!
                  </p>
                )}
              </div>
            </div>

            {/* ÇIKIŞ BUTONU */}
            <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid #2d2645', paddingTop: '15px' }}>
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#ef4444' }}>
            Profil bilgileri yüklenemedi. Lütfen tekrar giriş yapın.
          </div>
        )}
      </div>
    </div>
  );
};
