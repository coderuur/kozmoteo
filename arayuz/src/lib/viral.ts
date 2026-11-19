import { MatchResult } from './types';

export interface BrutalTruth {
  quote: string;
  contradiction: string;
  socraticQuestion: string;
  historicalMirror: string;
}

export interface DuoRelationshipReport {
  userArchetype: string;
  partnerArchetype: string;
  compatibilityScore: number;
  conflictRisk: number;
  conflictLabel: string;
  title: string;
  subtitle: string;
  dynamics: string;
  biggestFightTopic: string;
  secretBond: string;
  verdictBadge: string;
}

export interface SoulDuelQuestion {
  id: number;
  question: string;
  options: { text: string; trait: string }[];
}

export interface SoulDuelData {
  ownerName: string;
  ownerArchetype: string;
  ownerAnswers: number[]; // indices 0..3
  timestamp: number;
}

export interface ConfessionItem {
  id: string;
  archetype: string;
  text: string;
  echoCount: number;
  timestamp: string;
  isUserEchoed?: boolean;
}

// -------------------------------------------------------------
// 1. SOKRATES'İN AYNASI: RUH TOKADI (BRUTAL TRUTH ENGINE)
// -------------------------------------------------------------
const BRUTAL_TRUTHS: Record<string, BrutalTruth> = {
  "HİÇLİK YOLCUSU": {
    quote: "Her şeyin anlamsız olduğunu söyleyip duruyorsun; fakat sabah kalkıp alarmını ertelemen bile evrende hala bir şeyler umduğunu ele veriyor.",
    contradiction: "Kozmik ölçekte hiçbir şeyi umursamıyorsun ama günlük hayatta birinin attığı mesaja dönmemesi tüm gününü mahvedebiliyor.",
    socraticQuestion: "Eğer gerçekten hiçbir şeyin önemi yoksa, bu anlamsızlığı herkese kanıtlama çaban nereden geliyor?",
    historicalMirror: "Friedrich Nietzsche & Emil Cioran"
  },
  "GELENEK MUHAFIZI": {
    quote: "Kadere ve ilahi plana teslim olduğunu iddia ediyorsun; çünkü kendi hatalarının bedelini evrenin planına fatura etmek vicdanını hafifletiyor.",
    contradiction: "Tanrı'nın adaletine mutlak güveniyorsun ama haksızlığa uğradığında dünyevi intikam ateşiyle yanıyorsun.",
    socraticQuestion: "Cennet ödülü veya cehennem korkusu olmasaydı, bugün savunduğun ahlakın kaçta kaçı ayakta kalırdı?",
    historicalMirror: "İmam Gazzâlî & İbn Rüşd"
  },
  "MERHAMET ELÇİSİ": {
    quote: "Herkesi koşulsuzca affetmek ve sevmek istiyorsun; çünkü sınır çizip 'hayır' dersen sevilmeyeceğinden korkuyorsun.",
    contradiction: "İnsanları affediyorsun ama içindeki kurban psikolojisi o affedişin faturasını gizlice biriktiriyor.",
    socraticQuestion: "Şefkatin gerçekten karşılıksız bir erdem mi, yoksa yalnız kalmaktan duyduğun derin bir ürperti mi?",
    historicalMirror: "Aziz Augustinus & Tolstoy"
  },
  "AKIŞIN USTASI": {
    quote: "Su gibi akıp hiçbir şeye direnmeyen bilge tavırları takınıyorsun; oysa çoğu zaman bu sadece sorumluluktan kaçan uyuşuk bir tembellik.",
    contradiction: "Zıtlıkların uyumunu savunuyorsun ama biri konfor alanını bozduğunda anında geriliyorsun.",
    socraticQuestion: "Akışa mı teslim oldun, yoksa yüzmekten yorulup kendini akıntıya mı bıraktın?",
    historicalMirror: "Laozi & Zhuangzi"
  },
  "KOZMİK RUH": {
    quote: "Ağaçla, gökyüzüyle ve evrenle bir olduğunu söylüyorsun; fakat şehrin betonundan ve telefon ekranından yarım saat bile kopamıyorsun.",
    contradiction: "Doğanın kutsallığına tapıyorsun ama hayatını tamamen modern dünyanın yapay konforu üzerine kurmuşsun.",
    socraticQuestion: "Evrenin kendisi Tanrı ise, içindeki o huzursuz boşluk neden hala bir şeylerin eksik olduğunu haykırıyor?",
    historicalMirror: "Baruch Spinoza & Ralph Waldo Emerson"
  },
  "SARSILMAZ İRADE": {
    quote: "Dış dünyayı umursamaz ve duygularını fethettiğini sanıyorsun; oysa duygularını hissetmekten korktuğun için onları derin bir mezara gömüyorsun.",
    contradiction: "Metanetli bir taş duvar taklidi yapıyorsun ama yalnız kaldığında içindeki fırtına seni boğuyor.",
    socraticQuestion: "Gerçekten yenilmez misin, yoksa kırılganlığını kimse görmesin diye zırhının arkasında donup kaldın mı?",
    historicalMirror: "Marcus Aurelius & Seneca"
  },
  "AKILCI MİMAR": {
    quote: "Evrenin arkasında yüce bir matematik olduğunu iddia ediyorsun; çünkü kontrol edemediğin bir belirsizlik ve kaos ihtimali aklını çıldırtıyor.",
    contradiction: "Kutsal kitapları dogmatik buluyorsun ama kendi mantığına ve zekana körü körüne dogmatik bir inançla bağlısın.",
    socraticQuestion: "Akılla her şeyi çözeceğini sanıyorsun; peki kalbindeki o mantıksız kırgınlığı hangi formülle açıklayacaksın?",
    historicalMirror: "Voltaire & Isaac Newton"
  },
  "ABSÜRT İSYANKAR": {
    quote: "Hayatın anlamsızlığına inat gülümseyerek isyan ettiğini söylüyorsun; ama en ufak bir hayal kırıklığında isyanın yerini öfke nöbeti alıyor.",
    contradiction: "Hiçbir amaç olmadığını biliyorsun ama yine de farkında olmadan takdir edilmek ve iz bırakmak için çırpınıyorsun.",
    socraticQuestion: "Sisifos gibi kayayı taşırken gerçekten mutlu musun, yoksa intihar etmekten korktuğun için mi bu tiyatroyu sürdürüyorsun?",
    historicalMirror: "Albert Camus & Jean-Paul Sartre"
  },
  "DÜNYEVİ AYDIN": {
    quote: "Sadece bilime ve somut akla güvendiğini söylüyorsun; fakat geceleri yıldızlara baktığında içindeki o tanımsız metafizik ürpertiyi bastıramıyorsun.",
    contradiction: "Ruhu ve öte alemi reddediyorsun ama aşık olduğunda biyolojik bir kimyasaldan çok daha fazlasını hissettiğine inanmak istiyorsun.",
    socraticQuestion: "Her şey atomlardan ibaretse, adaletsizlik karşısındaki bu öfken sadece nöronların elektro-kimyasal bir paraziti mi?",
    historicalMirror: "Carl Sagan & Bertrand Russell"
  },
  "GİZEMLİ BİLGE": {
    quote: "Herkesin uyuduğunu ve sadece senin 'gizli bir hakikate' uyandığını düşünüyorsun; bu gizemcilik sadece sıradan olmaktan duyduğun kibrin maskesi.",
    contradiction: "Maddi dünyanın bir hapishane olduğunu söylüyorsun ama bu hapishanenin sunduğu dünyevi zevklerin hiçbirinden vazgeçemiyorsun.",
    socraticQuestion: "Ulaştığın o 'yüksek hakikat' seni gerçekten özgürleştirdi mi, yoksa toplumdan soyutlayıp daha yalnız mı kıldı?",
    historicalMirror: "Hermes Trismegistus & Mani"
  },
  "KADİM ŞAMAN": {
    quote: "Ağaçların ve ataların ruhlarıyla konuştuğunu hissediyorsun; oysa bu sadece modern hayatın yalnızlığından kaçıp çocuksu bir masal dünyasına sığınma çaban.",
    contradiction: "Tüketim toplumunu lanetliyorsun ama cebindeki cihazla ormanda story çekmeden duramıyorsun.",
    socraticQuestion: "Ruhların sesini mi duyuyorsun, yoksa kendi bilinçaltının sana oynadığı zihinsel bir eko mu?",
    historicalMirror: "Mircea Eliade & Kadim Kamlar"
  }
};

