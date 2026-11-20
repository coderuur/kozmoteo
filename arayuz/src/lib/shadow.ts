// =====================================================================
// KOZMO-TEO v2.0: GELİŞMİŞ GÖLGE BENLİK ENGİNE (shadow.ts UPGRADE)
// =====================================================================

export interface ShadowParadox {
  title: string;
  subtitle: string;
  tension: string;
  analysis: string;
  advice: string;
}

export interface ShadowSelf {
  suppressedArchetype: string;    // Bastırılmış arketip
  suppressedBelief: string;       // Bastırılmış inanç sistemi
  suppressionScore: number;       // 0..1 — ne kadar baskılanmış
  shadowQuote: string;            // O arketipin sesi
  integrationAdvice: string;      // Gölgeyi entegre etme tavsiyesi
  jungianLabel: string;           // Jungian terim
  conflictAxis: string;           // Hangi boyutta en büyük çatışma var
}

export interface BlindSpotResult {
  weakestDimension: string;
  weakestIndex: number;
  weakScore: number;
  deepeningQuestions: { question: string; dimension: string }[];
  insight: string;
}

// --- MOCK_RELIGIONS ile eşleşen basit vektör haritası ---
const BELIEF_VECTORS: Record<string, number[]> = {
  'İslam / Geleneksel Tektanrıcılık':   [0.9, 0.9, 0.9, 0.9, 0.2],
  'Hristiyanlık / İnayet ve Kurtuluş':  [0.9, 0.8, 0.9, 0.9, 0.3],
  'Musevilik / Ahit ve Gelenek':        [1.0, 0.9, 0.7, 0.9, 0.1],
  'Budizm / İçsel Uyanış':             [0.1, 0.8, 0.8, 0.4, 0.6],
  'Hinduizm / Evrensel Döngü':         [0.6, 0.9, 0.9, 0.8, 0.7],
  'Taoizm / Akış ve Uyum':            [0.1, 0.5, 0.4, 0.5, 0.9],
  'Şamanizm / Doğa Ruhları':          [0.5, 0.8, 0.7, 0.1, 1.0],
  'Zerdüştlük / Işık ve Karanlık':    [0.8, 0.9, 0.8, 0.7, 0.4],
  'Deizm / Akılcı Yaratılış':         [0.9, 0.1, 0.4, 0.1, 0.1],
  'Panteizm / Kozmik Birlik':         [0.8, 0.3, 0.5, 0.1, 1.0],
  'Stoacılık / Rasyonel İrade':       [0.4, 0.1, 0.2, 0.1, 0.6],
  'Seküler Hümanizm':                 [0.1, 0.1, 0.1, 0.1, 0.1],
  'Gnostisizm / Gizli Bilgi':         [0.7, 0.7, 0.8, 0.5, 0.2],
  'Nihilizm / Kozmik Boşluk':        [0.0, 0.0, 0.0, 0.0, 0.0],
  'Absürdizm / Başkaldırı':           [0.1, 0.1, 0.1, 0.1, 0.2],
  'Transhümanizm':                    [0.1, 0.2, 0.4, 0.1, 0.1],
  'LaVeyan Satanizm':                 [0.1, 0.6, 0.1, 0.4, 0.1],
  'Neo-Paganizm (Wicca)':             [0.4, 0.9, 0.6, 0.2, 1.0],
  'Agnostisizm':                      [0.3, 0.1, 0.3, 0.1, 0.3],
  'Sufizm / Evrensel Mistisizm':      [0.9, 0.6, 0.8, 0.4, 0.9],
};

