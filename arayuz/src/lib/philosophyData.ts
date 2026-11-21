// Felsefi ve Teolojik Derinlik Kütüphanesi
// 30 Kadim & Çağdaş Görüş, Edebi İncelemeler, Ünlü Filozof Sözleri, Başucu Kitapları ve Kült Film Önerileri

export interface PhilosophyQuote {
  quote: string;
  author: string;
  context: string;
}

export interface PhilosophyBook {
  title: string;
  author: string;
  note: string;
}

export interface PhilosophyMovie {
  title: string;
  year: number;
  director: string;
  note: string;
}

export interface PhilosophyDetail {
  id: string;
  name: string;
  archetype: string;
  motto: string;
  extended_essay: string[];
  quotes: PhilosophyQuote[];
  books: PhilosophyBook[];
  movies: PhilosophyMovie[];
}

export const PHILOSOPHY_DETAILS: Record<string, PhilosophyDetail> = {
  "İslam / Geleneksel Tektanrıcılık": {
    id: "islam",
    name: "İslam / Geleneksel Tektanrıcılık",
    archetype: "GELENEK MUHAFIZI",
    motto: "Evrenin mutlak nizamına ve ilahi iradeye teslimiyet.",
    extended_essay: [
      "İslam felsefesi ve teolojisi, varoluşun merkezine Tevhid ilkesini yerleştirir. Evrendeki her bir atom, galaksilerin dönüşü ve insanın kalp atışı rastlantısal bir kaza değil; aşkın, her şeyi kuşatan tek bir Yaratıcı'nın hikmetli tasarımının tecellisidir.",
      "İnsan bu alemde başıboş bir gezgin değil; göklerin ve yerin yüklenmekten çekindiği emaneti sırtlanan ahlaki bir varlıktır. Hayatın acıları ve imtihanları anlamsız bir kaos değil, ruhu olgunlaştıran ve kişiyi tevazuya erdiren basamaklardır.",
      "Zihninin bu frekansta titreşmesi, senin köksüz rüzgarlara kapılmak yerine kadim bir omurgaya, ahde ve ilahi adalete olan derin bağlılığını gösterir."
    ],
    quotes: [
      {
        quote: "O, gökleri ve yeri hak ile yarattı. Geceyi gündüzün üstüne sarıyor, gündüzü de gecenin üstüne sarıyor.",
        author: "Kur'an-ı Kerim",
        context: "Zümer Suresi, kozmik düzen ve zamanın ilahi nizamı üzerine."
      },
      {
        quote: "Kalp deniz, dil kıyıdır. Denizde ne varsa kıyıya o vurur.",
        author: "Mevlânâ Celâleddîn-i Rûmî",
        context: "İçsel niyetin ve ahlakın dışavurumu."
      },
      {
        quote: "Akıl, hakikatin kapısına kadar götüren bir ışıktır; fakat kapıyı açıp içeriye adım atmak ancak yakin ve teslimiyetle mümkündür.",
        author: "İmam Gazzâlî",
        context: "El-Münkız mine'd-Dalâl eserinde bilginin sınırları."
      }
    ],
    books: [
      {
        title: "El-Münkız mine'd-Dalâl",
        author: "İmam Gazzâlî",
        note: "Şüpheden kesin inanca uzanan entelektüel ve manevi arayışın başyapıtı."
      },
      {
        title: "İslam'da Dini Düşüncenin Yeniden Doğuşu",
        author: "Muhammed İkbal",
        note: "Modern çağda Doğu ile Batı düşüncesini harmanlayan felsefi zirve."
      },
      {
        title: "Mesnevi",
        author: "Mevlânâ Celâleddîn-i Rûmî",
        note: "Varlığın ilahi aşkla yoğruluşunu anlatan hikmetli dizeler."
      }
    ],
    movies: [
      {
        title: "The Message",
        year: 1976,
        director: "Mustafa Akkad",
        note: "İnancın ve sarsılmaz bir davanın doğuşunu anlatan destansı sinema klasiği."
      },
      {
        title: "Bab'Aziz",
        year: 2005,
        director: "Nacer Khemir",
        note: "Çölde dervişlerin aşk arayışını ve ruhsal teslimiyeti görsel bir şiire dönüştüren eser."
      }
    ]
  },

  "Stoacılık / Rasyonel İrade": {
    id: "stoacilik",
    name: "Stoacılık / Rasyonel İrade",
    archetype: "SARSILMAZ İRADE",
    motto: "Dış dünyayı yönetemezsin; fakat kendi zihninin mutlak efendisisin.",
    extended_essay: [
      "Stoacı felsefe, Helenistik dönemin çalkantılarında bir insanın ruhsal kalesini nasıl inşa edebileceğini keşfetti. Marcus Aurelius'tan Epiktetos'a uzanan bu yol, dünyayı ikiye ayırır: Senin kontrolünde olanlar ve asla senin kontrolünde olmayanlar.",
      "Dış olaylar, başkalarının hakkındaki düşünceleri, hastalıklar ve ekonomik krizler senin iradenin dışındadır; onları değiştiremezsin. Ancak o olaylara vereceğin tepki, içsel huzurun ve karakterin tamamen senin elindedir.",
      "Bu arketip, sızlanmayı ve kurban rolüne bürünmeyi reddeder. Rüzgar nereden eserse essin, yelkenlerini bilgelikle ayarlayıp metanetle rotasına devam edenlerin zihniyetidir."
    ],
    quotes: [
      {
        quote: "Seni olaylar değil, o olaylar hakkında geliştirdiğin yargılar incitir.",
        author: "Epiktetos",
        context: "Encheiridion, düşüncenin özgürleştirici gücü üzerine."
      },
      {
        quote: "Sabah uyandığında kendine söyle: Bugün nankör, küstah, vefasız ve bencil insanlarla karşılaşacağım; fakat hiçbiri beni kirletemez çünkü kötülüğe katılmamayı seçiyorum.",
        author: "Marcus Aurelius",
        context: "Kendime Düşünceler, günlük ruhsal hazırlık."
      },
      {
        quote: "Büyük bir insan olmak için fırtınanın ortasında bile sakin bir deniz gibi kalabilmelisin.",
        author: "Seneca",
        context: "Ahlak Mektupları, ruh dinginliği (Ataraxia)."
      }
    ],
    books: [
      {
        title: "Kendime Düşünceler",
        author: "Marcus Aurelius",
        note: "Roma İmparatoru'nun savaş çadırında kendi vicdanıyla yaptığı samimi iç konuşmalar."
      },
      {
        title: "Ahlak Mektupları",
        author: "Seneca",
        note: "Zamanın değeri, ölümlülük ve korkulardan arınma üzerine zamansız mektuplar."
      },
      {
        title: "Söylevler ve Kılavuz",
        author: "Epiktetos",
        note: "Kölelikten felsefe hocalığına yükselen bir bilgenin özgürlük rehberi."
      }
    ],
    movies: [
      {
        title: "Gladiator",
        year: 2000,
        director: "Ridley Scott",
        note: "Tüm sevdiklerini ve özgürlüğünü kaybeden Maximus'un sarsılmaz karakter ve onur mücadelesi."
      },
      {
        title: "Bridge of Spies",
        year: 2015,
        director: "Steven Spielberg",
        note: "Ölüm tehlikesi altındayken bile endişelenmenin faydası var mı diyen Rudolf Abel'in metaneti."
      }
    ]
  },

  "Panteizm / Kozmik Birlik": {
    id: "panteizm",
    name: "Panteizm / Kozmik Birlik",
    archetype: "KOZMİK RUH",
    motto: "Tanrı ve Doğa birdir; sen evrenden ayrı bir seyirci değil, evrenin bizzat kendisisin.",
    extended_essay: [
      "Panteizm, yaratıcı ile yaratılan arasındaki yapay duvarı yerle bir eder. Baruch Spinoza'nın 'Deus sive Natura' (Tanrı ya da Doğa) formülüyle özetlediği bu anlayışta, gökyüzündeki bir pulsar, okyanusun derinliğindeki bir balık ve senin düşünen beynin, tek bir sonsuz Töz'ün farklı biçimleridir.",
      "Burada göklerde tahtta oturan, gazap duyan ya da ödül dağıtan insansı bir tanrı yoktur. Tanrı, evrenin matematiksel kusursuzluğunda, fizik yasalarında ve doğanın yaşayan ahengindedir.",
      "Sen kendini dünyada kaybolmuş yalnız bir birey sanırsın; oysa sen okyanustaki bir damla değil, bir damlanın içindeki bütün bir okyanussun."
    ],
    quotes: [
      {
        quote: "Kendini evrenin Efendisi sanan insan bir illüzyon içindedir; oysa o doğanın dokusundan başka hiçbir şey değildir.",
        author: "Baruch Spinoza",
        context: "Etika, zihin ve doğa birliği."
      },
      {
        quote: "Ben doğaüstü bir kişisel tanrıya değil, Spinoza'nın var olan her şeyin ahenginde kendini gösteren Tanrısına inanıyorum.",
        author: "Albert Einstein",
        context: "Kozmik dindarlık ve evrenin matematiği."
      },
      {
        quote: "Bizler yıldız tozuyuz; evrenin kendi kendini düşünebilen, hissedebilen ve sevebilen nadir parçalarıyız.",
        author: "Carl Sagan",
        context: "Kozmos, insanın evrendeki yeri."
      }
    ],
    books: [
      {
        title: "Etika",
        author: "Baruch Spinoza",
        note: "Geometrik yöntemle kanıtlanmış, felsefe tarihinin en devrimci Tanrı ve doğa analizi."
      },
      {
        title: "Kozmos",
        author: "Carl Sagan",
        note: "Bilim ile şiirsel felsefeyi birleştiren, evrene duyulan huşuyu anlatan eser."
      },
      {
        title: "Walden",
        author: "Henry David Thoreau",
        note: "Doğanın kucağında sadeleşerek evrensel bilinçle bütünleşmenin günlüğü."
      }
    ],
    movies: [
      {
        title: "The Tree of Life",
        year: 2011,
        director: "Terrence Malick",
        note: "Mikrokozmos olan bir ailenin hüznü ile makrokozmos olan evrenin doğumunu birleştiren görsel senfoni."
      },
      {
        title: "Interstellar",
        year: 2014,
        director: "Christopher Nolan",
        note: "Zamanın ve uzayın büküldüğü yerde sevginin ve bilincin kozmik boyutunu anlatan başyapıt."
      }
    ]
  },

  "Taoizm / Akış ve Uyum": {
    id: "taoizm",
    name: "Taoizm / Akış ve Uyum",
    archetype: "AKIŞIN USTASI",
    motto: "Su gibi ol; engelle dövüşme, etrafından sakince ak.",
    extended_essay: [
      "Taoizm, kadim Çin'in en derin bilgelik yoludur. Laozi'nin ölümsüz metni Tao Te Ching, insanın hayatla sürekli bir çatışma ve kontrol savaşı içinde tükenmesini eleştirir. Tao, evrenin sessiz, görünmez ama her şeyi besleyen doğal akışıdır.",
      "Bu yolun anahtarı 'Wu Wei' yani çabasız eylemdir. Çabasız eylem tembellik değildir; rüzgara karşı koşmak yerine yelken açmak, suyun akıntısıyla kavga etmek yerine onun enerjisini kullanarak ilerlemektir.",
      "Zıtlıkların birliği (Yin ve Yang) hayatın temelidir. Gece olmadan gündüz, keder olmadan neşe var olamaz. Akışın Ustası, her şeyi kontrol etme kibrini bırakıp varoluşun bilgeliğine güvenen kişidir."
    ],
    quotes: [
      {
        quote: "Dünyada sudan daha yumuşak ve esnek hiçbir şey yoktur; fakat sert ve katı olan ne varsa onu aşındırmakta suyun üstüne yoktur.",
        author: "Laozi",
        context: "Tao Te Ching, suyun yenilmez yumuşaklığı."
      },
      {
        quote: "Rüzgar estiğinde kamış eğilir ve fırtına bittiğinde dimdik kalır; oysa sert meşe ağacı kökünden sökülür.",
        author: "Zhuangzi",
        context: "Esnekliğin ve uyumun gücü."
      },
      {
        quote: "Zihnini boşalt, formsuz ve şekilsiz ol, tıpkı su gibi.",
        author: "Bruce Lee",
        context: "Tao felsefesinin pratik hayata yansıması."
      }
    ],
    books: [
      {
        title: "Tao Te Ching",
        author: "Laozi",
        note: "81 kısa şiirde evrenin sırlarını ve dingin yaşamın anahtarlarını fısıldayan kadim metin."
      },
      {
        title: "Zhuangzi",
        author: "Zhuangzi",
        note: "Mizah, zeka ve rüya anlatılarıyla insan zihninin prangalarını çözen şaheser."
      },
      {
        title: "Zen ve Motosiklet Bakım Sanatı",
        author: "Robert M. Pirsig",
        note: "Nitelik arayışını ve akış halinde bir yaşamı anlatan modern felsefi yolculuk."
      }
    ],
    movies: [
      {
        title: "The Big Lebowski",
        year: 1998,
        director: "Coen Kardeşler",
        note: "Modern dünyada bir 'Dude' olarak telaşsız kalabilmenin çağdaş Taoist alegorisi."
      },
      {
        title: "Soul",
        year: 2020,
        director: "Pete Docter",
        note: "Hayatın amacının bir hedef peşinde tükenmek değil, anın akışında olmak olduğunu fısıldayan film."
      }
    ]
  },

  "Absürdizm / Başkaldırı": {
    id: "absurdizm",
    name: "Absürdizm / Başkaldırı",
    archetype: "ABSÜRT İSYANKAR",
    motto: "Evren sessiz ve anlamsız olabilir; fakat biz inadına tutkuyla yaşamaya devam edeceğiz.",
    extended_essay: [
      "Albert Camus'nün mimarı olduğu Absürdizm, insanın anlam arayan susuzluğu ile evrenin sağır ve duygusuz sessizliği arasındaki trajik çatışmadan doğar. Bu uyumsuzluk 'Absürt' olarak adlandırılır.",
      "Nihilizm bu anlamsızlık karşısında çöker ve pes eder; oysa Absürdizm intiharı bir teslimiyet sayar ve reddeder. Camus'ye göre yapılacak tek soylu eylem başkaldırmaktır: Hayatın objektif bir anlamı olmadığını bilerek, inadına gülümsemek ve hayatı aşkla yaşamaktır.",
      "Kayayı tepeye çıkarıp tekrar aşağı yuvarlandığını gören Sisifos mutsuz değildir; Camus 'Sisifos'u mutlu hayal etmeliyiz' der. Çünkü kayayı tepeye her taşıyış, tanrıların ve anlamsızlığın karşısında insanın kendi iradesiyle kazandığı zaferdir."
    ],
    quotes: [
      {
        quote: "Hayatın anlamsız olduğunu bilmek, onun yaşamaya değmeyeceği anlamına gelmez; tam tersine, onu daha tutkuyla yaşamayı gerektirir.",
        author: "Albert Camus",
        context: "Sisifos Söyleni, absürt başkaldırı."
      },
      {
        quote: "Kışın en şiddetli soğuğunda nihayet öğrendim ki, içimde yenilmez bir yaz hüküm sürüyor.",
        author: "Albert Camus",
        context: "Güz ve içsel direnç üzerine deneme."
      },
      {
        quote: "Başkaldırıyorum, o halde varız.",
        author: "Albert Camus",
        context: "Başkaldıran İnsan, dayanışma ve özgürlük."
      }
    ],
    books: [
      {
        title: "Sisifos Söyleni",
        author: "Albert Camus",
        note: "Absürt felsefenin manifestosu; intiharı reddeden yaşama sevinci."
      },
      {
        title: "Yabancı",
        author: "Albert Camus",
        note: "Toplumun sahte ahlak kurallarına uymayı reddeden Meursault'nun çarpıcı hikayesi."
      },
      {
        title: "Tatar Çölü",
        author: "Dino Buzzati",
        note: "Bir kalenin ucunda ömür boyu gelmeyen bir savaşı bekleyen insanın varoluşsal trajedisi."
      }
    ],
    movies: [
      {
        title: "Everything Everywhere All at Once",
        year: 2022,
        director: "Daniel Kwan, Daniel Scheinert",
        note: "Sonsuz evrenlerde hiçbir şeyin önemi olmasa bile, birbirimize sarılmanın gücünü anlatan çılgın bir başyapıt."
      },
      {
        title: "The Truman Show",
        year: 1998,
        director: "Peter Weir",
        note: "Sahte bir dekorun ortasında hakikati arayan ve kapıyı açıp fırtınaya gülümseyerek çıkan insanın isyanı."
      }
    ]
  },

  "Varoluşçuluk / Radikal Özgürlük": {
    id: "varolusculuk",
    name: "Varoluşçuluk / Radikal Özgürlük",
    archetype: "ÖZGÜR VAROLUŞÇU",
    motto: "Varoluş özden önce gelir; sen doğduğun kalıp değil, yaptığın seçimlerin toplamısın.",
    extended_essay: [
      "Varoluşçuluk (Egzistansiyalizm), insanın hazır bir kullanma kılavuzuyla dünyaya gelmediğini savunur. Bir masa yapılmadan önce zihinde tasarlanır (özü varoluşundan öncedir). Fakat insan önce var olur, dünyaya fırlatılır ve kendi özünü eylemleriyle adım adım bizzat inşa eder.",
      "Jean-Paul Sartre'ın dediği gibi 'İnsan özgürlüğe mahkûmdur.' Çünkü bir kez dünyaya atıldıktan sonra yaptığı her tercihten, aldığı her karardan ve almadığı kararlardan yalnızca kendisi sorumludur.",
      "Bu arketip kaderciliğin, mazeretlerin ve 'şartlar böyle gerektirdi' bahanelerinin arkasına saklanmaz. Kendi kimliğini, ahlakını ve rotasını kendi elleriyle çizen cesur ruhların durağıdır."
    ],
    quotes: [
      {
        quote: "İnsan, kendi kendini ne yaparsa ancak o'dur.",
        author: "Jean-Paul Sartre",
        context: "Varoluşçuluk Bir İnsancıllıktır, temel varoluşsal önerme."
      },
      {
        quote: "Kadın doğulmaz, kadın olunur.",
        author: "Simone de Beauvoir",
        context: "İkinci Cinsiyet, toplumsal rollerin yapaylığı ve özgürleşme."
      },
      {
        quote: "Kaygı, özgürlüğün baş dönmesidir.",
        author: "Søren Kierkegaard",
        context: "Kaygı Kavramı, insanın sınırsız olasılıklar karşısındaki titreyişi."
      }
    ],
    books: [
      {
        title: "Bulantı",
        author: "Jean-Paul Sartre",
        note: "Varlığın çıplak gerçekliğiyle yüzleşen bir zihnin varoluşsal uyanışı."
      },
      {
        title: "İkinci Cinsiyet",
        author: "Simone de Beauvoir",
        note: "Özgürlüğün ve toplumsal kimliğin inşa edilişini ele alan anıtsal felsefi inceleme."
      },
      {
        title: "Korku ve Titreme",
        author: "Søren Kierkegaard",
        note: "Bireyin inanç ve ahlak sınırlarında tek başına yaptığı dramatik sıçrayış."
      }
    ],
    movies: [
      {
        title: "Birdman",
        year: 2014,
        director: "Alejandro G. Iñárritu",
        note: "Geçmişin şöhret maskesini yırtıp sahnede kendi gerçek varoluşunu kanıtlamaya çalışan bir aktörün trajedisi."
      },
      {
        title: "Ikiru",
        year: 1952,
        director: "Akira Kurosawa",
        note: "Ömrünün son aylarında olduğunu öğrenen bir bürokratın ilk kez gerçekten yaşamaya başlamasının öyküsü."
      }
    ]
  },

  "Sinik Felsefe / Yalın Doğallık": {
    id: "sinizm",
    name: "Sinik Felsefe / Yalın Doğallık",
    archetype: "KİNİK BOHEM",
    motto: "Gölge etme, başka ihsan istemem; en az şeye muhtaç olan, tanrılara en yakın olandır.",
    extended_essay: [
      "Sinoplu Diyojen ve hocası Antisthenes ile başlayan Sinik (Kinik) felsefe, insanlığın medeniyet adı altında kurduğu sahte hiyerarşileri, mülkiyet hırsını ve iki yüzlü görgü kurallarını yerle bir eder.",
      "Diyojen bir fıçının içinde yaşar, tek bir tahta çanağı vardır ve bir çocuğun avucuyla su içtiğini görünce o çanağı da atar: 'Bir çocuk bana hala gereksiz eşyam olduğunu öğretti.'",
      "Bu felsefe toplumdan alkış dilenmez. Şöhretin, markaların ve yapay unvanların insanı köleleştirdiğini savunur. En büyük zenginlik, hiçbir şeye ihtiyaç duymama özgürlüğüdür."
    ],
    quotes: [
      {
        quote: "Gölge etme, başka ihsan istemem.",
        author: "Sinoplu Diyojen",
        context: "Büyük İskender'in 'Benden ne dilersen dile' teklifine verdiği yanıt."
      },
      {
        quote: "Gündüz vakti elimde fenerle dolaşıyorum çünkü dürüst ve sahici bir insan arıyorum.",
        author: "Sinoplu Diyojen",
        context: "Atina sokaklarında toplumun riyakarlığını yüzüne vuran eylem."
      },
      {
        quote: "Köpekler kendilerini besleyenleri yalar, ısıranlara havlar; ben ise uyuyanları uyandırmak için havlıyorum.",
        author: "Antisthenes",
        context: "Sinik adının (köpeksi bilgelik) kökeni."
      }
    ],
    books: [
      {
        title: "Diyojen ve Kinikler",
        author: "Diogenes Laertios",
        note: "Antik çağın en pervasız ve özgür filozoflarının hayatı ve çarpıcı anekdotları."
      },
      {
        title: "Aylaklığa Övgü",
        author: "Bertrand Russell",
        note: "Modern çalışma çılgınlığını ve tüketim hırsını eleştiren zarif felsefi denemeler."
      },
      {
        title: "Vahşetin Çağrısı",
        author: "Jack London",
        note: "Yapay evcilleşmeyi kırıp doğanın saf gücüne dönen bir varlığın destanı."
      }
    ],
    movies: [
      {
        title: "Into the Wild",
        year: 2007,
        director: "Sean Penn",
        note: "Toplumun kariyer ve para prangalarını kırıp Alaska'nın vahşi doğasında özgürlüğü arayan Christopher McCandless."
      },
      {
        title: "Captain Fantastic",
        year: 2016,
        director: "Matt Ross",
        note: "Çocuklarını kapitalist tüketim düzeninden uzakta, doğayla ve felsefeyle yetiştiren bir babanın hikayesi."
      }
    ]
  },

  "Budizm / İçsel Uyanış": {
    id: "budizm",
    name: "Budizm / İçsel Uyanış",
    archetype: "İÇSEL GEZGİN",
    motto: "Zihnin sakinleştiğinde bütün evren seninle birlikte dinginleşir.",
    extended_essay: [
      "Siddhartha Gautama'nın aydınlanmasıyla doğan Budizm, sarayların zenginliğini terk edip insan ızdırabının (Dukkha) köklerini arayan bir yolculuktur. Gautama, acının kaynağının dış dünyadaki olaylar değil; geçici şeylere duyduğumuz bağımlılık ve tutku (Tanha) olduğunu keşfetti.",
      "Her şey sürekli değişir (Anicca). Bir nehirde iki kez yıkanamayacağın gibi, dünkü senle bugünkü sen de aynı değildir. Benlik dediğin şey katı bir kaya değil, geçici düşüncelerin bir nehridir.",
      "Sekiz Katlı Asil Yol ile zihni arındırmak, geçmişin pişmanlıklarını ve geleceğin kaygılarını bırakıp 'Şimdi ve Burada' uyanmak, Nirvana'nın yani arzuların ateşinin sönmesinin kapısıdır."
    ],
    quotes: [
      {
        quote: "Zihnimiz her şeydir; ne düşünürsek o oluruz. Saf bir zihinle konuşan ya da davranan kişiyi, hiç ayrılmayan gölgesi gibi mutluluk izler.",
        author: "Siddhartha Gautama (Buda)",
        context: "Dhammapada, düşüncenin yaratıcı gücü."
      },
      {
        quote: "Seni öfkelendiren birine tutunduğunda, başkasına atmak için elinde tuttuğun kor ateş gibidir; yanan yalnızca kendi elindir.",
        author: "Buda",
        context: "Affetme ve öfkeyi serbest bırakma üzerine."
      },
      {
        quote: "Geçmiş çoktan gitti, gelecek ise henüz doğmadı; hayatın gerçekleştiği tek bir yer var, o da şu an.",
        author: "Thich Nhat Hanh",
        context: "Farkındalık (Mindfulness) meditasyonu."
      }
    ],
    books: [
      {
        title: "Siddhartha",
        author: "Hermann Hesse",
        note: "Kendi içsel aydınlanmasını nehir kenarında arayan bir ruhun şiirsel başyapıtı."
      },
      {
        title: "Dhammapada",
        author: "Buda'nın Sözleri",
        note: "Zihni terbiye etmenin ve içsel barışa ulaşmanın kadim aforizmaları."
      },
      {
        title: "Şimdinin Gücü",
        author: "Eckhart Tolle",
        note: "Zihinsel gürültüyü susturup anın sonsuzluğunda yaşamayı öğreten çağdaş kılavuz."
      }
    ],
    movies: [
      {
        title: "Samsara",
        year: 2011,
        director: "Ron Fricke",
        note: "Hiçbir kelime kullanılmadan dünyanın döngüsünü, insanın yanılsamasını ve ruhsal derinliği anlatan görsel şölen."
      },
      {
        title: "Spring, Summer, Fall, Winter... and Spring",
        year: 2003,
        director: "Kim Ki-duk",
        note: "Yüzen bir göl tapınağında mevsimlerle birlikte insanın günahlarını, tövbesini ve aydınlanışını anlatan meditasyon."
      }
    ]
  },

  "Nihilizm / Kozmik Boşluk": {
    id: "nihilizm",
    name: "Nihilizm / Kozmik Boşluk",
    archetype: "HİÇLİK YOLCUSU",
    motto: "Uçuruma uzun süre bakarsan, uçurum da senin içine bakar.",
    extended_essay: [
      "Nihilizm, insanlığın binlerce yıldır kendisine teselli bulmak için uydurduğu bütün metafizik kurguları, ilahi ödülleri ve sahte ahlak zincirlerini acımasızca yıkan en radikal şüphecilik zirvesidir.",
      "Friedrich Nietzsche ve Emil Cioran'ın satırlarında yankılanan bu ses, evrenin insan için yaratılmadığını, arkasında gizli bir senaryo olmadığını ve ölümden sonra bizi bekleyen hiçbir mahkemenin bulunmadığını ilan eder.",
      "Bu gerçek ilk bakışta karanlık ve soğuk gelebilir. Ancak sahte umutlardan arınmak, insanın kendi hayatının sorumluluğunu tamamen üstlenmesine ve gerçeğin çıplak trajedisiyle cesurca yüzleşmesine imkan tanır."
    ],
    quotes: [
      {
        quote: "Eğer çok uzun süre bir uçuruma bakarsan, uçurum da senin içine bakar.",
        author: "Friedrich Nietzsche",
        context: "İyinin ve Kötünün Ötesinde, karanlıkla yüzleşen ruhun dönüşümü."
      },
      {
        quote: "Sadece var olmanın bile bir bedeli vardır; doğmuş olmanın sakıncasını telafi edebilecek hiçbir teselli yoktur.",
        author: "Emil Cioran",
        context: "Doğmuş Olmanın Sakıncası Üzerine."
      },
      {
        quote: "Yaşamak acı çekmektir; hayatta kalmak ise bu acıda bir anlam bulabilmektir.",
        author: "Viktor Frankl",
        context: "İnsanın Anlam Arayışı, nihilizmin sınırında duruş."
      }
    ],
    books: [
      {
        title: "Böyle Buyurdu Zerdüşt",
        author: "Friedrich Nietzsche",
        note: "Tanrı'nın ölümünden sonra Üstinsan'a ve kendi değerlerini yaratmaya uzanan felsefi destan."
      },
      {
        title: "Çürümenin Kitabı",
        author: "Emil Cioran",
        note: "İnsanlığın yanılsamalarını cerrah neşteri gibi deşen aforizmalar silsilesi."
      },
      {
        title: "İnsanın Anlam Arayışı",
        author: "Viktor E. Frankl",
        note: "Toplama kamplarının mutlak hiçliğinde bile insanın koruyabileceği son özgürlüğü anlatan eser."
      }
    ],
    movies: [
      {
        title: "Fight Club",
        year: 1999,
        director: "David Fincher",
        note: "Tüketim toplumunun sahte kimliklerini yıkarak dip noktasına inmeyi ve sıfırlanmayı anlatan kült film."
      },
      {
        title: "Melancholia",
        year: 2011,
        director: "Lars von Trier",
        note: "Dünyaya çarpmak üzere olan dev bir gezegen karşısında insan dramlarının anlamsızlığını resmeden başyapıt."
      }
    ]
  },

  "Sufizm / Evrensel Mistisizm": {
    id: "sufizm",
    name: "Sufizm / Evrensel Mistisizm",
    archetype: "AŞKIN DERVİŞ",
    motto: "Aşk bir yolculuktur; menzil ise bizzat arayanın kendi kalbidir.",
    extended_essay: [
      "Tasavvuf (Sufizm), kuru teolojik tartışmaların ve şekilci kuralların ötesine geçerek, Yaratan ile yaratılan arasında doğrudan, coşkulu ve yakıcı bir aşk bağı kurmayı amaçlayan Doğu'nun mistik zirvesidir.",
      "Hallac-ı Mansur'un 'Ene'l-Hakk' (Ben Hakikatim) feryadında, Mevlânâ'nın sema dönüşünde ve Şems'in yakıcı sohbetinde hedeflenen tek bir şey vardır: Egoyu (Nefs) eritip yok etmek (Fena) ve mutlak Birlik'te (Beka) yeniden doğmaktır.",
      "Bu yol yargılamaz, dışlamaz. 'Ne olursan ol yine gel' çağrısı, her varlıkta ilahi sevgilinin yüzünü görebilen bir kalp terbiyesidir."
    ],
    quotes: [
      {
        quote: "Dün akıllıydım, dünyayı değiştirmek istedim. Bugün bilgeyim, kendimi değiştiriyorum.",
        author: "Mevlânâ Celâleddîn-i Rûmî",
        context: "İçsel dönüşümün ve olgunlaşmanın özeti."
      },
      {
        quote: "Ben hakikatim! Eğer beni asarsanız, dökülen kanımın toprağa Hak yazdığını göreceksiniz.",
        author: "Hallac-ı Mansur",
        context: "Vahdet-i Vücud sarhoşluğu ve ilahi aşk."
      },
      {
        quote: "Hakk'ı uzaklarda arama; aradığın şey senin kendi kalbinde saklıdır.",
        author: "Yunus Emre",
        context: "Gönül felsefesi ve insanın ilahi özü."
      }
    ],
    books: [
      {
        title: "Divan-ı Kebir",
        author: "Mevlânâ Celâleddîn-i Rûmî",
        note: "Aşkın, vecdin ve kozmik sarhoşluğun dizelere döküldüğü devasa şiir denizi."
      },
      {
        title: "Mantıku't-Tayr (Kuşların Dili)",
        author: "Ferîdüddin Attâr",
        note: "Simurg'u aramak için yola çıkan kuşların kendi içlerindeki sırra uyanış hikayesi."
      },
      {
        title: "Füsûsu'l-Hikem",
        author: "İbnü'l-Arabî",
        note: "Peygamberlerin hikmetleri üzerinden varlığın birliğini anlatan tasavvuf metafiziği."
      }
    ],
    movies: [
      {
        title: "Bab'Aziz: The Prince That Contemplated His Soul",
        year: 2005,
        director: "Nacer Khemir",
        note: "Kör bir derviş ile küçük torununun çölde dervişlerin 30 yılda bir toplanacağı gizemli buluşmaya yolculuğu."
      },
      {
        title: "The Color of Pomegranates",
        year: 1969,
        director: "Sergei Parajanov",
        note: "Bir şairin manevi gelişimini tablolarla anlatan büyüleyici sinematografik şiir."
      }
    ]
  },

  "Alevi-Bektaşi Geleneği / İnsan-ı Kâmil": {
    id: "bektasi",
    name: "Alevi-Bektaşi Geleneği / İnsan-ı Kâmil",
    archetype: "GÖNÜL İNSANI",
    motto: "Hararet nardadır sacda değildir, keramet baştadır tacda değildir; her ne ararsan kendinde ara.",
    extended_essay: [
      "Anadolu'nun bağrında yoğrulan Alevi-Bektaşi geleneği, Tanrı'yı ötelerde, göklerin erişilmez katlarında değil; insanın tertemiz vicdanında ve cemalin aynasında arayan hümanist bir mistisizmdir.",
      "Hacı Bektaş Veli, Yunus Emre ve Pir Sultan Abdal gibi öncüler, yetmiş iki millete aynı gözle bakmayı erdem saymıştır. Cami ya da kilise gibi taş yapılar değil, asıl kıble kırmadığın bir insanın kalbidir.",
      "İnsan-ı Kâmil (olgun insan) mertebesi; eline, beline, diline sahip çıkarak kin gütmeden, sevgiyle ve paylaşarak yaşamanın adıdır."
    ],
    quotes: [
      {
        quote: "Hararet nardadır sacda değildir, keramet baştadır tacda değildir. Her ne ararsan kendinde ara, Kudüs'te Mekke'de Hac'da değildir.",
        author: "Hacı Bektaş Veli",
        context: "Makalat, insanın kutsallığı ve hakikatin kalpte oluşu."
      },
      {
        quote: "Cümleler doğrudur sen doğru isen, doğruluk bulunmaz sen eğri isen.",
        author: "Yunus Emre",
        context: "Kişisel ahlak ve vicdani ayna."
      },
      {
        quote: "Bozuk düzende sağlam çark olmaz.",
        author: "Pir Sultan Abdal",
        context: "Adaletsizliğe ve zulme karşı duruş."
      }
    ],
    books: [
      {
        title: "Makalat",
        author: "Hacı Bektaş Veli",
        note: "Dört kapı kırk makam felsefesiyle nefsi arındırıp hakikate ulaşmanın rehberi."
      },
      {
        title: "Risaletü'n-Nushiyye ve Divan",
        author: "Yunus Emre",
        note: "Türkçe felsefe ve şiirin zirvesi; sevgi ve kardeşlik manifestosu."
      },
      {
        title: "Anadolu Hümanizması",
        author: "Sabahattin Eyüboğlu",
        note: "Anadolu toprağındaki hoşgörü ve insan sevgisi geleneğinin felsefi kökleri."
      }
    ],
    movies: [
      {
        title: "Kış Uykusu",
        year: 2014,
        director: "Nuri Bilge Ceylan",
        note: "Anadolu'nun kışında insanın kendi kibriyle, vicdanıyla ve başkalarına bakışıyla acımasızca yüzleşmesi."
      },
      {
        title: "Yunus Emre: Aşkın Sesi",
        year: 2014,
        director: "Kürşat Kızbaz",
        note: "Taptuk Emre dergahında odun taşıyarak nefsini eriten Yunus'un aşk yolculuğu."
      }
    ]
  },

  "Deizm / Akılcı Yaratılış": {
    id: "deizm",
    name: "Deizm / Akılcı Yaratılış",
    archetype: "AKILCI MİMAR",
    motto: "Tanrı evrenin yasalarını kusursuz bir saat gibi kurmuştur; ona ulaşmanın yolu mucizeler değil, akıl ve bilimdir.",
    extended_essay: [
      "Aydınlanma Çağı'nın en güçlü felsefi hareketi olan Deizm, dogmatik dinlerin mucize iddialarını ve mitolojik anlatılarını sorgulayarak rasyonel bir Yaratıcı fikrine ulaşır.",
      "Voltaire ve Thomas Paine gibi düşünürlere göre, bir saatin varlığı nasıl ustasını kanıtlıyorsa, evrendeki yerçekimi, gezegen yörüngeleri ve matematiksel intizam da Yüce bir Aklın varlığını gösterir. Ancak bu Tanrı, yarattığı fizik kurallarını çiğneyip dünyevi işlere müdahale etmez.",
      "İbadet etmek tapınaklara kapanmak değil; doğayı keşfetmek, aklı kullanmak ve vicdanlı bir hayat sürmektir."
    ],
    quotes: [
      {
        quote: "Evren beni hayrete düşürüyor; bir saatin var olup da saatçisinin olmaması düşüncesini aklım almıyor.",
        author: "Voltaire",
        context: "Felsefe Sözlüğü, evrendeki düzen ve Yaratıcı."
      },
      {
        quote: "Benim kendi zihnim, benim kendi kilisemdir.",
        author: "Thomas Paine",
        context: "Akıl Çağı, dogmalardan bağımsız vicdan."
      },
      {
        quote: "Doğa yasaları Tanrı'nın matematiksel düşünceleridir.",
        author: "Isaac Newton",
        context: "Principia, evrenin mekanik nizamı."
      }
    ],
    books: [
      {
        title: "Akıl Çağı",
        author: "Thomas Paine",
        note: "Dogmaları sarsan ve saf ahlaka dayalı doğal dini savunan Aydınlanma manifestosu."
      },
      {
        title: "Felsefe Sözlüğü",
        author: "Voltaire",
        note: "Bağnazlığı, hoşgörüsüzlüğü ve kör inancı hicveden felsefe klasiği."
      },
      {
        title: "Candide",
        author: "Voltaire",
        note: "Kör iyimserliği alaya alıp 'Bahçemizi ekmek zorundayız' sonucuna varan hiciv şaheseri."
      }
    ],
    movies: [
      {
        title: "Contact",
        year: 1997,
        director: "Robert Zemeckis",
        note: "Bilim insanı Ellie Arroway'in evrenin derinliklerinden gelen sinyaller peşinde akıl ile inancı sorgulayışı."
      },
      {
        title: "Agora",
        year: 2009,
        director: "Alejandro Amenábar",
        note: "İskenderiye kütüphanesinde astronomi ve matematik peşinde bağnazlığa direnen filozof Hypatia."
      }
    ]
  },

  "Şintoizm / Doğa Ruhlarının Uyumu": {
    id: "sintoizm",
    name: "Şintoizm / Doğa Ruhlarının Uyumu",
    archetype: "KUTSAL HARMONİ",
    motto: "Her dağda, nehirde ve esen rüzgarda canlı bir ruh (Kami) titreşir.",
    extended_essay: [
      "Japonya'nın kadim yerli inancı Şintoizm, katı kutsal kitaplar ya da dogmatik yasaklar yerine doğayla kurulan saf, hürmet dolu bir ilişkiye dayanır. Bu inançta doğadaki her varlıkta (bir şelale, kadim bir çam ağacı, bir fırtına) kutsal bir yaşam enerjisi yani 'Kami' bulunur.",
      "Hayat bir günah çıkarma yeri değil, arınma (Misogi) ve minnettarlık dansıdır. İnsan doğanın efendisi değil, onun binbir parçasından yalnızca biridir.",
      "Zihninin bu frekansta olması; senin yapay beton yapılar yerine temiz havaya, su sesine ve ormanın gizli fısıltılarına duyduğun derin özlemi ve saygıyı yansıtır."
    ],
    quotes: [
      {
        quote: "Doğaya saygı duymak, kendi atalarına ve kendi köklerine hürmet etmektir.",
        author: "Motoori Norinaga",
        context: "Kami yolunun kadim ilkeleri."
      },
      {
        quote: "Arınmış bir kalp, ayna gibidir; baktığında tanrıların doğadaki yüzünü görürsün.",
        author: "Kadim Kannushi Şinto Öğretisi",
        context: "Misogi ve içsel saflık."
      }
    ],
    books: [
      {
        title: "Kojiki",
        author: "O no Yasumaro",
        note: "Japon adalarının ve Kami ruhlarının doğumunu anlatan kadim mitoloji derlemesi."
      },
      {
        title: "Shinto: The Kami Way",
        author: "Sokyo Ono",
        note: "Şinto inancının tapınaklarını, ritüellerini ve doğa felsefesini anlatan temel kaynak."
      }
    ],
    movies: [
      {
        title: "Spirited Away (Ruhların Kaçışı)",
        year: 2001,
        director: "Hayao Miyazaki",
        note: "Nehir ruhlarının, orman perilerinin ve doğanın kirletilmesine karşı arınma arayışının büyüleyici başyapıtı."
      },
      {
        title: "Princess Mononoke",
        year: 1997,
        director: "Hayao Miyazaki",
        note: "Demir üreten sanayi şehri ile ormanın kutsal ruhları arasındaki kaçınılmaz savaşı ve denge arayışını anlatan efsane."
      }
    ]
  },

  "İşrakilik / Nur Felsefesi": {
    id: "israki",
    name: "İşrakilik / Nur Felsefesi",
    archetype: "IŞIK İŞRAKİSİ",
    motto: "Akıl bir kandildir; ancak sezginin ışığı (İşrak) olmadan karanlık aydınlanamaz.",
    extended_essay: [
      "Şehabeddin Sühreverdi tarafından temelleri atılan İşrakilik (Aydınlanma Felsefesi), rasyonel mantık ile içsel sezgiyi (Keşf) kusursuz bir uyumla birleştiren Doğu metafiziğidir.",
      "Bu felsefeye göre varoluş 'Nur'dur (Işık). Tanrı Nurlar Nuru'dur (Nurü'l-Envar). Varlıklar ışıktan aldıkları pay oranında var olurlar; karanlık ise bağımsız bir varlık değil, ışığın yokluğudur.",
      "Sadece kitap okuyarak hakikate varılamaz; zihnin arınması ve hakikatin doğrudan bir şimşek gibi kalbe doğması gerekir."
    ],
    quotes: [
      {
        quote: "Işık, kendi başına apaçık olan ve diğer her şeyi de görünür kılan yegane cevherdir.",
        author: "Şehabeddin Sühreverdi",
        context: "Hikmetü'l-İşrak, ışık ontolojisi."
      },
      {
        quote: "Rasyonel düşünce ile mistik tecrübe iki kanattır; tek kanatla hiçbir kuş göğe yükselemez.",
        author: "Molla Sadra",
        context: "Dört Sefer, akıl ve sezginin evliliği."
      }
    ],
    books: [
      {
        title: "Hikmetü'l-İşrak",
        author: "Şehabeddin Sühreverdi",
        note: "Işık metafiziğinin ve sezgisel aydınlanmanın kurucu felsefi metni."
      },
      {
        title: "İslam Felsefesi Tarihi",
        author: "Henry Corbin",
        note: "İşraki felsefenin ve Doğu ışığının derin analizini sunan anıtsal çalışma."
      }
    ],
    movies: [
      {
        title: "Stalker",
        year: 1979,
        director: "Andrei Tarkovsky",
        note: "İnsanın en derin arzusunun gerçekleştiği gizemli 'Oda'ya uzanan metafizik ve felsefi yolculuk."
      },
      {
        title: "The Fountain",
        year: 2006,
        director: "Darren Aronofsky",
        note: "Ölümsüzlüğü, aşkı ve ışığa dönüşmeyi bin yıllık üç ayrı zaman diliminde anlatan mistik film."
      }
    ]
  },

  "Pragmatizm / Yaşamsal Eylem": {
    id: "pragmatizm",
    name: "Pragmatizm / Yaşamsal Eylem",
    archetype: "PRAGMATİK EYLEMCİ",
    motto: "Bir fikrin değeri, kütüphanedeki soyutluğunda değil; hayatta yarattığı somut meyvede saklıdır.",
    extended_essay: [
      "William James ve John Dewey'in geliştirdiği Pragmatizm, felsefeyi fildişi kulelerden indirip sokağa, laboratuvara ve gerçek insan hayatının krizlerine taşır.",
      "Pragmatizme göre 'Hakikat nedir?' sorusunun tek bir soyut cevabı olamaz. Bir inancın, teorinin ya da ahlaki kuralın doğru olup olmadığını anlamak için onun hayattaki pratik sonuçlarına bakmak gerekir: Bu inanç senin hayatını daha anlamlı, daha üretken ve daha iyi kılıyor mu?",
      "Boş spekülasyonlarla ömür tüketmek yerine, çözümler üreten ve aksiyona geçen sağlam iradelerin felsefesidir."
    ],
    quotes: [
      {
        quote: "Hakikat, başına bir olay gelen bir fikirdir; eyleme dökülür ve kendisini doğrular.",
        author: "William James",
        context: "Pragmatizm, bilginin pratik doğrulanışı."
      },
      {
        quote: "Felsefe, filozofların özel problemlerini çözmek için değil; insanların hayat problemlerini çözmek içindir.",
        author: "John Dewey",
        context: "Yeniden Yapılanma, felsefenin toplumsal işlevi."
      }
    ],
    books: [
      {
        title: "Pragmatizm",
        author: "William James",
        note: "İnançların yaşamsal değerini ve eyleme dönük felsefeyi anlatan klasik."
      },
      {
        title: "Deneyim ve Doğa",
        author: "John Dewey",
        note: "İnsan tecrübesinin doğayla ve toplumla kurduğu yaşayan ilişki."
      }
    ],
    movies: [
      {
        title: "Oppenheimer",
        year: 2023,
        director: "Christopher Nolan",
        note: "Soyut kuantum teorilerinin somut bir dünya krizinde nelere yol açabileceğini gösteren dramatik başyapıt."
      },
      {
        title: "Cast Away",
        year: 2000,
        director: "Robert Zemeckis",
        note: "Issız bir adada soyut bilgilerin değil, somut çözümlerin ve yaşama tutunma eyleminin gücü."
      }
    ]
  },

  "Solipsizm / Bilinç Aynası": {
    id: "solipsizm",
    name: "Solipsizm / Bilinç Aynası",
    archetype: "YALNIZ BİLİNÇ",
    motto: "Düşünüyorum, öyleyse varım; fakat zihnimin ötesinde bir evrenin var olduğunu kim garanti edebilir?",
    extended_essay: [
      "Solipsizm (Tekbencilik) ve epistemolojik radikal şüphe, felsefenin en cesur ve baş döndürücü sorusunu sorar: Gördüğün renkler, dokunduğun masalar ve konuştuğun insanlar gerçekten dışarıda var mıdır, yoksa sadece senin bilincinin ürettiği kusursuz bir simülasyon mudur?",
      "René Descartes'ın kötü cin şüphesiyle başlayan bu hat, George Berkeley'in 'Var olmak algılanmaktır' ilkesine kadar uzanır. Emin olabileceğin tek mutlak hakikat vardır: Şu anda düşünen ve hisseden bir bilincin var olduğu.",
      "Bu zihniyet, sürü psikolojisini ve dış dünyanın dayattığı dogmaları kökten sorgular; kendi iç dünyasını evrenin tek sahici laboratuvarı kabul eder."
    ],
    quotes: [
      {
        quote: "Düşünüyorum, öyleyse varım.",
        author: "René Descartes",
        context: "Metot Üzerine Konuşma, sarsılmaz ilk kesinlik."
      },
      {
        quote: "Algılanmak, var olmaktır (Esse est percipi).",
        author: "George Berkeley",
        context: "İnsan Bilgisinin İlkeleri, idealizm."
      }
    ],
    books: [
      {
        title: "Metafizik Üzerine Düşünceler",
        author: "René Descartes",
        note: "Tüm dünyadan şüphe ederek kendi bilincinin sarsılmaz temeline ulaşma macerası."
      },
      {
        title: "Bir Delinin Hatıra Defteri",
        author: "Nikolay Gogol",
        note: "Gerçeklik ile zihinsel kurgu arasındaki sınırın silikleştiği sarsıcı klasik."
      }
    ],
    movies: [
      {
        title: "The Matrix",
        year: 1999,
        director: "Wachowski Kardeşler",
        note: "Gördüğün dünyanın gerçek olup olmadığını ve kırmızı hapın cesaretini sorgulatan sinema dönüm noktası."
      },
      {
        title: "Inception",
        year: 2010,
        director: "Christopher Nolan",
        note: "Rüyalar içinde rüyalar kurarken gerçekliğin tek kanıtı olarak bir topacın dönüşüne sığınmak."
      }
    ]
  }
};

// Yedek / Genel Çözümleyici
export const getPhilosophyDeepDive = (beliefName: string, archetype?: string): PhilosophyDetail => {
  // 1. Tam inanç ismiyle eşleştir
  if (PHILOSOPHY_DETAILS[beliefName]) {
    return PHILOSOPHY_DETAILS[beliefName];
  }

  // 2. Kısmi inanç ismi eşleştir
  for (const key of Object.keys(PHILOSOPHY_DETAILS)) {
    if (beliefName && (beliefName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(beliefName.toLowerCase()))) {
      return PHILOSOPHY_DETAILS[key];
    }
  }

  // 3. Arketip ile eşleştir
  if (archetype) {
    const archUpper = archetype.toUpperCase();
    for (const item of Object.values(PHILOSOPHY_DETAILS)) {
      if (item.archetype.toUpperCase() === archUpper || archUpper.includes(item.archetype.toUpperCase())) {
        return item;
      }
    }
  }

  // 4. Varsayılan zengin edebi felsefi portre (Hiçlik Yolcusu / Stoacı harman)
  return PHILOSOPHY_DETAILS["Stoacılık / Rasyonel İrade"];
};
