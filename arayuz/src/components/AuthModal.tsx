'use client';

import React, { useState } from 'react';
import { getApiUrl } from '../lib/api';
import { playTone, playCosmicChime } from '../lib/audio';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
  soundEnabled: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, soundEnabled }) => {
  const [tab, setTab] = useState<'google' | 'anonymous'>('google');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Anonim Kayıt / Giriş
  const handleAnonymousAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    playTone(480, 'sine', 0.2, soundEnabled);

    const endpoint = isRegister ? '/api/auth/register-anonymous' : '/api/auth/login-anonymous';

    try {
      const res = await fetch(`${getApiUrl()}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'İşlem başarısız oldu.');
      }

      playCosmicChime(soundEnabled);
      localStorage.setItem('kozmo_auth_token', data.token);
      localStorage.setItem('kozmo_user', JSON.stringify(data.user));
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
      playTone(280, 'sawtooth', 0.3, soundEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth yalnızca sunucu tarafında imzalı id_token ile doğrulanır
  const handleGoogleLogin = async () => {
    setError('Google ile giriş şu an bakımda. Güvenlik nedeniyle lütfen Kozmik Mahlas & Şifre ile giriş yapın veya kayıt olun.');
    playTone(420, 'triangle', 0.25, soundEnabled);
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
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#110f1c',
        border: '1px solid #D4AF37',
        borderRadius: '16px',
        padding: '35px 25px',
        boxShadow: '0 0 50px rgba(212, 175, 55, 0.25)',
        position: 'relative'
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

        <h3 style={{
          textAlign: 'center',
          color: '#FFE699',
          fontFamily: 'Georgia, serif',
          fontSize: '22px',
          margin: '0 0 6px 0',
          letterSpacing: '1px'
        }}>
          ✦ KOZMİK PASAPORT ✦
        </h3>
        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '13px',
          margin: '0 0 25px 0'
        }}>
          Ruhsal yolculuğunu mühürle, inanç evrimini takip et.
        </p>

        {/* Sekmeler (Google vs Anonim) */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0a0912',
          border: '1px solid #2d2645',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '25px'
        }}>
          <button
            onClick={() => { setTab('google'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 6px',
              backgroundColor: tab === 'google' ? '#1f1a33' : 'transparent',
              border: tab === 'google' ? '1px solid #D4AF37' : 'none',
              borderRadius: '6px',
              color: tab === 'google' ? '#FFE699' : '#9ca3af',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⚡ Google ile Giriş
          </button>
          <button
            onClick={() => { setTab('anonymous'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 6px',
              backgroundColor: tab === 'anonymous' ? '#1f1a33' : 'transparent',
              border: tab === 'anonymous' ? '1px solid #D4AF37' : 'none',
              borderRadius: '6px',
              color: tab === 'anonymous' ? '#FFE699' : '#9ca3af',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🎭 %100 Anonim Mahlas
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            padding: '10px',
            color: '#fca5a5',
            fontSize: '12px',
            marginBottom: '18px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* 1. GOOGLE ILE GIRIS SEKMESI */}
        {tab === 'google' ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '22px' }}>
              Şifre hatırlama derdi olmadan tek tıkla Kozmik Pasaportunu bağla ve tüm test sonuçlarını güvenceye al.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.15)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {isLoading ? 'Bağlanıyor...' : 'Google ile Devam Et'}
            </button>
          </div>
        ) : (
          /* 2. ANONIM MAHLAS SEKMESI */
          <form onSubmit={handleAnonymousAuth}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
                Kozmik Mahlas (Kullanıcı Adı)
              </label>
              <input
                type="text"
                placeholder="örn: yolcu482"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#0a0912',
                  border: '1px solid #3d3558',
                  color: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
                Gizli Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#0a0912',
                  border: '1px solid #3d3558',
                  color: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #FFE699 0%, #D4AF37 100%)',
                color: '#07060c',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                marginBottom: '15px'
              }}
            >
              {isLoading ? 'İşleniyor...' : (isRegister ? '✦ Anonim Pasaportumu Oluştur' : '✦ Anonim Giriş Yap')}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '12px',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {isRegister ? 'Zaten bir mahlasın var mı? Giriş Yap' : 'Henüz mahlasın yok mu? Hemen Kayıt Ol'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