export const getBrutalTruth = (archetype: string): BrutalTruth => {
  const norm = archetype.toUpperCase();
  for (const key of Object.keys(BRUTAL_TRUTHS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return BRUTAL_TRUTHS[key];
    }
  }
  return {
    quote: "İnanç pusulan ne kadar karmaşık görünürse görünsün; aslında sadece bu devasa evrende yalnız ve kaybolmuş olmadığını duymak istiyorsun.",
    contradiction: "Kendine çizdiğin felsefi portre ile aynaya baktığında hissettiğin çıplak gerçeklik arasında koca bir uçurum var.",
    socraticQuestion: "Kendine bile fısıldamaktan korktuğun o en derin inançsızlığın ne zaman açığa çıkacak?",
    historicalMirror: "Sokrates & Friedrich Nietzsche"
  };
};

// -------------------------------------------------------------
// 2. KOZMİK İLİŞKİ & ÇATIŞMA RAPORU (DUO 2.0 ENGINE)
// -------------------------------------------------------------
export const getDuoRelationshipReport = (
  userResult: MatchResult,
  partnerArchetype: string,
  partnerPercentage: number
): DuoRelationshipReport => {
  const uArch = userResult.archetype.toUpperCase();
  const pArch = (partnerArchetype || "BİLİNMEYEN YOLCU").toUpperCase();

  // Dinamik uyum skoru hesaplama
  const uScore = userResult.similarity_percentage;
  const pScore = partnerPercentage || 80;
  
  // Zıtlık ve benzerlik matrisi
  const isIdentical = uArch === pArch;
  const isNihilist = uArch.includes("HİÇLİK") || pArch.includes("HİÇLİK");
  const isTheist = uArch.includes("GELENEK") || pArch.includes("GELENEK") || uArch.includes("MERHAMET") || pArch.includes("MERHAMET");
  const isStoic = uArch.includes("SARSILMAZ") || pArch.includes("SARSILMAZ") || uArch.includes("AKIŞIN") || pArch.includes("AKIŞIN");

  let compatibility = Math.round((uScore + pScore) / 2);
  let conflictRisk = 50;
  let title = "Kozmik İki Bilincin Dansı";
  let subtitle = "Felsefi Rezonans";
  let dynamics = "";
  let biggestFightTopic = "";
  let secretBond = "";
  let verdictBadge = "Felsefi Yoldaşlık";

  if (isIdentical) {
    compatibility = Math.min(99, compatibility + 15);
    conflictRisk = 30;
    title = "Kusursuz Ayna Sendromu";
    subtitle = "Tek Bir Ruhun İki Beden Dağılımı";
    dynamics = `İkiniz de aynı arketipin (${userResult.archetype}) frekansındasınız. Birbirinizin cümlelerini henüz söylemeden tamamlarsınız. Gece konuşmalarınız saatlerce sürer çünkü dünyayı aynı filtreden seyrediyorsunuz. Ancak dikkat: Birbirinizin kör noktalarını göremezsiniz; biri batarken diğeri onu kurtarmak yerine batışı felsefi olarak onaylayabilir!`;
    biggestFightTopic = "Kim daha tutarlı bir varoluşçu / inançlı? Küçük detaylardaki felsefi kibir tartışmaları.";
    secretBond = "Dünyada kimsenin anlamadığı o garip şakaları ve varoluşsal sancıları sadece siz ikiniz anlıyorsunuz.";
    verdictBadge = "🔥 %98 Ruh İkizi";
  } else if (isNihilist && isTheist) {
    compatibility = 84;
    conflictRisk = 88;
    title = "Kutsal ile Boşluğun Savaşı";
    subtitle = "Zıt Kutupların Manyetik Yangını";
    dynamics = `Biri evrenin mutlak bir plan ve kutsal nizamla örüldüğünü savunurken, diğeri her şeyin tesadüfi bir hiçlikten ibaret olduğunu söylüyor. Birbirinize hem derin bir hayranlık hem de gizli bir dehşetle bakıyorsunuz. Biri diğerine hayatın neşesini ve huzurunu hatırlatırken, diğeri ötekini derin bir şüphe kuyusuna çekiyor.`;
    biggestFightTopic = "'Her şey kader mi yoksa tamamen saçmalık mı?' Gece 03:00'te başlayıp sabah ezanına kadar süren delirtici münazaralar.";
    secretBond = "Biri uçurumun kenarında yürürken diğeri onun elini tutup uçurumu inceliyor.";
    verdictBadge = "⚡ Tehlikeli & Karşı Konulmaz Çekim";
  } else if (isStoic) {
    compatibility = 79;
    conflictRisk = 42;
    title = "Fırtına ile Limanın Buluşması";
    subtitle = "Dengelenen Karşıtlıklar";
    dynamics = `Biri dünyayı tutkuları ve isyanıyla yakıp yıkmak isterken, diğeri sarsılmaz bir dinginlikle 'kontrol edemediğin şeyleri bırak' diyor. Biri yangın, diğeri yağmur. Birlikteyken ne tamamen yanar ne de tamamen donarsınız; birbirinizi törpüleyen kusursuz bir zımpara ilişkisi.`;
    biggestFightTopic = "'Neden bu kadar tepkisiz ve soğuksun?' vs. 'Neden her şeyi bu kadar büyütüyorsun?' krizi.";
    secretBond = "Kaosun ortasında birbirinize baktığınızda gelen o derin ve sessiz güven duygusu.";
    verdictBadge = "🌊 Sükunet & Denge";
  } else {
    compatibility = Math.min(94, Math.max(65, Math.round((uScore * 0.6) + (pScore * 0.4))));
    conflictRisk = 58;
    title = "Farklı Galaksilerin Yörüngesi";
    subtitle = "Merak Temelli Kozmik Uyum";
    dynamics = `Farklı inanç pusulalarına sahipsiniz ama birbirinizi yargılamak yerine büyüleyici buluyorsunuz. Birlikteyken dünya daha geniş ve çok renkli bir yere dönüşüyor. Birbirinizin zihninde hiç açılmamış pencereleri açıyorsunuz.`;
    biggestFightTopic = "Ahlakın kaynağı ve hayatın en önemli önceliğinin ne olduğu konusundaki ayrılıklar.";
    secretBond = "Fikirleriniz zıt olsa bile birbirinizin zekasına ve samimiyetine duyduğunuz derin saygı.";
    verdictBadge = "✦ %" + compatibility + " Zihinsel Simya";
  }

  const conflictLabel = conflictRisk >= 75 ? "Kritik (Volkanik)" : conflictRisk >= 50 ? "Orta (Dinamik Tartışmalar)" : "Düşük (Zen Dinginliği)";

  return {
    userArchetype: userResult.archetype,
    partnerArchetype: partnerArchetype || "Bilinmeyen Yolcu",
    compatibilityScore: compatibility,
    conflictRisk,
    conflictLabel,
    title,
    subtitle,
    dynamics,
    biggestFightTopic,
    secretBond,
    verdictBadge
  };
};