const BELIEF_ARCHETYPES: Record<string, string> = {
  'İslam / Geleneksel Tektanrıcılık':   'GELENEK MUHAFIZI',
  'Hristiyanlık / İnayet ve Kurtuluş':  'MERHAMET ELÇİSİ',
  'Musevilik / Ahit ve Gelenek':        'KADİM YASA KORUYUCU',
  'Budizm / İçsel Uyanış':             'İÇSEL GEZGİN',
  'Hinduizm / Evrensel Döngü':         'DÖNGÜNÜN BİLGESİ',
  'Taoizm / Akış ve Uyum':            'AKIŞIN USTASI',
  'Şamanizm / Doğa Ruhları':          'KADİM ŞAMAN',
  'Zerdüştlük / Işık ve Karanlık':    'IŞIĞIN SAVAŞÇISI',
  'Deizm / Akılcı Yaratılış':         'AKILCI MİMAR',
  'Panteizm / Kozmik Birlik':         'KOZMİK RUH',
  'Stoacılık / Rasyonel İrade':       'SARSILMAZ İRADE',
  'Seküler Hümanizm':                 'DÜNYEVİ AYDIN',
  'Gnostisizm / Gizli Bilgi':         'GİZEMLİ BİLGE',
  'Nihilizm / Kozmik Boşluk':        'HİÇLİK YOLCUSU',
  'Absürdizm / Başkaldırı':           'ABSÜRT İSYANKAR',
  'Transhümanizm':                    'TEKNO-MİMAR',
  'LaVeyan Satanizm':                 'BİREYSEL ASİ',
  'Neo-Paganizm (Wicca)':             'DOĞANIN BÜYÜCÜSÜ',
  'Agnostisizm':                      'ŞÜPHECİ GÖZLEMCİ',
  'Sufizm / Evrensel Mistisizm':      'AŞKIN DERVİŞ',
};

const SHADOW_QUOTES: Record<string, string> = {
  'GELENEK MUHAFIZI': '"Belki de o katı kuralların altında, özgür kalmayı yitirmiş bir ruh yatıyor."',
  'MERHAMET ELÇİSİ': '"Kendini yitirene kadar herkesi affetmek, aslında korkudan kaçmaktır."',
  'KADİM YASA KORUYUCU': '"Ya kuralların seni değil, sen kuralları korumak zorundaysan?"',
  'İÇSEL GEZGİN': '"Her şeyden vazgeçip nirvana arayan bir ruh, aslında acıdan kaçıyor olabilir."',
  'DÖNGÜNÜN BİLGESİ': '"Karma deyin, kader deyin... sonunda hep bir başkası sorumlu oluyor."',
  'AKIŞIN USTASI': '"Akışa teslim olmak ile sorumluluktan kaçmak arasındaki fark nerede?"',
  'KADİM ŞAMAN': '"Ruhlarla konuşmak ne kadar rahatlatıcı; insanlarla konuşmak bir o kadar zor."',
  'IŞIĞIN SAVAŞÇISI': '"Her şeyi iyi ve kötü diye bölmek, düşünmekten daha kolay bir yoldur."',
  'AKILCI MİMAR': '"Tanrı\u2019yı matematiğe indirgemek, belki de O\u2019nu sevmekten korktuğun için."',
  'KOZMİK RUH': '"Evrenle bir olduğunu hissedersin ama yalnızlıktan bir türlü kurtulamazsın."',
  'SARSILMAZ İRADE': '"Sarsılmaz görünmek için kırılganlığını ne zamandır gömmüşsün içine?"',
  'DÜNYEVİ AYDIN': '"Bilim her şeyi açıklıyor diyorsun; peki o açıklanamaz yalnızlığı ne yapıyorsun?"',
  'GİZEMLİ BİLGE': '"Herkesin uyuduğunu düşünmek, aslında üstün olmak ihtiyacını gizliyor."',
  'HİÇLİK YOLCUSU': '"Her şeyin anlamsız olduğunu bu kadar ısrarlı kanıtlamak da bir tür anlam arayışı."',
  'ABSÜRT İSYANKAR': '"İsyanını gülümseyerek sürdürmek güzel; ama içindeki çığlığı ne zaman duyacaksın?"',
  'TEKNO-MİMAR': '"Ölümü çözmeye çalışırken, şu anı yaşamayı unutuyor musun?"',
  'BİREYSEL ASİ': '"Egona tapman, aslında reddettiğin toplumun içinde olmak istemenin tersten ifadesi."',
  'DOĞANIN BÜYÜCÜSÜ': '"Doğayla bu kadar bütünleşmek, insan bağlarının ağırlığından kaçmak mı?"',
  'ŞÜPHECİ GÖZLEMCİ': '"Bilmiyorum demek erdemdir; ama bazen kararlılıktan kaçmak için de kullanılır."',
  'AŞKIN DERVİŞ': '"İlahi aşkta erimeyi arayan bir kalp, insani ilişkilerde neden bu kadar zorlanıyor?"',
};

