from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import shutil
import os
import uuid
import random
import html
import json
import time
from datetime import datetime

# Deprecation uyarısını önleyen korumalı import
try:
    import google.generativeai as genai
except ImportError:
    genai = None

from database import SessionLocal, engine, get_db
import models, security, matching

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kozmo-Teo API",
    description="Bilinçaltı İnanç Eşleştirme ve Anonim Teolojik Ağ Motoru",
    version="1.0.0"
)

# CORS Yapılandırması (Üretim ve Geliştirme Uyumlu)
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
if allowed_origins_env == "*":
    origins = ["*"]
else:
    origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSy_BURAYA_KENDI_UZUN_ANAHTARINI_YAPISTIR")
if genai and GEMINI_API_KEY and not GEMINI_API_KEY.startswith("AIzaSy_BURAYA"):
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception:
        pass

# WEBSOCKET BAĞLANTI YÖNETİCİSİ (Gerçek Zamanlı Sohbet)
class ConnectionManager:
    def __init__(self):
        self.active_rooms: dict[str, list[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.active_rooms:
            self.active_rooms[session_id] = []
        self.active_rooms[session_id].append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket):
        if session_id in self.active_rooms:
            if websocket in self.active_rooms[session_id]:
                self.active_rooms[session_id].remove(websocket)
            if not self.active_rooms[session_id]:
                del self.active_rooms[session_id]

    async def broadcast(self, session_id: str, data: dict):
        if session_id in self.active_rooms:
            for connection in self.active_rooms[session_id]:
                try:
                    await connection.send_text(json.dumps(data))
                except Exception:
                    pass

manager = ConnectionManager()

# GERÇEK KULLANICI BEKLEME ODASI (Matchmaking Queue)
MATCHMAKING_QUEUE: list[dict] = []

class VectorInput(BaseModel):
    user_vector: list[float]
    test_type: str

class BeliefScore(BaseModel):
    name: str
    percentage: float

class MatchResult(BaseModel):
    similarity_percentage: float
    belief_name: str
    description: str
    belief_base_vector: list[float]
    secondary_matches: list[BeliefScore]
    details: str
    figures: list[str]
    quotes: list[str]
    daily_reflection: str
    archetype: str

class AIRequest(BaseModel):
    archetype: str
    similarity: float
    vector: list[float]

class AnonymousMatchRequest(BaseModel):
    username: str = "Anonim Yolcu"
    gender: str = "male"
    target_gender: str = "any"
    intent: str = "friend"
    preference: str = "similar"
    vector: list[float]

class SendMessageRequest(BaseModel):
    session_id: str
    sender_name: str
    text: str

MOCK_RELIGIONS = {
    "İslam / Geleneksel Tektanrıcılık": {
        "base_vector": [0.9, 0.9, 0.9, 0.9, 0.2], 
        "desc": "Evrenin tek yaratıcısına ve ilahi kurallara mutlak teslimiyet.",
        "details": "İslam, Tevhid inancını merkeze alan semavi bir dindir. İnsanın temel amacının yaratıcıyı tanımak ve ona ibadet etmek olduğunu savunur.",
        "figures": ["Hz. Muhammed (sav)", "Mevlânâ Celâleddîn-i Rûmî", "İmam Gazzâlî"],
        "quotes": ["O, göklerin ve yerin eşsiz yaratıcısıdır."],
        "daily_reflection": "Bugün karşılaştığın bir zorlukta, bunun daha büyük bir ilahi planın parçası olduğunu düşünerek içsel bir sabır (tevekkül) göstermeyi dene.",
        "archetype": "GELENEK MUHAFIZI"
    },
    "Hristiyanlık / İnayet ve Kurtuluş": {
        "base_vector": [0.9, 0.8, 0.9, 0.9, 0.3], 
        "desc": "Tanrı'nın sevgisine, İsa'nın kurtarıcılığına ve ruhsal arınmaya inanç.",
        "details": "Hristiyanlık, Tanrı'nın insanlığa olan sevgisini İsa Mesih aracılığıyla gösterdiğine inanır.",
        "figures": ["İsa Mesih", "Havari Pavlus"],
        "quotes": ["Yol, gerçek ve yaşam benim."],
        "daily_reflection": "Bugün sana haksızlık ettiğini düşündüğün birini koşulsuzca affetmeyi dene.",
        "archetype": "MERHAMET ELÇİSİ"
    },
    "Musevilik / Ahit ve Gelenek": {
        "base_vector": [1.0, 0.9, 0.7, 0.9, 0.1], 
        "desc": "Tek Tanrı ile yapılan kutsal anlaşmaya ve yasalara (Tora) sıkı bağlılık.",
        "details": "Musevilik, Tanrı'nın kurallarına yeryüzünde harfiyen uymayı merkeze alır.",
        "figures": ["Hz. Musa", "Maimonides"],
        "quotes": ["Tanrın Rab'bi bütün yüreğinle, bütün canınla seveceksin."],
        "daily_reflection": "Bugün sıradan gördüğün bir rutini kutsal bir ritüelmiş gibi saygıyla yap.",
        "archetype": "KADİM YASA KORUYUCU"
    },
    "Budizm / İçsel Uyanış": {
        "base_vector": [0.1, 0.8, 0.8, 0.4, 0.6], 
        "desc": "Acıdan kurtuluş (Nirvana) ve Karma yasasına odaklanan meditasyon yolu.",
        "details": "Hayatın acı dolu olduğunu, kaynağının arzularımız olduğunu ve bunların yok edilmesiyle Nirvana'ya ulaşılacağını savunur.",
        "figures": ["Siddhartha Gautama (Buda)", "Dalai Lama"],
        "quotes": ["Zihnimiz her şeydir. Ne düşünürsek o oluruz."],
        "daily_reflection": "Bugün bir eylemi gerçekleştirirken sadece o an'a odaklan.",
        "archetype": "İÇSEL GEZGİN"
    },
    "Hinduizm / Evrensel Döngü": {
        "base_vector": [0.6, 0.9, 0.9, 0.8, 0.7], 
        "desc": "Karma, reenkarnasyon ve çoklu ilahi tezahürlere inanan kadim yol.",
        "details": "Yaşamın amacı, reenkarnasyon döngüsünden kurtulup özgürleşmektir.",
        "figures": ["Krişna", "Patanjali"],
        "quotes": ["Gerçek tektir, bilgeler onu farklı isimlerle anar."],
        "daily_reflection": "Bugün yaptığın bir işin sonucunda hiçbir teşekkür beklememeyi pratik et.",
        "archetype": "DÖNGÜNÜN BİLGESİ"
    },
    "Taoizm / Akış ve Uyum": {
        "base_vector": [0.1, 0.5, 0.4, 0.5, 0.9], 
        "desc": "Evrenin doğal akışına (Tao) direnmeden, zıtlıkların uyumuyla yaşamak.",
        "details": "Çabasız eylem (Wu Wei) felsefesini benimser. Su gibi esnek olmayı savunur.",
        "figures": ["Laozi", "Zhuangzi"],
        "quotes": ["Su gibi ol; hiçbir şeyle çatışmaz ama her şeyi aşındırır."],
        "daily_reflection": "İşler planladığın gibi gitmezse direnme; durumu olduğu gibi kabul et.",
        "archetype": "AKIŞIN USTASI"
    },
    "Şamanizm / Doğa Ruhları": {
        "base_vector": [0.5, 0.8, 0.7, 0.1, 1.0], 
        "desc": "Gök Tanrı'ya, ataların ruhlarına ve doğadaki her nesnenin canlı bir enerjisi olduğuna inanç.",
        "details": "Doğadaki her varlığın bir ruhu olduğuna inanan kadim doğa inancıdır.",
        "figures": ["Kamlar", "Oğuz Kağan"],
        "quotes": ["Doğanın fısıltısını duymayan, evrenin çığlığını anlamaz."],
        "daily_reflection": "Bir ağaca veya gökyüzüne bakarken onun da bir ruhu olduğunu hisset.",
        "archetype": "KADİM ŞAMAN"
    },
    "Zerdüştlük / Işık ve Karanlık": {
        "base_vector": [0.8, 0.9, 0.8, 0.7, 0.4], 
        "desc": "İyilik ile kötülük arasındaki kozmik savaşa inanç.",
        "details": "Karanlığa karşı ışığın (iyiliğin) yanında savaşmak gerektiğini savunur.",
        "figures": ["Zerdüşt"],
        "quotes": ["İyi düşün, iyi söyle, iyi yap."],
        "daily_reflection": "Kendi içindeki karanlık bir düşünceyi fark et ve iyi eylemle onu aydınlığa çevir.",
        "archetype": "IŞIĞIN SAVAŞÇISI"
    },
    "Deizm / Akılcı Yaratılış": {
        "base_vector": [0.9, 0.1, 0.4, 0.1, 0.1], 
        "desc": "Evreni kuran ancak sonrasına müdahale etmeyen bir Tanrı anlayışı.",
        "details": "Tanrı doğa yasalarını kendi haline bırakmıştır. Tanrı'yı anlamanın yolu bilimdir.",
        "figures": ["Thomas Paine", "Voltaire"],
        "quotes": ["Tanrı'yı aramak için kitaplara değil, evrenin muazzam matematiğine bakmalısın."],
        "daily_reflection": "Bugün doğaya bakıp, evrenin arkasındaki matematiksel düzeni düşün.",
        "archetype": "AKILCI MİMAR"
    },
    "Panteizm / Kozmik Birlik": {
        "base_vector": [0.8, 0.3, 0.5, 0.1, 1.0], 
        "desc": "Evrenin, doğanın ve yaratıcının tek ve aynı şey olduğuna inanan felsefe.",
        "details": "Var olan her şey, evrenin bütünü ve doğa Tanrı'nın ta kendisidir.",
        "figures": ["Baruch Spinoza", "Albert Einstein"],
        "quotes": ["Doğaüstü bir tanrıya değil, Spinoza'nın tanrısına inanıyorum."],
        "daily_reflection": "Gördüğün her canlının seninle aynı evrensel bütünün bir parçası olduğunu hisset.",
        "archetype": "KOZMİK RUH"
    },
    "Stoacılık / Rasyonel İrade": {
        "base_vector": [0.4, 0.1, 0.2, 0.1, 0.6], 
        "desc": "Kontrol edemediğin olaylara karşı kayıtsızlık ve evrenin yasalarına boyun eğme.",
        "details": "Kontrol edemediğimiz şeyler için endişelenmeyi bırakmayı öğütler.",
        "figures": ["Marcus Aurelius", "Epiktetos"],
        "quotes": ["Seni olaylar değil, olaylara bakış açın rahatsız eder."],
        "daily_reflection": "Seni sinirlendiren bir olay olduğunda, kontrolünde olup olmadığını sorgula.",
        "archetype": "SARSILMAZ İRADE"
    },
    "Seküler Hümanizm": {
        "base_vector": [0.1, 0.1, 0.1, 0.1, 0.1], 
        "desc": "Doğaüstü inançlar yerine insan aklına, bilime ve dünyevi etiğe odaklanma.",
        "details": "Ahlaklı olmak için cennet ödülüne gerek yoktur; empati ahlakın temelidir.",
        "figures": ["Carl Sagan", "Richard Dawkins"],
        "quotes": ["Bizler, evrenin kendini bilmesinin bir yoluyuz."],
        "daily_reflection": "Sadece insanlık onurunu gözeterek, ilahi bir ödül beklemeden yardım et.",
        "archetype": "DÜNYEVİ AYDIN"
    },
    "Gnostisizm / Gizli Bilgi": {
        "base_vector": [0.7, 0.7, 0.8, 0.5, 0.2], 
        "desc": "Maddi dünyanın kusurlu olduğuna ve kurtuluşun 'gizli bilgi' ile olacağına inanç.",
        "details": "Bu fiziksel dünya bir hapishanedir, gerçek kurtuluş ruhsal aydınlanmadır.",
        "figures": ["Valentinus", "Mani"],
        "quotes": ["Dünya bir hapishanedir, ancak içindeki ışık hürdür."],
        "daily_reflection": "Fiziksel hazların geçici birer illüzyon olduğunu hatırla.",
        "archetype": "GİZEMLİ BİLGE"
    },
    "Nihilizm / Kozmik Boşluk": {
        "base_vector": [0.0, 0.0, 0.0, 0.0, 0.0], 
        "desc": "Evrenin objektif bir anlamı, amacı veya ahlaki bir temeli olmadığını savunan felsefe.",
        "details": "Hiçbir inancın mutlak bir temeli yoktur. İnsanlık evrensel ölçekte anlamsızdır.",
        "figures": ["Friedrich Nietzsche", "Emil Cioran"],
        "quotes": ["Eğer çok uzun süre bir uçuruma bakarsan, uçurum da senin içine bakar."],
        "daily_reflection": "Büyük dert ettiğin her şeyin evrensel ölçekte ne kadar anlamsız olduğunu düşün.",
        "archetype": "HİÇLİK YOLCUSU"
    },
    "Absürdizm / Başkaldırı": {
        "base_vector": [0.1, 0.1, 0.1, 0.1, 0.2], 
        "desc": "Evrenin anlamsızlığına rağmen yaşama sevinciyle isyan etme felsefesi.",
        "details": "Nihilizmin aksine, intiharı değil; bu anlamsızlığa rağmen hayatı tutkuyla yaşamayı savunur.",
        "figures": ["Albert Camus"],
        "quotes": ["Hayatın bir anlamı olmadığı gerçeğiyle yüzleşmek, onun yaşamaya değmeyeceği anlamına gelmez."],
        "daily_reflection": "Hayatın anlamsız olduğunu bilsen bile, sırf inat olsun diye gökyüzüne gülümse.",
        "archetype": "ABSÜRT İSYANKAR"
    },
    "Transhümanizm": {
        "base_vector": [0.1, 0.2, 0.4, 0.1, 0.1], 
        "desc": "İnsanlığın bilim ve teknoloji yoluyla sınırlarını aşması gerektiğine inanç.",
        "details": "Teknoloji aracılığıyla kendi cennetimizi yaratabileceğimizi savunur.",
        "figures": ["Ray Kurzweil", "Yuval Noah Harari"],
        "quotes": ["Ölüm teknik bir problemdir ve mühendisler bunu çözecektir."],
        "daily_reflection": "Bedeninin kırılgan sınırlarını düşün ve insan zekasının gücünü hayal et.",
        "archetype": "TEKNO-MİMAR"
    },
    "LaVeyan Satanizm": {
        "base_vector": [0.1, 0.6, 0.1, 0.4, 0.1], 
        "desc": "İnsanın kendi egosuna, hazlarına ve gücüne odaklanan akım.",
        "details": "Dogmatik dinlerin bastırdığı insan doğasını yücelten felsefedir.",
        "figures": ["Anton Szandor LaVey"],
        "quotes": ["Kendinin tanrısı ol."],
        "daily_reflection": "Başkalarını memnun etmek yerine, sadece kendi başarılarına odaklan.",
        "archetype": "BİREYSEL ASİ"
    },
    "Neo-Paganizm (Wicca)": {
        "base_vector": [0.4, 0.9, 0.6, 0.2, 1.0], 
        "desc": "Doğanın döngülerini kutsayan, maji (büyü) ve ritüelleri merkeze alan inanç.",
        "details": "Karanlık ve aydınlığın, eril ve dişilin dengesine inanan sistemdir.",
        "figures": ["Gerald Gardner"],
        "quotes": ["Kimseye zarar vermediğin sürece, ne istersen onu yap."],
        "daily_reflection": "Doğanın enerjisini bedenine çekmeyi amaçlayan bir odaklanma ritüeli yap.",
        "archetype": "DOĞANIN BÜYÜCÜSÜ"
    },
    "Agnostisizm": {
        "base_vector": [0.3, 0.1, 0.3, 0.1, 0.3], 
        "desc": "Tanrının veya doğaüstü varlıkların insan aklıyla bilinemeyeceği görüşü.",
        "details": "İnanmak ya da inkar etmek yerine 'bilmiyorum' demeyi erdem sayar.",
        "figures": ["Thomas Huxley", "Bertrand Russell"],
        "quotes": ["Bilinmeyen bir şey hakkında kesin hüküm vermek entelektüel günahtır."],
        "daily_reflection": "Bugün kesin doğru sandığın bir inancını 'Belki de bilemem' diyerek askıya al.",
        "archetype": "ŞÜPHECİ GÖZLEMCİ"
    },
    "Sufizm / Evrensel Mistisizm": {
        "base_vector": [0.9, 0.6, 0.8, 0.4, 0.9], 
        "desc": "Yaratıcı ile mutlak bir aşk ve vecde dayalı içsel birleşme yolu.",
        "details": "Dinin kurallarından çok iç anlamına odaklanan, ilahi aşkta erimeyi hedefleyen yoldur.",
        "figures": ["Hallac-ı Mansur", "Şems-i Tebrizi"],
        "quotes": ["Ben hakikatim. (Ene'l-Hakk)"],
        "daily_reflection": "Etrafındaki her şeyin aslında tek bir ilahi güzelliğin yansıması olduğunu gör.",
        "archetype": "AŞKIN DERVİŞ"
    }
}

COSMIC_TRAVELERS = [
    {
        "name": "Kozmik Yolcu #482",
        "archetype": "AKIŞIN USTASI",
        "gender": "male",
        "vector": [0.2, 0.5, 0.4, 0.4, 0.9],
        "greeting": "Selam olsun yolcu. Kozmosun sessizliğinde senin frekansınla karşılaştım. Su gibi berrak bir sohbet dilerim."
    },
    {
        "name": "Yıldız Tozu #109",
        "archetype": "SARSILMAZ İRADE",
        "gender": "female",
        "vector": [0.4, 0.2, 0.3, 0.2, 0.6],
        "greeting": "Merhaba. Evrenin gürültüsünden uzakta, rasyonel bir bilinçle buluşmak güzel. Zihnini en çok ne meşgul ediyor?"
    },
    {
        "name": "Mistik Ruh #771",
        "archetype": "AŞKIN DERVİŞ",
        "gender": "female",
        "vector": [0.9, 0.6, 0.8, 0.4, 0.8],
        "greeting": "Gönül kapısını aralayan bir ses duydum. Aynı hakikatin farklı damlalarıyız. Hoş geldin kozmik dostum."
    },
    {
        "name": "Gökyüzü Gezgini #334",
        "archetype": "KOZMİK RUH",
        "gender": "male",
        "vector": [0.7, 0.3, 0.5, 0.2, 0.9],
        "greeting": "Merhaba. Ağaçların ve yıldızların diliyle konuşan bir ruh arıyordum. Enerjin çok tanıdık geldi."
    },
    {
        "name": "Şüpheci Yolcu #612",
        "archetype": "ŞÜPHECİ GÖZLEMCİ",
        "gender": "male",
        "vector": [0.3, 0.2, 0.2, 0.1, 0.4],
        "greeting": "Selamlar. Mutlak dogmaları bir kenara bırakıp varoluşu dürüstçe sorgulayan biriyle karşılaşmak tazeleyici. Nasılsın?"
    },
    {
        "name": "Işık Yolcusu #205",
        "archetype": "IŞIĞIN SAVAŞÇISI",
        "gender": "female",
        "vector": [0.8, 0.8, 0.7, 0.6, 0.5],
        "greeting": "Selam olsun! Karanlığa inat iyi düşünce ve samimiyetle parlayan bir kalple buluşmak sevindirici. Hangi düşüncelerdesin?"
    }
]

def extend_vector(base_vector: list[float], target_length: int) -> list[float]:
    if not base_vector:
        return [0.5] * target_length
    num_cats = len(base_vector)
    chunk_size = target_length // num_cats
    remainder = target_length % num_cats
    extended = []
    for i, val in enumerate(base_vector):
        count = chunk_size + (1 if i < remainder else 0)
        extended.extend([val] * count)
    return extended

def calculate_true_similarity(v1: list[float], v2: list[float]) -> float:
    if not v1 or not v2: return 0.0
    diffs = [abs(a - b) for a, b in zip(v1, v2)]
    mae = sum(diffs) / len(diffs)
    return float(1.0 - mae)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Kozmo-Teo API", "timestamp": time.time()}

@app.post("/api/match/religion", response_model=MatchResult)
def match_with_religion(data: VectorInput):
    target_len = len(data.user_vector)
    scores = []

    for name, rel_data in MOCK_RELIGIONS.items():
        target_vector = extend_vector(rel_data["base_vector"], target_len)
        score = calculate_true_similarity(data.user_vector, target_vector)
        percentage = round(max(0.0, score) * 100, 2)
        scores.append({"name": name, "percentage": percentage, "data": rel_data})

    scores.sort(key=lambda x: x["percentage"], reverse=True)
    top_match = scores[0]
    secondary_matches = [{"name": s["name"], "percentage": s["percentage"]} for s in scores[1:11]]

    return MatchResult(
        similarity_percentage=top_match["percentage"],
        belief_name=top_match["name"],
        description=top_match["data"].get("desc", ""),
        belief_base_vector=top_match["data"].get("base_vector", []),
        secondary_matches=secondary_matches,
        details=top_match["data"].get("details", ""),
        figures=top_match["data"].get("figures", []),
        quotes=top_match["data"].get("quotes", []),
        daily_reflection=top_match["data"].get("daily_reflection", ""),
        archetype=top_match["data"].get("archetype", "KAYIP RUH")
    )

@app.post("/api/verify-and-register")
async def verify_user(
    username: str = Form("Anonim"),
    gender: str = Form("male"),
    vector: str = Form("[]"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    os.makedirs("uploads", exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1] or ".wav"
    temp_path = f"uploads/{uuid.uuid4().hex}{file_ext}"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = security.verify_voice_identity(temp_path, gender)
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

    if not result["valid"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Ses doğrulaması başarısız: {result['message']}"
        )

    clean_username = html.escape(username.strip()[:30])
    new_user = models.User(
        username=clean_username,
        gender=gender,
        belief_vector=vector,
        is_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": "success",
        "user_id": new_user.id,
        "pitch_hz": result["pitch_hz"],
        "detected_gender": result["detected_gender"],
        "message": result["message"]
    }

@app.post("/api/match/anonymous")
def match_anonymous(req: AnonymousMatchRequest, db: Session = Depends(get_db)):
    clean_username = html.escape(req.username.strip()[:30]) or "Anonim Yolcu"
    
    # Vektörü 5D'ye sıkıştır
    user_5d = req.vector
    if len(user_5d) > 5:
        chunk = len(user_5d) // 5
        user_5d = [sum(user_5d[i*chunk:(i+1)*chunk]) / chunk for i in range(5)]
    elif len(user_5d) < 5:
        user_5d = [0.5, 0.5, 0.5, 0.5, 0.5]

    # 1. Bekleme kuyruğundaki gerçek kullanıcıları kontrol et (P2P Eşleşme)
    now = time.time()
    # 2 dakikadan eski bekleyenleri temizle
    global MATCHMAKING_QUEUE
    MATCHMAKING_QUEUE = [q for q in MATCHMAKING_QUEUE if now - q["joined_at"] < 120]

    matched_real_user = None
    for idx, waiter in enumerate(MATCHMAKING_QUEUE):
        # Kendi isteği olmamalı
        if waiter.get("req_id") == clean_username:
            continue
        # Cinsiyet ve yönelim uyumu
        gender_ok = (req.target_gender == "any" or req.target_gender == waiter["gender"]) and \
                    (waiter["target_gender"] == "any" or waiter["target_gender"] == req.gender)
        intent_ok = req.intent == waiter["intent"]

        if gender_ok and intent_ok:
            matched_real_user = MATCHMAKING_QUEUE.pop(idx)
            break

    session_id = f"kozmo_{uuid.uuid4().hex[:10]}"

    if matched_real_user:
        # İki gerçek kullanıcı eşleştirildi!
        sim = calculate_true_similarity(user_5d, matched_real_user["vector"])
        final_score = min(99, max(40, round(sim * 100)))

        match_session = models.MatchSession(
            id=session_id,
            user1_name=clean_username,
            user2_name=matched_real_user["username"],
            user2_archetype="GERÇEK YOLCU",
            user2_gender=matched_real_user["gender"],
            compatibility=final_score,
            intent=req.intent,
            is_revealed=False,
            is_ai_companion=False
        )
        db.add(match_session)

        greeting = "✦ Birbirinize bağlandınız! İki gerçek kozmik zihin aynı anda odada."
        initial_msg = models.ChatMessage(
            session_id=session_id,
            sender="system",
            sender_name="Kozmik Ağ",
            text=greeting,
            timestamp=datetime.utcnow()
        )
        db.add(initial_msg)
        db.commit()

        return {
            "session_id": session_id,
            "partner_name": matched_real_user["username"],
            "partner_archetype": "GERÇEK YOLCU",
            "partner_gender": matched_real_user["gender"],
            "compatibility": final_score,
            "intent": req.intent,
            "greeting": greeting,
            "is_real_user": True
        }

    # 2. Kuyrukta gerçek kullanıcı yoksa, anında akıllı arketip yolcu ata
    candidates = list(COSMIC_TRAVELERS)
    if req.target_gender in ["male", "erkek"]:
        filtered = [c for c in candidates if c["gender"] == "male"]
        if filtered: candidates = filtered
    elif req.target_gender in ["female", "kadin", "kadın"]:
        filtered = [c for c in candidates if c["gender"] == "female"]
        if filtered: candidates = filtered

    scored_candidates = []
    for c in candidates:
        sim = calculate_true_similarity(user_5d, c["vector"])
        percentage = round(sim * 100)
        scored_candidates.append((percentage, c))

    if req.preference == "opposite":
        scored_candidates.sort(key=lambda x: x[0])
    else:
        scored_candidates.sort(key=lambda x: x[0], reverse=True)

    best_match_score, best_partner = scored_candidates[0]
    final_score = min(99, max(45, best_match_score + random.randint(-2, 2)))

    match_session = models.MatchSession(
        id=session_id,
        user1_name=clean_username,
        user2_name=best_partner["name"],
        user2_archetype=best_partner["archetype"],
        user2_gender=best_partner["gender"],
        compatibility=final_score,
        intent=req.intent,
        is_revealed=False,
        is_ai_companion=True
    )
    db.add(match_session)

    initial_msg = models.ChatMessage(
        session_id=session_id,
        sender="partner",
        sender_name=best_partner["name"],
        text=best_partner["greeting"],
        timestamp=datetime.utcnow()
    )
    db.add(initial_msg)
    db.commit()

    return {
        "session_id": session_id,
        "partner_name": best_partner["name"],
        "partner_archetype": best_partner["archetype"],
        "partner_gender": best_partner["gender"],
        "compatibility": final_score,
        "intent": req.intent,
        "greeting": best_partner["greeting"],
        "is_real_user": False
    }

@app.get("/api/chat/messages/{session_id}")
def get_chat_messages(session_id: str, db: Session = Depends(get_db)):
    msgs = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.id.asc()).all()
    session = db.query(models.MatchSession).filter(models.MatchSession.id == session_id).first()
    return {
        "messages": [
            {
                "id": m.id,
                "sender": m.sender,
                "sender_name": m.sender_name,
                "text": m.text,
                "time": m.timestamp.strftime("%H:%M")
            } for m in msgs
        ],
        "is_revealed": session.is_revealed if session else False,
        "reveal_requested_by": session.reveal_requested_by if session else None
    }

@app.post("/api/chat/send")
async def send_chat_message(req: SendMessageRequest, db: Session = Depends(get_db)):
    session = db.query(models.MatchSession).filter(models.MatchSession.id == req.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sohbet odası bulunamadı.")

    clean_text = html.escape(req.text.strip()[:500])
    clean_sender = html.escape(req.sender_name.strip()[:30]) or "Sen"

    user_msg = models.ChatMessage(
        session_id=req.session_id,
        sender="user",
        sender_name=clean_sender,
        text=clean_text,
        timestamp=datetime.utcnow()
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # WebSocket üzerinden odadaki herkese yayınla
    await manager.broadcast(req.session_id, {
        "type": "message",
        "id": user_msg.id,
        "sender": "user",
        "sender_name": clean_sender,
        "text": clean_text,
        "time": user_msg.timestamp.strftime("%H:%M")
    })

    partner_reply_text = None
    if session.is_ai_companion:
        arch = session.user2_archetype or "AKIŞIN USTASI"
        reply_templates = {
            "AKIŞIN USTASI": [
                "Söylediklerini dinlerken suyun akışını düşündüm. Direnmediğin zaman evren seninle hizalanıyor.",
                "Bu çok derin bir gözlem. Laozi'nin dediği gibi: 'Bilen konuşmaz, konuşan bilmez.' Ama hissettiğin şey tam bir uyum hali.",
                "Zihnindeki dalgalar durulduğunda gerçeğin dibi görünür derler. Seninle bu noktada çok benzeşiyoruz.",
                "Bazen sadece tanık olmak, bir sonuca varmaktan çok daha kıymetli. Varoluşun ritmini hissediyor musun?"
            ],
            "SARSILMAZ İRADE": [
                "Epiktetos tam olarak bundan bahsederdi: Dünyayı değiştiremezsin ama ona verdiğin tepki tamamen senin elinde.",
                "Duyguların fırtınasına kapılmadan rasyonel kalabilmek çok nadir bir erdem. Sende bu dinginliği görüyorum.",
                "İnsan zihnini kendi kalesi haline getirmeli. Söylediklerin bana içsel disiplinin gücünü hatırlattı.",
                "Hayatın belirsizlikleri karşısında sarsılmamak... En büyük özgürlük budur."
            ],
            "AŞKIN DERVİŞ": [
                "Ne güzel dile getirdin. Aşk bir köprüdür, senle alem arasındaki perdeyi kaldıran tek iksirdir.",
                "Gönül diliyle konuşan insanı bulmak çölde vaha gibidir. Kalbinin bu samimi arayışı beni çok etkiledi.",
                "Mevlana'nın dediği gibi: 'Dünle beraber gitti cancağızım, ne kadar söz varsa düne ait. Şimdi yeni şeyler söylemek lazım.'",
                "Her zerrede aynı ilahi nefesin titreştiğini hissettiğinde yalnızlık diye bir şey kalmıyor."
            ],
            "KOZMİK RUH": [
                "Bütün evren tek bir devasa canlı organizma. Senin bu cümlen de o büyük harmoninin bir notası gibi.",
                "Spinoza'nın bahsettiği doğanın kutsallığı tam olarak burada yatıyor. İnsan doğadan ayrı değil, onun ta kendisi.",
                "Yıldız tozu olduğumuzu hatırlatan düşünceler bunlar. Bedenimiz geçici ama atomlarımız milyarlarca yıldır burada.",
                "Doğanın sessizliğinde oturup evreni dinlemek bazen tüm felsefelerden daha çok şey öğretir."
            ],
            "ŞÜPHECİ GÖZLEMCİ": [
                "Bu çok keskin ve dürüst bir yaklaşım. Kesin doğruların arkasına saklanmaktansa açık uçlu kalmak cesaret ister.",
                "Russell'ın dediği gibi: 'Dünyanın sorunu, aptalların kendinden emin, zekilerin ise şüpheyle dolu olmasıdır.'",
                "Dogmalar zihni uyuşturur, samimi bir soru ise insanı diri tutar. Bu bakış açını çok takdir ettim.",
                "Cevaplardan çok sorduğumuz sorular bizi biz yapar. Seninle konuşmak zihnimi açıyor."
            ],
            "IŞIĞIN SAVAŞÇISI": [
                "Karanlığı lanetlemek yerine bir mum yakmak tam olarak senin yaptığın şey. Enerjin çok aydınlatıcı.",
                "Zerdüşt'ün iyi düşünce ve iyi niyet prensibi her devirde dünyayı kurtaran tek reçetedir.",
                "Etrafındaki tüm kaosa rağmen içindeki erdemi koruyabilmek gerçek bir kahramanlıktır.",
                "Birlikte düşündüğümüzde evrenin ışığını büyütüyoruz gibi hissediyorum."
            ]
        }

        choices = reply_templates.get(arch, reply_templates["AKIŞIN USTASI"])
        partner_reply_text = random.choice(choices)

        partner_msg = models.ChatMessage(
            session_id=req.session_id,
            sender="partner",
            sender_name=session.user2_name,
            text=partner_reply_text,
            timestamp=datetime.utcnow()
        )
        db.add(partner_msg)
        db.commit()
        db.refresh(partner_msg)

        # Karşı tarafın mesajını da WebSocket'e ilet
        await manager.broadcast(req.session_id, {
            "type": "message",
            "id": partner_msg.id,
            "sender": "partner",
            "sender_name": session.user2_name,
            "text": partner_reply_text,
            "time": partner_msg.timestamp.strftime("%H:%M")
        })

    return {
        "status": "sent",
        "reply": partner_reply_text
    }

@app.post("/api/chat/reveal/{session_id}")
async def reveal_identity(session_id: str, db: Session = Depends(get_db)):
    session = db.query(models.MatchSession).filter(models.MatchSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sohbet bulunamadı.")

    session.is_revealed = True
    system_msg = models.ChatMessage(
        session_id=session_id,
        sender="system",
        sender_name="Kozmik Sistem",
        text="✦ Anonimlik kaldırıldı! Karşılıklı felsefi profiller açığa çıktı.",
        timestamp=datetime.utcnow()
    )
    db.add(system_msg)
    db.commit()

    await manager.broadcast(session_id, {
        "type": "reveal",
        "partner_name": session.user2_name,
        "partner_archetype": session.user2_archetype,
        "compatibility": session.compatibility
    })

    return {
        "status": "revealed",
        "partner_name": session.user2_name,
        "partner_archetype": session.user2_archetype,
        "partner_gender": session.user2_gender,
        "compatibility": session.compatibility
    }

# WEBSOCKET ENDPOINT
@app.websocket("/ws/chat/{session_id}")
async def websocket_chat_endpoint(websocket: WebSocket, session_id: str, db: Session = Depends(get_db)):
    await manager.connect(session_id, websocket)
    try:
        while True:
            raw_data = await websocket.receive_text()
            try:
                data = json.loads(raw_data)
                text = data.get("text", "")
                sender_name = data.get("sender_name", "Anonim")
                if text.strip():
                    await send_chat_message(SendMessageRequest(
                        session_id=session_id,
                        sender_name=sender_name,
                        text=text
                    ), db)
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
    except Exception:
        manager.disconnect(session_id, websocket)

def generate_offline_ai_reading(archetype: str, similarity: float, vector: list[float]) -> str:
    tektanri = vector[0] if len(vector) > 0 else 0.5
    rituel = vector[1] if len(vector) > 1 else 0.5
    olum = vector[2] if len(vector) > 2 else 0.5
    dogma = vector[3] if len(vector) > 3 else 0.5
    doga = vector[4] if len(vector) > 4 else 0.5

    p1 = f"Zihninin kozmik haritasına baktığımda, %{similarity} oranında {archetype} arketipinin izlerini taşıyorsun. Sen varoluşu sıradan bir seyirci gibi değil, onun dokusunu sorgulayan bir yolcu gibi deneyimliyorsun. "
    if tektanri > 0.6:
        p1 += "Kainatın arkasında bilinçli, tek ve muazzam bir zekanın nabzını hissediyorsun; varoluş senin için tesadüflerin savurduğu bir yaprak değil, ilahi bir mimarinin nakışı."
    elif tektanri < 0.4:
        p1 += "Kişisel ve dogmatik bir tanrı figüründen ziyade, evrenin kendi iç dinamiğine, soğuk ve görkemli sessizliğine yaslanmayı daha dürüst buluyorsun."
    else:
        p1 += "Aklın şüpheyle kalbin sezgisi arasında hassas bir sarkaç gibi salınıyorsun; ne kör bir inanca teslim oluyor ne de gizemi tamamen inkar ediyorsun."

    p2 = "İç dünyandaki felsefi gerilim dikkat çekici. "
    if dogma < 0.4 and rituel > 0.6:
        p2 += "Dışarıdan dikte edilen katı kurallardan ve dogmalardan nefret ederken, kendi içsel ritüellerine, sessizlik anlarına ve tefekkür disiplinine derinden bağlısın. Şekilcilik değil, samimi deneyim senin pusulandır."
    elif dogma > 0.6:
        p2 += "Kadim köklerin, nesiller boyu sınanmış mutlak ilkelerin ve sarsılmaz prensiplerin insanı anlamsızlık kaosundan koruyan yegane kale olduğuna inanıyorsun."
    else:
        p2 += "Kendi ahlak pusulanı kendi vicdanında eğitiyorsun; başkalarının yazdığı reçeteler yerine kendi deneyimlerinin imbiklerinden süzülen gerçeğe güveniyorsun."

    p3 = "Geleceğe ve evrensel akışa dair duruşun ise çok net: "
    if doga > 0.6:
        p3 += "Doğanın ve kainatın bir parçası olduğunu, bir ağacın ya da yıldızın senden ayrı olmadığını biliyorsun. Bu kozmik aidiyet sana ölüm karşısında bile huzurlu bir dinginlik kazandırıyor."
    else:
        p3 += "Zihninin sınırlarını genişletmek, bilginin ve iradenin ışığıyla karanlığı aydınlatmak en büyük tutkun. Şimdi bu içsel pusulana güven ve kendi hakikatini yaşamaktan asla çekinme."

    return f"{p1}\n\n{p2}\n\n{p3}"

@app.post("/api/ai-reading")
async def get_ai_reading(data: AIRequest):
    if genai and GEMINI_API_KEY and not GEMINI_API_KEY.startswith("AIzaSy_BURAYA"):
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            Sen mistik, felsefi ve analitik bir yapay zeka rehberisin. 
            Kullanıcı %{data.similarity} oranında {data.archetype} arketipiyle eşleşti.
            5 boyutlu ruhsal vektörü: {data.vector}
            Kullanıcıya özel, doğrudan 'sen' diliyle hitap eden, onun karanlık ve aydınlık felsefi yönlerini analiz eden, 
            3 paragraflık derin bir psikolojik döküm yaz. Asla emoji kullanma. Net ve sarsıcı ol.
            """
            response = model.generate_content(prompt)
            if response and response.text:
                return {"reading": response.text}
        except Exception as e:
            print(f"Gemini API çağrısı başarısız, yerleşik analiz devrede: {e}")

    reading = generate_offline_ai_reading(data.archetype, data.similarity, data.vector)
    return {"reading": reading}
