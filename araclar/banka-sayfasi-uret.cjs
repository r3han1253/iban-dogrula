// banka-kodlari.html dosyasını app.js içindeki BANKALAR listesinden üretir.
// Kullanım (proje kökünden): node araclar/banka-sayfasi-uret.cjs
// BANKALAR değişince ya da logolar/ klasörüne logo eklenince yeniden çalıştırın.
const fs = require("fs");
const path = require("path");

const kok = path.join(__dirname, "..");
const uygulama = fs.readFileSync(path.join(kok, "app.js"), "utf8");

// Tek kaynak: app.js'teki BANKALAR ve basHarfler (rozet için)
const bankalarMetni = uygulama.slice(uygulama.indexOf("const BANKALAR"), uygulama.indexOf("};") + 2);
const basHarflerMetni = uygulama.slice(uygulama.indexOf("function basHarfler"), uygulama.indexOf("// Logo: logolar/"));
const { BANKALAR, basHarfler } = new Function(bankalarMetni + "\n" + basHarflerMetni + "\nreturn { BANKALAR, basHarfler };")();

const kacis = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const SITE = "https://r3han1253.github.io/TRIBAN-KONTROL/";
const SURUM = "20261122c";

const kodlar = Object.keys(BANKALAR).sort();
const satirlar = kodlar.map(kod => {
  const ad = BANKALAR[kod];
  const logoVar = fs.existsSync(path.join(kok, "logolar", kod + ".png"));
  const gorsel = logoVar
    ? `<img src="logolar/${kod}.png" alt="${kacis(ad)} logosu" width="44" height="44" loading="lazy">`
    : `<span class="rozet-kucuk" aria-hidden="true">${kacis(basHarfler(ad))}</span>`;
  return `          <tr data-ara="${kacis((kod + " " + ad).toLocaleLowerCase("tr"))}"><td class="logo-hucre">${gorsel}</td><td class="mono">${kod}</td><td>${kacis(ad)}</td></tr>`;
});

const sss = [
  ["IBAN'dan banka kodu nasıl bulunur?", "Türkiye IBAN'ı 26 karakterdir. İlk 2 karakter ülke kodu (TR), sonraki 2 karakter kontrol numarasıdır. Banka kodu IBAN'ın 5. ile 9. hanelerindeki 5 haneli sayıdır. Örneğin TR71 0006 7012 3456 7890 1234 56 numarasında banka kodu 00067'dir."],
  ["Banka kodu ile EFT kodu aynı mıdır?", "Hayır. IBAN içindeki 5 haneli banka kodu, TCMB'nin ödeme sistemleri katılımcı listesindeki koddur. EFT, SWIFT ve şube kodları farklı numaralardır."],
  ["Bu liste ne kadar günceldir?", "Liste TCMB'nin ödeme sistemleri katılımcıları 2026 listesine dayanır (18.09.2026 güncellemesi)."]
];

const jsonld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "IBAN Doğrula", item: SITE },
        { "@type": "ListItem", position: 2, name: "Türkiye banka kodları", item: SITE + "banka-kodlari.html" }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: sss.map(([s, c]) => ({ "@type": "Question", name: s, acceptedAnswer: { "@type": "Answer", text: c } }))
    }
  ]
};

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Güvenlik: yalnızca bu sitenin dosyaları ve Cloudflare sayacı çalışabilir -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' data:; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'self'">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>Türkiye Banka Kodları Listesi (IBAN Banka Kodu) – IBAN Doğrula</title>
  <meta name="description" content="Türkiye'deki ${kodlar.length} bankanın IBAN banka kodları: Ziraat, Halkbank, İş Bankası, Garanti BBVA, Akbank, Yapı Kredi ve diğerleri. IBAN'ın 5.–9. hanelerindeki kod hangi bankaya ait, hemen bulun.">
  <link rel="canonical" href="${SITE}banka-kodlari.html">
  <link rel="icon" type="image/png" href="logo.png">
  <link rel="apple-touch-icon" href="logo.png">
  <meta name="theme-color" content="#2563eb">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="IBAN Doğrula">
  <meta property="og:title" content="Türkiye Banka Kodları Listesi (IBAN Banka Kodu)">
  <meta property="og:description" content="IBAN'ın 5.–9. hanelerindeki banka kodu hangi bankaya ait? Tüm Türkiye banka kodları tek tabloda.">
  <meta property="og:url" content="${SITE}banka-kodlari.html">
  <meta property="og:image" content="${SITE}og-gorsel.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="IBAN Doğrula: Türkiye banka kodları listesi">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE}og-gorsel.png">

  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
  <script src="tema.js?v=20261120d"></script>
  <link rel="stylesheet" href="style.css?v=${SURUM}">
</head>
<body>
  <header>
    <a href="./" class="logo"><span class="site-adi">ibandogrula.com</span><img src="logo.png" alt="IBAN Doğrula ana sayfa" width="56" height="56"></a>
  </header>

  <main>
    <article class="yasal">
      <a href="./" class="geri">← IBAN Doğrula'ya dön</a>
      <h1>Türkiye Banka Kodları Listesi</h1>
      <p class="tarih">Kaynak: TCMB Ödeme Sistemleri Katılımcıları (2026), 18.09.2026 güncellemesi · ${kodlar.length} kod</p>

      <div class="ara-kutu">
        <label for="banka-ara">Banka adı ya da kodu ara</label>
        <input id="banka-ara" type="search" autocomplete="off" spellcheck="false" placeholder="Örn. Ziraat ya da 00010">
      </div>
      <p id="ara-sonuc" class="hint" role="status" aria-live="polite" hidden></p>

      <div class="tablo-kap tablo-uzun">
        <table class="kod-tablo">
          <thead><tr><th><span class="gizli">Logo</span></th><th>Banka kodu</th><th>Banka</th></tr></thead>
          <tbody id="banka-govde">
${satirlar.join("\n")}
          </tbody>
        </table>
      </div>

      <h2>Sık sorulan sorular</h2>
${sss.map(([s, c]) => `      <h3 class="soru">${kacis(s)}</h3>\n      <p>${kacis(c)}</p>`).join("\n")}

      <p class="ust-bosluk">Bu site hiçbir banka veya kamu kurumuyla bağlantılı değildir. Banka adları ve logoları sahiplerine aittir ve yalnızca bankayı tanıtmak için gösterilir. Liste bilgilendirme amaçlıdır.</p>
    </article>
  </main>

  <footer>
    <nav class="alt-baglantilar" aria-label="Site bağlantıları">
      <a href="./">Ana sayfa</a>
      <span aria-hidden="true">·</span>
      <a href="kvkk.html">KVKK Aydınlatma Metni</a>
    </nav>
    <p>&copy; 2026 IBAN Doğrula</p>
  </footer>

  <script src="banka-kodlari.js?v=${SURUM}"></script>
  <!-- Cloudflare Web Analytics: çerezsiz ziyaretçi sayacı -->
  <script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "cf7c5ec5392f4ba684692a2b5b3f1f00"}'></script>
</body>
</html>
`;

fs.writeFileSync(path.join(kok, "banka-kodlari.html"), html);
console.log("banka-kodlari.html yazıldı: " + kodlar.length + " banka, " + kodlar.filter(k => fs.existsSync(path.join(kok, "logolar", k + ".png"))).length + " logo.");