const SHADOW_INTEGRATION: Record<string, string> = {
  'GELENEK MUHAFIZI': 'Geleneğin güzelliğini reddetme; ama kuralların altındaki özgür ruhu da küçümseme. Teslimiyetin gerçek anlamını sorgula.',
  'HİÇLİK YOLCUSU': 'Nihilizm bir varıştır, ancak aynı zamanda yeni bir başlangıcın kapısı. Anlamsızlıkla barışmak onu kucaklamaktır.',
  'TEKNO-MİMAR': 'Geleceği inşa ederken bu anı yaşa. Teknoloji araç; anlam hâlâ senin içinde.',
  'DOĞANIN BÜYÜCÜSÜ': 'Doğa sana ev, insanlar sana ayna. İkisinden de kaçma.',
  'GİZEMLİ BİLGE': 'Bilgeliğini paylaşmak seni küçümsemez; aksine onu büyütür.',
  'AKILCI MİMAR': 'Matematik kadar sezgini de duy. Evrenin tüm sırları sadece formüllerde değil.',
  'AKIŞIN USTASI': 'Bazen akan suyun bile yatağını seçtiğini unut. Seçimsizlik de bir seçimdir.',
  'BİREYSEL ASİ': 'Bireyselliğin en güçlü ifadesi özgürlüktür; ama gerçek özgürlük bağlanmayı da içerir.',
  'SARSILMAZ İRADE': 'Kırılganlığını kabul etmek zayıflık değil, en derin cesaret biçimidir.',
  'MERHAMET ELÇİSİ': 'Önce kendine şefkat göster. Boş bir kap başkalarına su veremez.',
};

const DIMENSION_LABELS_SHADOW = ['Tektanrıcılık', 'Ritüelizm', 'Ölüm Sonrası', 'Dogmatizm', 'Doğa/Panteizm'];

// Öklid mesafesi hesapla
const euclidean = (a: number[], b: number[]): number => {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - (b[i] ?? 0.5), 2), 0));
};

export const computeShadowSelf = (userVector: number[], primaryBelief: string): ShadowSelf => {
  let maxDistance = -1;
  let suppressedBelief = '';

  for (const [belief, vec] of Object.entries(BELIEF_VECTORS)) {
    if (belief === primaryBelief) continue;
    const dist = euclidean(userVector, vec);
    if (dist > maxDistance) {
      maxDistance = dist;
      suppressedBelief = belief;
    }
  }

  const suppressedArchetype = BELIEF_ARCHETYPES[suppressedBelief] ?? 'BİLİNMEYEN ARKETIP';
  const suppressionScore = Math.min(1, maxDistance / 2.24); // max ~2.24 (5D uzayında max mesafe)

  // En büyük zıtlık boyutu
  const suppressedVec = BELIEF_VECTORS[suppressedBelief] ?? [0.5, 0.5, 0.5, 0.5, 0.5];
  const diffs = userVector.map((v, i) => Math.abs(v - suppressedVec[i]));
  const conflictIdx = diffs.indexOf(Math.max(...diffs));
  const conflictAxis = DIMENSION_LABELS_SHADOW[conflictIdx];

  const shadowQuote = SHADOW_QUOTES[suppressedArchetype] ?? '"İçindeki o ses susturulamaz."';
  const integrationAdvice = SHADOW_INTEGRATION[suppressedArchetype] ??
    'Reddettiğin o düşünceyle bir kez tam olarak yüzleş. Sadece bak, hükmetme.';

  // Jungian etiket
  let jungianLabel = 'Persona Maskesi';
  if (suppressionScore > 0.8) jungianLabel = 'Derin Gölge';
  else if (suppressionScore > 0.6) jungianLabel = 'Aktif Gölge';
  else if (suppressionScore > 0.4) jungianLabel = 'Latent Gölge';

  return {
    suppressedArchetype,
    suppressedBelief,
    suppressionScore,
    shadowQuote,
    integrationAdvice,
    jungianLabel,
    conflictAxis
  };
};