// -------------------------------------------------------------
// 3. BENİ NE KADAR TANIYORSUN? (SOUL DUEL CHALLENGE)
// -------------------------------------------------------------
export const SOUL_DUEL_QUESTIONS: SoulDuelQuestion[] = [
  {
    id: 1,
    question: "Sence ben gece tek başıma kaldığımda evren hakkında en çok ne düşünüyorum?",
    options: [
      { text: "Her şeyin bir planı ve ilahi bir anlamı var.", trait: "inançlı" },
      { text: "Kocaman bir boşluktayız, hiçbir şeyin anlamı yok.", trait: "nihilist" },
      { text: "Doğayla ve evrenle görünmez bir bağım var.", trait: "panteist" },
      { text: "Bilim her şeyi çözecek, fazla mistikleşmeye gerek yok.", trait: "rasyonalist" }
    ]
  },
  {
    id: 2,
    question: "Sence ölümden sonra ne olacağına inanıyorum?",
    options: [
      { text: "Ruhum sonsuz bir huzura veya hesap gününe gidecek.", trait: "öte_alem" },
      { text: "Biyolojik bir son; fiş çekilir ve sonsuz karanlık başlar.", trait: "yok_olus" },
      { text: "Kozmik bir okyanusa dönüp başka bir formda var olurum.", trait: "reenkarnasyon" },
      { text: "Bilinemez; bunu yaşayan kimse geri dönüp anlatmadı.", trait: "agnostik" }
    ]
  },
  {
    id: 3,
    question: "Kader mi yoksa tamamen özgür irade mi?",
    options: [
      { text: "Kader çizgim bellidir, ben sadece rolümü oynuyorum.", trait: "kaderci" },
      { text: "Kader saçmalıktır; her adımım tamamen kendi seçimim.", trait: "ozgur_irade" },
      { text: "Olaylar rastgeledir ama onlara verdiğim tepki benim irademdir.", trait: "stoaci" },
      { text: "Evrenin akışına teslim olursan kader ve irade birleşir.", trait: "taoist" }
    ]
  },
  {
    id: 4,
    question: "Eğer evren bir simülasyonsa, bu gerçeği öğrenmek ister miydim?",
    options: [
      { text: "Kesinlikle evet! Kırmızı hapı alır, kodları çözerdim.", trait: "merakli" },
      { text: "Hayır; bu dünyadaki mutluluğum ve sevdiklerim bana yeter.", trait: "huzurlu" },
      { text: "Fark etmez, simülasyon da olsa acılarım ve hislerim gerçek.", trait: "varoluscu" },
      { text: "Simülasyonu yaratanın kim olduğunu bulmaya odaklanırdım.", trait: "mimar" }
    ]
  },
  {
    id: 5,
    question: "Sence ahlak ve vicdan nereden gelir?",
    options: [
      { text: "Tanrı'nın kalbimize koyduğu ilahi bir pusuladır.", trait: "ilahi" },
      { text: "İnsanlığın hayatta kalmak için uydurduğu sosyal bir kurgudur.", trait: "evrimsel" },
      { text: "Evrenin karma ve neden-sonuç dengesinden doğar.", trait: "karma" },
      { text: "Bireyin kendi vicdanında eğittiği akılcı bir yasadır.", trait: "hümanist" }
    ]
  }
];

