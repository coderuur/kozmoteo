# 🌌 Kozmo-Teo: Bilinçaltı İnanç Eşleştirme & Anonim Teolojik Ağ

<p align="center">
  <a href="https://kozmoteo.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Canlı%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel Canlı Demo" />
  </a>
  <a href="https://kozmoteo.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Canlı%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify Canlı Demo" />
  </a>
  <a href="https://github.com/coderuur/kozmoteo" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github" alt="GitHub Repo" />
  </a>
</p>

<p align="center">
  🚀 <strong>Vercel Canlı Dağıtım:</strong> <a href="https://kozmoteo.vercel.app">https://kozmoteo.vercel.app</a><br />
  ⚡ <strong>Netlify Canlı Dağıtım:</strong> <a href="https://kozmoteo.netlify.app">https://kozmoteo.netlify.app</a>
</p>

<p align="center">
  <strong>Kozmo-Teo</strong>, bireylerin bilinçaltındaki teolojik, ontolojik ve ahlaki eğilimlerini 5 temel boyutta analiz eden, 30 farklı felsefi ve düşünsel akımla matematiksel benzerliklerini hesaplayan ve benzer ya da zıt frekanstaki insanları ses doğrulamalı <strong>Anonim Teolojik Ağ</strong> üzerinde buluşturan tam kapsamlı bir web platformudur.
</p>

---

## ✨ Temel Özellikler

- **150 Soruluk Genişletilmiş Soru Havuzu:**
  - 5 ana boyut: *Tektanrıcılık, Ritüelizm, Ölüm Sonrası, Dogma/Kutsal Metin, Doğa Bütünlüğü*.
  - 10 derin ontolojik ikilem senaryosu.
  - **Fisher-Yates** karıştırma algoritması sayesinde 100 soruluk testte dahi **sıfır tekrar** garantisi.
- **5 Boyutlu Vektör & İnteraktif Radar Grafiği:**
  - Kullanıcının felsefi profilini hesaplar; ideal inanç profili ve geçmiş profiliyle SVG radar grafiğinde üst üste bindirerek görselleştirir.
- **🎙️ Sesli Canlılık & Frekans Doğrulaması (Voice Liveness Test):**
  - Web Audio API ile mikrofon kaydı alır.
  - Backend spektral analiz ve otokorelasyon ile temel insan ses frekansını (Hz) ölçerek botları ve sahte profilleri engeller.
- **💬 Gerçek Zamanlı Anonim Sohbet Odası (WebSockets):**
  - Kullanıcılar niyet (arkadaşlık/flört) ve yönelim belirterek eşleşir.
  - WebSocket tabanlı anlık mesajlaşma. Eşleşilen arketip, kullanıcının mesajlarına Stoacılık, Taoizm, Sufizm gibi kadim felsefelerden ilhamla derin yanıtlar verir.
  - Çift taraflı *"Anonimliği Kaldır"* mekanizması.
- **🧠 Kesintisiz Yapay Zeka Kozmik Okuması:**
  - Gemini 1.5 Flash desteği veya API anahtarı olmadan da kullanıcının 5D vektörüne göre çalışan derinlikli yerleşik felsefi sentez motoru.
- **📸 Hikayede Paylaş (Instagram/TikTok Story Kartı):**
  - HTML5 Canvas ile **1080x1920** dikey çözünürlükte, altın çerçeveli, yıldız efektli ve felsefi alıntılı kart oluşturur; Web Share API veya PNG olarak indirir.
- **🔊 432 Hz / 528 Hz Mistik Web Audio Sentezleyici:**
  - Test bitiminde ve eşleşmelerde göksel Tibet çanı akorları çalar (ses aç/kapa destekli).
- **∞ İkili Arkadaşlık Kodu:**
  - 10 haneli benzersiz sayısal kodla iki arkadaş aralarındaki teolojik uyumu ve çatışma noktalarını ölçebilir.

---

## 🛠️ Teknoloji Yığını

### Frontend
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Stil & Tasarım:** Responsive Dark/Gold Mistik Tema
- **Grafik & Ses:** HTML5 Canvas API, SVG Radar Grafiği, Web Audio API, MediaRecorder API
- **İletişim:** Native WebSockets + REST API Client

### Backend
- **Framework:** FastAPI, Uvicorn (ASGI)
- **Veritabanı:** SQLAlchemy ORM (SQLite yerel / PostgreSQL canlı uyumlu)
- **Sinyal & Ses İşleme:** NumPy, Librosa, Wave
- **Gerçek Zamanlı Ağ:** Native WebSockets Connection Manager
- **Yapay Zeka:** Google Gemini API Entegrasyonu + Hibrit Yerleşik Analiz Motoru