// ================================================================
// KÖR NOKTA SKORU (Blind Spot Engine)
// ================================================================

const BLIND_SPOT_QUESTIONS: Record<number, { question: string; dimension: string }[]> = {
  0: [ // Tektanrıcılık
    { question: 'Evrende bilinçli bir düzenin matematiksel olarak olduğuna inanır mısın, yoksa salt kaos mu var?', dimension: 'Tektanrıcılık' },
    { question: 'Tanrı kavramı sana güven verir mi, yoksa özgürlüğünü kısıtlayan bir kural mı gibi gelir?', dimension: 'Tektanrıcılık' },
    { question: 'Kainatın, tesadüfen değil de tasarlanmış olduğu fikri seni etkilemez mi?', dimension: 'Tektanrıcılık' },
    { question: 'Hiç tanrıya dua ettikten sonra gerçekten dinlenildiğini hissetttin mi?', dimension: 'Tektanrıcılık' },
    { question: 'Eğer Tanrı yoksa, ahlak evrensel bir temele sahip olabilir mi?', dimension: 'Tektanrıcılık' },
  ],
  1: [ // Ritüelizm
    { question: 'Tekrar eden bir ritüel (sabah kahve, dua, yürüyüş) seni nasıl dönüştürüyor?', dimension: 'Ritüelizm' },
    { question: 'Toplu bir ibadet ya da kutlamada hiç kozmik bir bütünlük hissettin mi?', dimension: 'Ritüelizm' },
    { question: 'Bedensel bir ritüelin (oruç, meditasyon, secde) zihni değiştirdiğine inanıyor musun?', dimension: 'Ritüelizm' },
    { question: 'Neden bazı günler tüm rutinlerin çöktüğünde kendini eksik hissedersin?', dimension: 'Ritüelizm' },
    { question: 'Kutsal sayılan bir mekana girdiğinde gerçekten farklı bir enerji hissediyor musun?', dimension: 'Ritüelizm' },
  ],
  2: [ // Ölüm Sonrası
    { question: 'Öldükten sonra bilincinizin tamamen söneceğini düşünmek sizi nasıl hissettiriyor?', dimension: 'Ölüm Sonrası' },
    { question: 'Hiç yaşamının sanki daha önce de yaşanmış gibi geldiği bir an oldu mu?', dimension: 'Ölüm Sonrası' },
    { question: 'Ölümü düşündüğünde çoğunlukla korku mu, merak mı, yoksa huzur mu hissediyorsun?', dimension: 'Ölüm Sonrası' },
    { question: 'Kaybettiğin biriyle başka bir formda yeniden buluşacağına gerçekten inanıyor musun?', dimension: 'Ölüm Sonrası' },
    { question: 'Hesap günü fikri sana adalet mi, yoksa korku mu aşılar?', dimension: 'Ölüm Sonrası' },
  ],
  3: [ // Dogmatizm
    { question: 'Binlerce yıllık kutsal metinlere olan güvenin, kendi aklına olan güveninden fazla mı?', dimension: 'Dogmatizm' },
    { question: 'Hiç çok sevdiğin bir inancının yanlış olduğunu kanıtlayan bir şey gördün mü? Ne hissettin?', dimension: 'Dogmatizm' },
    { question: 'Toplumun sana aşıladığı ahlaki kurallar, gerçekten kendi değerlerin mi?', dimension: 'Dogmatizm' },
    { question: 'Bir inancı sorgulamak onu zayıflatır mı, yoksa güçlendirir mi?', dimension: 'Dogmatizm' },
    { question: 'Dogmasız bir dünyada insanlar daha ahlaklı mı, daha kaotik mi olurdu?', dimension: 'Dogmatizm' },
  ],
  4: [ // Doğa/Panteizm
    { question: 'Ormanın ortasında ya da deniz kenarında gerçekten "daha büyük bir şeyin parçası" hissettim mi?', dimension: 'Doğa/Panteizm' },
    { question: 'Bir hayvanın gözüne bakınca, orada benimkiyle eşdeğer bir bilinç gördüm mü?', dimension: 'Doğa/Panteizm' },
    { question: 'Vücudundaki atomların yıldızlardan geldiği gerçeği seni nasıl etkiliyor?', dimension: 'Doğa/Panteizm' },
    { question: 'Tanrı doğanın kendisiyse, o zaman bir kütüphaneyi yıkmak bir günahtan daha büyük günah mı?', dimension: 'Doğa/Panteizm' },
    { question: 'Teknoloji mi doğaya en yakın olandır, yoksa doğa mı her şeyden önce gelir?', dimension: 'Doğa/Panteizm' },
  ],
};