// Challenge verisini URL-safe Base64 olarak paketle
export const encodeSoulDuel = (ownerName: string, archetype: string, answers: number[]): string => {
  const data: SoulDuelData = {
    ownerName,
    ownerArchetype: archetype,
    ownerAnswers: answers,
    timestamp: Date.now()
  };
  try {
    const jsonStr = JSON.stringify(data);
    if (typeof window !== 'undefined') {
      return btoa(encodeURIComponent(jsonStr));
    }
  } catch (e) {}
  return "";
};

export const decodeSoulDuel = (token: string): SoulDuelData | null => {
  try {
    if (typeof window !== 'undefined') {
      const jsonStr = decodeURIComponent(atob(token));
      return JSON.parse(jsonStr) as SoulDuelData;
    }
  } catch (e) {}
  return null;
};

export const evaluateSoulDuel = (
  actualAnswers: number[],
  friendGuesses: number[]
): { score: number; matchCount: number; title: string; comment: string } => {
  let matches = 0;
  for (let i = 0; i < actualAnswers.length; i++) {
    if (actualAnswers[i] === friendGuesses[i]) {
      matches++;
    }
  }
  const score = Math.round((matches / actualAnswers.length) * 100);

  let title = "";
  let comment = "";

  if (score >= 80) {
    title = "Ruhumu Okuyan Medyum 🔮";
    comment = "İnanılmaz! Kafamın içindeki en gizli varoluşsal çelişkileri bile ezbere biliyorsun. Bu dünyada beni gerçekten gören nadir insanlardansın.";
  } else if (score >= 60) {
    title = "Yakın Yoldaş 👁️";
    comment = "Beni oldukça iyi tanıyorsun! Çoğu temel felsefemi çözmüşsün, geriye sadece birkaç karanlık sır kalmış.";
  } else if (score >= 40) {
    title = "Maskeme Aldanan Dost 🎭";
    comment = "Dışarıya gösterdiğim sosyal maskemi tanıyorsun ama gece yalnız kaldığımda düşündüğüm asıl ben seni biraz şaşırttı!";
  } else {
    title = "Felsefi Yabancı 🌌";
    comment = "Sürpriz! Beni tamamen bambaşka biri sanıyormuşsun. Acilen gece 03:00'te derin bir çay/kahve içip konuşmamız gerek!";
  }

  return { score, matchCount: matches, title, comment };
};