---

## 📂 Proje Dizin Yapısı

```text
PROJELER/
├── arayuz/                  # Next.js Frontend Uygulaması
│   ├── src/
│   │   ├── app/             # App Router (layout.tsx, page.tsx, globals.css)
│   │   ├── components/      # Modüler React Bileşenleri
│   │   │   ├── RadarChart.tsx
│   │   │   ├── ArchetypeModal.tsx
│   │   │   ├── BeliefDetailModal.tsx
│   │   │   ├── VoiceVerification.tsx
│   │   │   └── ChatRoom.tsx
│   │   └── lib/             # Yardımcı Fonksiyonlar & Tip Tanımları
│   │       ├── api.ts       # Dinamik API & WebSocket URL Yöneticisi
│   │       ├── audio.ts     # Web Audio Sentezleyici
│   │       ├── canvas.ts    # 1080x1920 Story PNG Oluşturucu
│   │       ├── dictionary.tsx # Teoloji Sözlüğü & Tooltip Motoru
│   │       ├── questions.ts # 150 Soruluk Havuz & Fisher-Yates Algoritması
│   │       └── types.ts     # TypeScript Arayüzleri
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/                 # FastAPI Backend Uygulaması
│   ├── main.py              # API Endpoint'leri & WebSocket Yöneticisi
│   ├── database.py          # PostgreSQL / SQLite Veritabanı Bağlantısı
│   ├── models.py            # SQLAlchemy Veritabanı Modelleri
│   ├── security.py          # Ses Frekansı (Hz) & Biyometrik Analiz
│   ├── matching.py          # Vektör Eşleştirme Motoru
│   ├── requirements.txt     # Python Paket Bağımlılıkları
│   └── .env.example
│
├── KOZMO_TEO_BASLAT.bat     # Tek Tıkla Her İki Servisi Birden Başlatıcı
├── baslat_backend.bat       # Sadece Backend Başlatıcı
├── baslat_arayuz.bat        # Sadece Frontend Başlatıcı
├── .gitignore               # Kapsamlı Git Yoksayma Listesi
└── README.md
```

---

## 🚀 Yerel Kurulum ve Çalıştırma

### 1. Ön Koşullar
- **Node.js** (v18+) ve **npm**
- **Python** (3.11+)

### 2. Kolay Başlatma (Windows)
Proje kök dizinindeki **`KOZMO_TEO_BASLAT.bat`** dosyasına çift tıklayarak her iki servisi birden başlatabilir ve tarayıcıda `http://localhost:3000` adresini otomatik açabilirsiniz.

### 3. Manuel Başlatma

#### Backend'i Başlatma:
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend `http://127.0.0.1:8000` adresinde çalışacak, Swagger dokümantasyonuna `http://127.0.0.1:8000/docs` üzerinden erişilebilir.

#### Frontend'i Başlatma:
```bash
cd arayuz
npm install
npm run dev
```
Arayüz `http://localhost:3000` adresinde açılacaktır.

---

## ⚙️ Ortam Değişkenleri (.env)

### Frontend (`arayuz/.env`)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Backend (`backend/.env`)
```env
DATABASE_URL=sqlite:///./inanc_app.db
# Canlı PostgreSQL için: postgresql://kullanici:sifre@host:5432/veritabani

GEMINI_API_KEY=AIzaSy_KENDI_ANAHTARINIZ
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 🌐 Canlıya Alma (Production Deployment)

1. **Frontend (Vercel / Netlify):**
   - GitHub deposunu Vercel'e bağlayın.
   - Root directory olarak `arayuz` seçin.
   - `NEXT_PUBLIC_API_URL` ortam değişkenine yayındaki backend adresinizi girin (örn. `https://api.kozmoteo.com`).

2. **Backend (Render / Railway / Fly.io):**
   - Root directory olarak `backend` seçin.
   - Başlatma komutu: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - `DATABASE_URL` (Supabase PostgreSQL bağlantısı) ve `ALLOWED_ORIGINS` değişkenlerini tanımlayın.

3. **Veritabanı (Supabase / Neon PostgreSQL):**
   - Ücretsiz PostgreSQL veritabanı oluşturun ve bağlantı dizesini backend `DATABASE_URL` değişkenine yapıştırın.

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