const BLIND_SPOT_INSIGHTS: string[] = [
  'Bu boyuttaki zayıflığın aslında bir kapı. Merak etmek, cevap bulmaktan daha kıymetlidir.',
  'Bilincin bu eksende henüz tam derinliğine inmemiş. Bu soruları bekletme, birlikte çöz.',
  'Farkında bile olmasan bu boyut seni en çok zorluyor. Yüzleşmek özgürleştirir.',
  'En sağlam binalar en zayıf temeli güçlendirerek yükselir. Senin için de öyle.',
];

export const computeBlindSpot = (vector5d: number[]): BlindSpotResult => {
  const weakestIndex = vector5d.indexOf(Math.min(...vector5d));
  const weakestDimension = DIMENSION_LABELS_SHADOW[weakestIndex];
  const weakScore = vector5d[weakestIndex];
  const deepeningQuestions = BLIND_SPOT_QUESTIONS[weakestIndex] ?? [];
  const insight = BLIND_SPOT_INSIGHTS[weakestIndex % BLIND_SPOT_INSIGHTS.length];

  return { weakestDimension, weakestIndex, weakScore, deepeningQuestions, insight };
};

// ================================================================
// SHADOW PARADOX (eski shadow.ts mantığı buraya taşındı)
// ================================================================