// -------------------------------------------------------------
// 4. KOZMİK İTİRAF & GECE FISILTILARI (CONFESSION WALL)
// -------------------------------------------------------------
export const INITIAL_CONFESSIONS: ConfessionItem[] = [
  {
    id: "c-1",
    archetype: "HİÇLİK YOLCUSU",
    text: "Herkes beni çok umursamaz ve soğuk sanıyor. Oysa hiçbir şeyin anlamı olmadığını düşünmek beni özgür kılmıyor, sadece geceleri ağlamamı mantıksız kılıyor.",
    echoCount: 142,
    timestamp: "Gece 02:41"
  },
  {
    id: "c-2",
    archetype: "GELENEK MUHAFIZI",
    text: "Aileme ve çevreme çok dindar görünüyorum. Ama secdedeyken bazen 'Ya gökyüzü tamamen boşsa ve sadece kendime fısıldıyorsam?' korkusu tüm bedenimi titretiyor.",
    echoCount: 289,
    timestamp: "Gece 01:15"
  },
  {
    id: "c-3",
    archetype: "AKIŞIN USTASI",
    text: "Her şeye 'vardır bir hayır' deyip gülümsüyorum çünkü öfkelenirsem içimdeki yıkımı durduramayacağımı çok iyi biliyorum.",
    echoCount: 95,
    timestamp: "Gece 03:22"
  },
  {
    id: "c-4",
    archetype: "KOZMİK RUH",
    text: "Evrenle bir olduğumu söylüyorum ama kalabalık bir caddede yürürken kendimi bu gezegene yanlışlıkla düşmüş bir uzaylı gibi hissediyorum.",
    echoCount: 178,
    timestamp: "Gece 00:54"
  },
  {
    id: "c-5",
    archetype: "SARSILMAZ İRADE",
    text: "Bana herkes 'sen kaya gibisin, sana bir şey olmaz' diyor. Oysa sadece bir kez birinin bana sarılıp 'artık güçlü olmak zorunda değilsin' demesine o kadar ihtiyacım var ki.",
    echoCount: 312,
    timestamp: "Gece 04:08"
  },
  {
    id: "c-6",
    archetype: "ABSÜRT İSYANKAR",
    text: "Dünyanın saçmalığına gülüyorum ama aslında tek aradığım, bu saçmalığın içinde beni tutkuyla seven ve anlayan tek bir çift göz.",
    echoCount: 204,
    timestamp: "Gece 02:03"
  }
];
