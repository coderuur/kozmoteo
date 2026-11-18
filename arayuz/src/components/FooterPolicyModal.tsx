'use client';

import React from 'react';

interface FooterPolicyModalProps {
  onClose: () => void;
}

export const FooterPolicyModal: React.FC<FooterPolicyModalProps> = ({ onClose }) => {
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
        maxWidth: '520px',
        maxHeight: '85vh',
        backgroundColor: '#110f1c',
        border: '1px solid #D4AF37',
        borderRadius: '16px',
        padding: '30px 25px',
        boxShadow: '0 0 50px rgba(212, 175, 55, 0.25)',
        position: 'relative',
        overflowY: 'auto'
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

        <h3 style={{
          textAlign: 'center',
          color: '#FFE699',
          fontFamily: 'Georgia, serif',
          fontSize: '20px',
          margin: '0 0 20px 0',
          letterSpacing: '1px'
        }}>
          ✦ GİZLİLİK & FELSEFİ GÜVENLİK İLKELERİ ✦
        </h3>

        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <strong style={{ color: '#FFE699', display: 'block', marginBottom: '4px' }}>
              1. Sesli Canlılık Doğrulaması & Geçicilik
            </strong>
            <p style={{ margin: 0 }}>
              Kozmo-Teo Anonim Ağı'nda yapılan ses frekansı analizi yalnızca botları engellemek ve temel ses rezonansınızı tespit etmek amacıyla kullanılır. Mikrofon kayıtları sunucularda <strong>asla kalıcı olarak saklanmaz</strong>; spektral frekans analizi tamamlandığı salisede tamamen silinir.
            </p>
          </div>

          <div>
            <strong style={{ color: '#FFE699', display: 'block', marginBottom: '4px' }}>
              2. Kutsal Anonimlik İlkesi
            </strong>
            <p style={{ margin: 0 }}>
              Anonim Teolojik Ağ üzerinde gerçekleştirdiğiniz sohbetler uçtan uca gizlilik prensibine dayanır. Karşılıklı olarak her iki taraf da "Anonimliği Kaldır" butonuna basıp onay vermedikçe gerçek kimlikler ve iletişim bilgileri asla ifşa edilmez.
            </p>
          </div>

          <div>
            <strong style={{ color: '#FFE699', display: 'block', marginBottom: '4px' }}>
              3. Parola & Veri Koruması
            </strong>
            <p style={{ margin: 0 }}>
              Kozmik Pasaport parolalarınız PBKDF2-SHA256 kriptografik tuzlama (salting) algoritmasıyla şifrelenir. Google ile giriş yapan kullanıcıların kişisel parolalarına veya e-posta hesaplarına sistem tarafından asla erişilemez.
            </p>
          </div>

          <div>
            <strong style={{ color: '#FFE699', display: 'block', marginBottom: '4px' }}>
              4. Çerezler & Yerel Hafıza
            </strong>
            <p style={{ margin: 0 }}>
              Sitemiz üçüncü taraf reklam takipçisi çerezleri kullanmaz. Tarayıcınızın yerel depolama alanı (localStorage) yalnızca yarıda kalan testlerinizi kaybetmemeniz ve oturumunuzu açık tutmanız amacıyla kullanılır.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #2d2645', paddingTop: '15px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#D4AF37',
              color: '#07060c',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