export const analyzeShadowParadox = (v: number[]): ShadowParadox => {
  const tek = v[0] ?? 0.5;
  const rit = v[1] ?? 0.5;
  const olum = v[2] ?? 0.5;
  const dogma = v[3] ?? 0.5;
  const doga = v[4] ?? 0.5;

  if (dogma <= 0.40 && (olum >= 0.58 || doga >= 0.70)) {
    return {
      title: 'Hüzünlü Materyalist',
      subtitle: 'Akıl ile Ruhun Çatışması',
      tension: 'Rasyonalist Kuşku vs. Aşkınlık Özlemi',
      analysis:
        'Zihnin bilime ve somut gerçekliğe teslim; dogmatik masalları ve kör inançları net bir şekilde reddediyorsun. Fakat bilinçaltın ölüm karşısında yok oluş fikrini kabul etmekte zorlanıyor ve evrenle açıklanamaz bir kozmik bağ arıyor. Aklın \'madde biterse her şey biter\' derken, içindeki bir ses evrenin bu kadar sıradan olamayacağını fısıldıyor.',
      advice:
        'Bu bir zayıflık değil, derin bir varoluşsal lütuftur. Bilimi aklının kılavuzu, doğanın gizemini ise kalbinin tapınağı yap.',
    };
  }

  if (tek <= 0.40 && (rit >= 0.55 || doga >= 0.65)) {
    return {
      title: 'Dinsiz Derviş',
      subtitle: 'Tanrısız Kutsallık Arayışı',
      tension: 'Teolojik Bağımsızlık vs. Meditatif Ritüel İhtiyacı',
      analysis:
        'Geleneksel tanrı kavramına ve göksel bir yargıca inanmıyorsun; fakat bir tapınağın loş dinginliğini, tütsü kokusunu, meditatif derinliği ve doğayla bir olma ritüelini derinden arzuluyorsun. Kiliseye veya camiye değil, bizzat varoluşun kendi nefesine secde eden bir pagan duyarlılığı taşıyorsun.',
      advice:
        'İnançsız olmak ruhsuz olmak demek değildir. Kendi kişisel meditasyon ritüellerini ve orman yürüyüşlerini kutsal ibadetin olarak gör.',
    };
  }

  if (tek >= 0.55 && dogma <= 0.35) {
    return {
      title: 'Spinoza\'nın Gezgini',
      subtitle: 'Kutsal Metinleri Yıkan Kozmik Mimar',
      tension: 'Kozmik İntizam vs. Din Kurumuna İsyan',
      analysis:
        'Evrende akıl almaz bir geometri, matematiksel bir intizam ve yüksek bir zeka olduğunu seziyorsun. Fakat insanların yazdığı kutsal kitapları, cehennem tehditlerini ve kuralcı din adamlarını kesin bir tavırla reddediyorsun. Sen tanrıyı gökte bir kral değil, doğanın ve evrenin kendisi olarak görüyorsun.',
      advice:
        'Korku temelli dinlerin seni soğutmasına izin verme. Senin ibadetin, evrenin yasalarını anlamak ve doğanın ahengini seyretmektir.',
    };
  }

  if (tek <= 0.35 && olum <= 0.35) {
    return {
      title: 'Absürdün Kahramanı',
      subtitle: 'Anlamsızlığa Rağmen Gülümseyen Bilinç',
      tension: 'Hiçlik Gerçeği vs. Yaşama Tutkusu',
      analysis:
        'Evrenin soğuk, sessiz ve bize tamamen kayıtsız olduğunu biliyorsun. Ölümün nihai bir nokta olduğunun farkındasın. Fakat bu seni depresyona değil, inanılmaz bir özgürlüğe götürüyor. Albert Camus gibi, evrenin boşluğuna inat kendi ahlakını ve anlamını bir meşale gibi karanlığa dikiyorsun.',
      advice:
        'Anlam hazır verilmez; anlam bir sanat eseri gibi senin tarafında yaratılır. Boşluk senin tuvalindir, özgürce boya.',
    };
  }

  return {
    title: 'Kozmik Arayıcı',
    subtitle: 'Zıt Kutupların Sessiz Simyası',
    tension: 'Yeryüzü Maddesi vs. Göksel Sezgi',
    analysis:
      'Zihnin tek bir ideolojiye veya inanç kafesine sığmayı reddediyor. Bir yanın rasyonel ve kuşkucu, diğer yanın ise varoluşun ardındaki aşkın gizeme karşı derin bir hürmet besliyor. Kutuplar arasında salınmak seni kararsız değil, çok boyutlu ve bilge bir gözlemci kılıyor.',
    advice:
      'Kendini tek bir kalıba sokmaya zorlama. Sen sabit bir nokta değil, sürekli genişleyen bir kozmik nehirsin.',
  };
};
