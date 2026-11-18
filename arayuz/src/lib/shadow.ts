export interface ShadowParadox {
  title: string;
  subtitle: string;
  tension: string;
  analysis: string;
  advice: string;
}

export const analyzeShadowParadox = (v: number[]): ShadowParadox => {
  // v = [tektanricilik, rituelizm, olum_sonrasi, dogma, doga]
  const tek = v[0] ?? 0.5;
  const rit = v[1] ?? 0.5;
  const olum = v[2] ?? 0.5;
  const dogma = v[3] ?? 0.5;
  const doga = v[4] ?? 0.5;

  // 1. Paradoks: Düşük Dogma + Yüksek Ölüm Sonrası Sezgisi (Hüzünlü Materyalist)
  if (dogma <= 0.40 && (olum >= 0.58 || doga >= 0.70)) {
    return {
      title: "Hüzünlü Materyalist",
      subtitle: "Akıl ile Ruhun Çatışması",
      tension: "Rasyonalist Kuşku vs. Aşkınlık Özlemi",
      analysis:
        "Zihnin bilime ve somut gerçekliğe teslim; dogmatik masalları ve kör inançları net bir şekilde reddediyorsun. Fakat bilinçaltın ölüm karşısında yok oluş fikrini kabul etmekte zorlanıyor ve evrenle açıklanamaz bir kozmik bağ arıyor. Aklın 'madde biterse her şey biter' derken, içindeki bir ses evrenin bu kadar sıradan olamayacağını fısıldıyor.",
      advice: "Bu bir zayıflık değil, derin bir varoluşsal lütuftur. Bilimi aklının kılavuzu, doğanın gizemini ise kalbinin tapınağı yap."
    };
  }

  // 2. Paradoks: Düşük Tektanrıcılık + Yüksek Ritüel/Pratik (Dinsiz Derviş)
  if (tek <= 0.40 && (rit >= 0.55 || doga >= 0.65)) {
    return {
      title: "Dinsiz Derviş",
      subtitle: "Tanrısız Kutsallık Arayışı",
      tension: "Teolojik Bağımsızlık vs. Meditatif Ritüel İhtiyacı",
      analysis:
        "Geleneksel tanrı kavramına ve göksel bir yargıca inanmıyorsun; fakat bir tapınağın loş dinginliğini, tütsü kokusunu, meditatif derinliği ve doğayla bir olma ritüelini derinden arzuluyorsun. Kiliseye veya camiye değil, bizzat varoluşun kendi nefesine secde eden bir pagan duyarlılığı taşıyorsun.",
      advice: "İnançsız olmak ruhsuz olmak demek değildir. Kendi kişisel meditasyon ritüellerini ve orman yürüyüşlerini kutsal ibadetin olarak gör."
    };
  }

  // 3. Paradoks: Yüksek Kozmik Düzen + Sıfır Dogma (Spinoza'nın Gezgini)
  if (tek >= 0.55 && dogma <= 0.35) {
    return {
      title: "Spinoza'nın Gezgini",
      subtitle: "Kutsal Metinleri Yıkan Kozmik Mimar",
      tension: "Kozmik İntizam vs. Din Kurumuna İsyan",
      analysis:
        "Evrende akıl almaz bir geometri, matematiksel bir intizam ve yüksek bir zeka olduğunu seziyorsun. Fakat insanların yazdığı kutsal kitapları, cehennem tehditlerini ve kuralcı din adamlarını kesin bir tavırla reddediyorsun. Sen tanrıyı gökte bir kral değil, doğanın ve evrenin kendisi olarak görüyorsun.",
      advice: "Korku temelli dinlerin seni soğutmasına izin verme. Senin ibadetin, evrenin yasalarını anlamak ve doğanın ahengini seyretmektir."
    };
  }

  // 4. Paradoks: Mutlak Boşluk + Yüksek Yaşam Coşkusu (Absürdün Kahramanı)
  if (tek <= 0.35 && olum <= 0.35) {
    return {
      title: "Absürdün Kahramanı",
      subtitle: "Anlamsızlığa Rağmen Gülümseyen Bilinç",
      tension: "Hiçlik Gerçeği vs. Yaşama Tutkusu",
      analysis:
        "Evrenin soğuk, sessiz ve bize tamamen kayıtsız olduğunu biliyorsun. Ölümün nihai bir nokta olduğunun farkındasın. Fakat bu seni depresyona değil, inanılmaz bir özgürlüğe götürüyor. Albert Camus gibi, evrenin boşluğuna inat kendi ahlakını ve anlamını bir meşale gibi karanlığa dikiyorsun.",
      advice: "Anlam hazır verilmez; anlam bir sanat eseri gibi senin tarafında yaratılır. Boşluk senin tuvalindir, özgürce boya."
    };
  }

  // 5. Varsayılan Holistik Denge:
  return {
    title: "Kozmik Arayıcı",
    subtitle: "Zıt Kutupların Sessiz Simyası",
    tension: "Yeryüzü Maddesi vs. Göksel Sezgi",
    analysis:
      "Zihnin tek bir ideolojiye veya inanç kafesine sığmayı reddediyor. Bir yanın rasyonel ve kuşkucu, diğer yanın ise varoluşun ardındaki aşkın gizeme karşı derin bir hürmet besliyor. Kutuplar arasında salınmak seni kararsız değil, çok boyutlu ve bilge bir gözlemci kılıyor.",
    advice: "Kendini tek bir kalıba sokmaya zorlama. Sen sabit bir nokta değil, sürekli genişleyen bir kozmik nehirsin."
  };
};
