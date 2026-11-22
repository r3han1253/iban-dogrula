// Türkiye banka kodları (IBAN'ın 5.–9. haneleri)
// Kaynak: TCMB Ödeme Sistemleri Katılımcıları (2026) listesi, 18.09.2026 güncellemesi
const BANKALAR = {
  "00001": "T.C. Merkez Bankası",
  "00004": "İller Bankası",
  "00010": "Ziraat Bankası",
  "00012": "Halkbank",
  "00014": "Türkiye Sınai Kalkınma Bankası (TSKB)",
  "00015": "VakıfBank",
  "00016": "Türk Eximbank",
  "00017": "Türkiye Kalkınma ve Yatırım Bankası",
  "00029": "Birleşik Fon Bankası",
  "00032": "TEB (Türk Ekonomi Bankası)",
  "00046": "Akbank",
  "00059": "Şekerbank",
  "00060": "Türk Ticaret Bankası",
  "00062": "Garanti BBVA",
  "00064": "Türkiye İş Bankası",
  "00067": "Yapı Kredi",
  "00091": "Arap Türk Bankası",
  "00092": "Citibank",
  "00096": "Freedom Bank",
  "00098": "JPMorgan Chase Bank",
  "00099": "ING Bank",
  "00103": "Fibabanka",
  "00108": "Turkland Bank",
  "00109": "ICBC Turkey Bank",
  "00111": "QNB Finansbank",
  "00115": "Deutsche Bank",
  "00116": "Pasha Yatırım Bank",
  "00121": "Standard Chartered Yatırım Bankası",
  "00122": "Société Générale",
  "00123": "HSBC Bank",
  "00124": "Alternatifbank",
  "00125": "Burgan Bank",
  "00129": "Bank of America Yatırım Bank",
  "00132": "Takasbank (İstanbul Takas ve Saklama Bankası)",
  "00134": "DenizBank",
  "00135": "Anadolubank",
  "00137": "Hepsi Bank",
  "00138": "Diler Yatırım Bankası",
  "00139": "GSD Yatırım Bankası",
  "00141": "Nurol Yatırım Bankası",
  "00142": "BankPozitif",
  "00143": "Aktif Bank",
  "00146": "Odeabank",
  "00147": "MUFG Bank Turkey",
  "00148": "Intesa Sanpaolo",
  "00149": "Bank of China Turkey",
  "00151": "D Yatırım Bankası",
  "00152": "Destek Yatırım Bankası",
  "00153": "Misyon Yatırım Bankası",
  "00154": "Tera Yatırım Bankası",
  "00155": "Q Yatırım Bankası",
  "00156": "Hedef Yatırım Bankası",
  "00157": "Enpara Bank",
  "00158": "Colendi Bank",
  "00159": "Fups Bank",
  "00160": "Ziraat Dinamik Banka",
  "00161": "Aytemiz Yatırım Bankası",
  "00203": "Albaraka Türk Katılım Bankası",
  "00205": "Kuveyt Türk Katılım Bankası",
  "00206": "Türkiye Finans Katılım Bankası",
  "00209": "Ziraat Katılım Bankası",
  "00210": "Vakıf Katılım Bankası",
  "00211": "Emlak Katılım Bankası",
  "00212": "Hayat Finans Katılım Bankası",
  "00213": "T.O.M. Katılım Bankası",
  "00214": "Dünya Katılım Bankası",
  "00215": "Adil Katılım Bankası",
  "00216": "İktisat Katılım Bankası",
  "00806": "Merkezi Kayıt Kuruluşu (MKK)",
  "00807": "PTT"
};

function temizle(deger) {
  return deger.replace(/[\s-]/g, "").toUpperCase();
}

function grupla(iban) {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

// ISO 13616 mod 97: büyük sayıyı parça parça işleyerek kalanı hesaplar
function mod97(iban) {
  const duzenli = iban.slice(4) + iban.slice(0, 4);
  let sayisal = "";
  for (const ch of duzenli) {
    sayisal += /[A-Z]/.test(ch) ? (ch.charCodeAt(0) - 55).toString() : ch;
  }
  let kalan = 0;
  for (let i = 0; i < sayisal.length; i += 7) {
    kalan = Number(String(kalan) + sayisal.slice(i, i + 7)) % 97;
  }
  return kalan;
}

function kontrolEt(girdi) {
  const iban = temizle(girdi);
  const hatalar = [];

  // Kullanıcıya gösterilen, sade dilli hata açıklamaları
  if (!iban.startsWith("TR")) {
    hatalar.push("Bu bir Türkiye IBAN'ı değil. Türkiye'deki tüm IBAN'lar \"TR\" ile başlar.");
  } else if (!/^TR\d+$/.test(iban)) {
    hatalar.push("TR'den sonra yalnızca rakam olmalı. Numarada harf ya da özel bir karakter var.");
  }
  if (!iban.startsWith("TR")) {
    // Yabancı IBAN'da uzunluk mesajı yanıltıcı olur, gösterilmez
  } else if (iban.length < 26) {
    const eksik = 26 - iban.length;
    hatalar.push("IBAN eksik: " + iban.length + " karakter girdiniz, Türkiye IBAN'ı 26 karakterdir (" + eksik + " karakter eksik).");
  } else if (iban.length > 26) {
    const fazla = iban.length - 26;
    hatalar.push("IBAN fazla uzun: " + iban.length + " karakter girdiniz, Türkiye IBAN'ı 26 karakterdir (" + fazla + " karakter fazla).");
  }

  const yapiDogru = hatalar.length === 0;
  let kalan = null;
  if (yapiDogru) {
    kalan = mod97(iban);
    if (kalan !== 1) {
      hatalar.push("Numara hatalı yazılmış. Uzunluk doğru ama rakamlardan biri yanlış ya da iki rakamın yeri karışmış olabilir. IBAN'ı banka uygulamanızdan veya dekonttan tekrar kopyalayıp deneyin.");
    }
  }

  const bankaKodu = iban.slice(4, 9);
  return {
    iban,
    gecerli: hatalar.length === 0,
    hatalar,
    yapiDogru,
    kalan,
    kontrolHanesi: iban.slice(2, 4),
    bankaKodu,
    banka: BANKALAR[bankaKodu] || null,
    rezerv: iban.slice(9, 10),
    hesapNo: iban.slice(10)
  };
}

function basHarfler(ad) {
  const atla = ["T.C.", "Türkiye", "Bankası", "Bank", "Katılım", "Yatırım", "ve"];
  const kelimeler = ad.replace(/\(.*?\)/g, "").split(/\s+/).filter(k => k && !atla.includes(k));
  return (kelimeler.slice(0, 2).map(k => k[0]).join("") || "?").toUpperCase();
}

// Logo: logolar/<banka kodu>.png varsa gösterilir, yoksa baş harf rozeti kalır
function bankaKartiGoster(s) {
  const kart = document.getElementById("banka-kart");
  kart.innerHTML = "";
  // Geçersiz IBAN'da banka bilgisi gösterilmez (yalnızca hata görünür)
  if (!s.gecerli) { kart.style.display = "none"; return; }

  const ad = s.banka || "Bilinmeyen banka";
  const rozet = document.createElement("div");
  rozet.className = "rozet";
  rozet.textContent = s.banka ? basHarfler(ad) : "?";

  const yazi = document.createElement("div");
  yazi.className = "banka-ad";
  yazi.textContent = ad;

  kart.append(rozet, yazi);
  kart.style.display = "flex";

  if (s.banka) {
    const img = new Image();
    img.alt = ad + " logosu";
    img.onload = () => rozet.replaceWith(img);
    img.src = "logolar/" + s.bankaKodu + ".png";
  }
}

function goster(s) {
  const durum = document.getElementById("durum");
  const detay = document.getElementById("detay");

  durum.className = "durum " + (s.gecerli ? "gecerli" : "gecersiz");
  durum.innerHTML = "";
  durum.append(s.gecerli ? "✓ IBAN geçerli" : "✗ Bu IBAN geçersiz");
  if (s.hatalar.length === 1) {
    const p = document.createElement("p");
    p.className = "hata-aciklama";
    p.textContent = s.hatalar[0];
    durum.append(p);
  } else if (s.hatalar.length > 1) {
    const ul = document.createElement("ul");
    s.hatalar.forEach(h => {
      const li = document.createElement("li");
      li.textContent = h;
      ul.append(li);
    });
    durum.append(ul);
  }

  bankaKartiGoster(s);

  // Ayrıntı tablosu yalnızca geçerli IBAN'da gösterilir; geçersizde önceki bilgiler temizlenir
  const satirlar = [];
  if (s.gecerli) {
    satirlar.push(
      ["IBAN", grupla(s.iban), true],
      ["Banka", s.banka || "Bilinmeyen banka kodu", false],
      ["Banka kodu", s.bankaKodu, true],
      ["Hesap numarası", s.hesapNo, true]
    );
    if (s.rezerv !== "0") {
      satirlar.push(["Uyarı", "Rezerv hanesi normalde 0 olmalıdır (girilen: " + s.rezerv + ").", false]);
    }
  }

  detay.innerHTML = "";
  detay.hidden = satirlar.length === 0;
  satirlar.forEach(([ad, deger, mono]) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    td1.textContent = ad;
    td2.textContent = deger;
    if (mono) td2.className = "mono";
    tr.append(td1, td2);
    detay.append(tr);
  });

  // Kopyalama alanı yalnızca geçerli IBAN'da görünür
  const kopyala = document.getElementById("kopyala");
  if (s.gecerli) {
    document.getElementById("kopya-bosluklu").value = grupla(s.iban);
    document.getElementById("kopya-bosluksuz").value = s.iban;
    kopyala.style.display = "block";
    paylasimHazirla(s);
  } else {
    kopyala.style.display = "none";
  }

  document.getElementById("sonuc").style.display = "block";
}

async function panoyaKopyala(metin, kutu) {
  try {
    await navigator.clipboard.writeText(metin);
    return true;
  } catch (e) {
    // Eski tarayıcılar veya izin yoksa: kutuyu seçip kopyala
    kutu.focus();
    kutu.select();
    try { return document.execCommand("copy"); } catch (e2) { return false; }
  }
}

document.querySelectorAll(".btn-kopya[data-hedef]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const kutu = document.getElementById(btn.dataset.hedef);
    const basarili = await panoyaKopyala(kutu.value, kutu);
    btn.textContent = basarili ? "✓ Kopyalandı" : "Kopyalanamadı";
    btn.classList.toggle("tamam", basarili);
    setTimeout(() => {
      btn.textContent = "Kopyala";
      btn.classList.remove("tamam");
    }, 1800);
  });
});

// Üstteki "Nasıl çalışır?" bağlantısı açıklamayı açıp oraya kaydırır
document.querySelector('header a[href="#nasil"]').addEventListener("click", () => {
  document.getElementById("nasil-detay").open = true;
});

// Karanlık mod anahtarı
const temaKutusu = document.getElementById("tema");
const sistemKaranlik = window.matchMedia("(prefers-color-scheme: dark)").matches;
const mevcutTema = document.documentElement.dataset.theme;
const temaSimge = document.getElementById("tema-simge");
function temaSimgesiniGuncelle() {
  // Karanlık modda ay, aydınlık modda güneş
  temaSimge.textContent = temaKutusu.checked ? "🌙" : "🌞";
}
temaKutusu.checked = mevcutTema ? mevcutTema === "dark" : sistemKaranlik;
temaSimgesiniGuncelle();
temaKutusu.addEventListener("change", () => {
  const yeni = temaKutusu.checked ? "dark" : "light";
  document.documentElement.dataset.theme = yeni;
  temaSimgesiniGuncelle();
  try { localStorage.setItem("tema", yeni); } catch (e) {}
});

const girdi = document.getElementById("iban");

// Girilen metni sadeleştir: harf/rakam dışını at, rakamla başlıyorsa başına TR ekle
function normallestir(metin) {
  let v = metin.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/^\d/.test(v)) v = "TR" + v;
  return v;
}

// Bir satırdaki IBAN'ları bul ("IBAN: TR33 ...", "Ahmet;TR33...;500 TL" gibi).
// Tam IBAN'ın hemen ardından rakam geliyorsa (fazla hane) eşleşme sayılmaz;
// böylece fazla haneli bir IBAN yanlışlıkla geçerli görünmez.
const IBAN_DESENI = /TR(?:[\s\-.]*\d){24}(?![\s\-.]*\d)/g;
function satirdanIbanlar(satir) {
  const ust = satir.toUpperCase();
  const tamlar = ust.match(IBAN_DESENI);
  if (tamlar) return tamlar.map(t => t.replace(/[^A-Z0-9]/g, ""));
  // Tam IBAN yoksa en olası adayı al ki hatalı satır da listede görünsün
  const trli = ust.match(/TR[\d\s\-.]*\d/);
  if (trli) return [trli[0].replace(/[^A-Z0-9]/g, "")];
  const rakamlar = ust.match(/\d[\d\s\-.]*\d/g);
  if (rakamlar) {
    const enUzun = rakamlar.map(r => r.replace(/\D/g, "")).sort((a, b) => b.length - a.length)[0];
    if (enUzun.length >= 10) return ["TR" + enUzun];
  }
  return [];
}

// Yapıştırılan metnin içinden IBAN'ı bul
function metindenIbanBul(metin) {
  return satirdanIbanlar(metin)[0] || normallestir(metin);
}

let sonKontrolEdilen = "";
function girdiDegisti(temiz) {
  girdi.value = grupla(temiz);
  if (temiz.length >= 26) {
    // 26 karaktere ulaşınca düğmeye basmadan kontrol et; fazlası da hata olarak gösterilir
    if (temiz !== sonKontrolEdilen) {
      sonKontrolEdilen = temiz;
      goster(kontrolEt(temiz));
    }
  } else {
    sonKontrolEdilen = "";
    document.getElementById("sonuc").style.display = "none";
  }
}

girdi.addEventListener("input", () => girdiDegisti(normallestir(girdi.value)));

girdi.addEventListener("paste", e => {
  const metin = (e.clipboardData || window.clipboardData).getData("text");
  if (!metin) return;
  e.preventDefault();
  girdiDegisti(metindenIbanBul(metin));
});

document.getElementById("iban-formu").addEventListener("submit", e => {
  e.preventDefault();
  goster(kontrolEt(girdi.value));
});

// ---------- Paylaş ----------
const SITE_ADRESI = document.querySelector('link[rel="canonical"]').href;
let paylasimMetni = "";

function paylasimHazirla(s) {
  const satirlar = [grupla(s.iban)];
  if (s.banka) satirlar.push(s.banka);
  satirlar.push("", "IBAN Doğrula ile kontrol edildi: " + SITE_ADRESI);
  paylasimMetni = satirlar.join("\n");
  document.getElementById("paylas-wa").href = "https://wa.me/?text=" + encodeURIComponent(paylasimMetni);
  // Telefonlardaki paylaşım menüsü yalnızca destekleyen tarayıcılarda görünür
  document.getElementById("paylas-cihaz").hidden = !navigator.share;
}

document.getElementById("paylas-cihaz").addEventListener("click", () => {
  navigator.share({ text: paylasimMetni }).catch(() => {});
});

// ---------- Sekmeler ----------
const SEKMELER = ["tekli", "toplu"];

function sekmeAc(ad, adresiGuncelle) {
  SEKMELER.forEach(k => {
    const aktif = k === ad;
    const sekme = document.getElementById("sekme-" + k);
    sekme.classList.toggle("aktif", aktif);
    sekme.setAttribute("aria-selected", String(aktif));
    sekme.tabIndex = aktif ? 0 : -1;
    document.getElementById("panel-" + k).hidden = !aktif;
  });
  if (adresiGuncelle) {
    // #toplu adresi doğrudan toplu sekmeyi açar (paylaşılabilir bağlantı)
    try { history.replaceState(null, "", ad === "toplu" ? "#toplu" : location.pathname + location.search); } catch (e) {}
  }
}

SEKMELER.forEach((k, i) => {
  const sekme = document.getElementById("sekme-" + k);
  sekme.addEventListener("click", () => sekmeAc(k, true));
  sekme.addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const sonraki = SEKMELER[(i + (e.key === "ArrowRight" ? 1 : SEKMELER.length - 1)) % SEKMELER.length];
    sekmeAc(sonraki, true);
    document.getElementById("sekme-" + sonraki).focus();
  });
});

if (location.hash === "#toplu") sekmeAc("toplu", false);

// ---------- Toplu doğrulama ----------
const TOPLU_SINIR = 10000;
let topluSonuclar = [];

function kisaAciklama(r) {
  if (r.gecerli) return "";
  if (!r.iban.startsWith("TR")) return "TR ile başlamıyor";
  if (!/^[A-Z]{2}\d+$/.test(r.iban)) return "Geçersiz karakter var";
  if (r.iban.length !== 26) return r.iban.length + " karakter (26 olmalı)";
  return "Rakamlardan biri yanlış yazılmış olabilir";
}

function topluKontrolEt(metin) {
  const adaylar = [];
  for (const satir of metin.split(/\r?\n/)) {
    adaylar.push(...satirdanIbanlar(satir));
    if (adaylar.length >= TOPLU_SINIR) break;
  }
  const ilkGorulen = new Map();
  return adaylar.slice(0, TOPLU_SINIR).map((iban, i) => {
    const r = kontrolEt(iban);
    let aciklama = kisaAciklama(r);
    if (ilkGorulen.has(r.iban)) {
      aciklama = (aciklama ? aciklama + "; " : "") + "Listede tekrar ediyor (" + ilkGorulen.get(r.iban) + ". sıra)";
    } else {
      ilkGorulen.set(r.iban, i + 1);
    }
    return {
      sira: i + 1,
      iban: r.iban,
      gecerli: r.gecerli,
      banka: r.yapiDogru ? (r.banka || "Bilinmeyen banka kodu") : "",
      bankaKodu: r.yapiDogru ? r.bankaKodu : "",
      aciklama
    };
  });
}

function topluTabloyuCiz() {
  const govde = document.getElementById("toplu-govde");
  const hatalilarUstte = document.getElementById("hatalilar-ustte").checked;
  const liste = hatalilarUstte
    ? [...topluSonuclar].sort((a, b) => (a.gecerli - b.gecerli) || (a.sira - b.sira))
    : topluSonuclar;

  const parca = document.createDocumentFragment();
  for (const r of liste) {
    const tr = document.createElement("tr");
    const hucreler = [
      [String(r.sira), ""],
      [grupla(r.iban), "mono"],
      [r.gecerli ? "✓ Geçerli" : "✗ Geçersiz", r.gecerli ? "ok" : "err"],
      [r.banka, ""],
      [r.aciklama, "aciklama"]
    ];
    for (const [metin, sinif] of hucreler) {
      const td = document.createElement("td");
      td.textContent = metin;
      if (sinif) td.className = sinif;
      tr.append(td);
    }
    parca.append(tr);
  }
  govde.replaceChildren(parca);
}

function topluOzetYaz() {
  const ozet = document.getElementById("toplu-ozet");
  ozet.replaceChildren();
  if (!topluSonuclar.length) {
    ozet.textContent = "Listede IBAN bulunamadı.";
    return;
  }
  const gecerli = topluSonuclar.filter(r => r.gecerli).length;
  const gecersiz = topluSonuclar.length - gecerli;
  const ok = document.createElement("span");
  ok.className = "say-ok";
  ok.textContent = gecerli + " geçerli";
  const err = document.createElement("span");
  err.className = "say-err";
  err.textContent = gecersiz + " geçersiz";
  ozet.append(topluSonuclar.length + " IBAN kontrol edildi: ", ok, ", ", err, ".");
  if (topluSonuclar.length >= TOPLU_SINIR) {
    ozet.append(" (En fazla " + TOPLU_SINIR + " IBAN kontrol edilir.)");
  }
}

// Her satırda en fazla 26 IBAN karakteri (harf/rakam) girilebilir; fazlası kesilir
const topluGirdi = document.getElementById("toplu-girdi");
function satiriKisalt(satir) {
  let sayac = 0;
  for (let i = 0; i < satir.length; i++) {
    if (/[A-Za-z0-9]/.test(satir[i]) && ++sayac > 26) return satir.slice(0, i).replace(/[\s\-.]+$/, "");
  }
  return satir;
}
topluGirdi.addEventListener("input", () => {
  const eski = topluGirdi.value;
  const yeni = eski.split("\n").map(satiriKisalt).join("\n");
  if (yeni !== eski) {
    const imlec = Math.min(topluGirdi.selectionStart, yeni.length);
    topluGirdi.value = yeni;
    topluGirdi.setSelectionRange(imlec, imlec);
  }
});

function topluCalistir() {
  topluSonuclar = topluKontrolEt(document.getElementById("toplu-girdi").value);
  topluOzetYaz();
  topluTabloyuCiz();
  const varMi = topluSonuclar.length > 0;
  document.querySelector("#toplu-sonuc .tablo-kap").hidden = !varMi;
  document.getElementById("csv-indir").hidden = !varMi;
  document.getElementById("toplu-sonuc").hidden = false;
}

document.getElementById("toplu-kontrol").addEventListener("click", topluCalistir);

document.getElementById("toplu-temizle").addEventListener("click", () => {
  document.getElementById("toplu-girdi").value = "";
  topluSonuclar = [];
  document.getElementById("toplu-sonuc").hidden = true;
  dosyaDurumuYaz("");
  document.getElementById("toplu-girdi").focus();
});

document.getElementById("hatalilar-ustte").addEventListener("change", () => {
  if (topluSonuclar.length) topluTabloyuCiz();
});

// Excel'in Türkçe ayarlarıyla düzgün açılması için ; ayraç ve UTF-8 BOM kullanılır
function csvOlustur(sonuclar) {
  const alan = v => {
    const s = String(v);
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const satirlar = [["Sıra", "IBAN", "Durum", "Banka", "Banka Kodu", "Açıklama"]];
  for (const r of sonuclar) {
    satirlar.push([r.sira, r.iban, r.gecerli ? "Geçerli" : "Geçersiz", r.banka, r.bankaKodu, r.aciklama]);
  }
  return "﻿" + satirlar.map(s => s.map(alan).join(";")).join("\r\n");
}

document.getElementById("csv-indir").addEventListener("click", () => {
  if (!topluSonuclar.length) return;
  const blob = new Blob([csvOlustur(topluSonuclar)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "iban-dogrulama-" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ---------- Dosyadan okuma (.xlsx, .csv, .txt) ----------
// Dosya tarayıcıda açılır; hiçbir yere gönderilmez. .xlsx bir zip arşividir:
// kütüphane kullanmadan, tarayıcının kendi DecompressionStream özelliğiyle okunur.
const DOSYA_SINIRI = 20 * 1024 * 1024;       // seçilebilecek en büyük dosya
const ACILMIS_SINIRI = 100 * 1024 * 1024;    // zip bombasına karşı açılmış boyut sınırı

class DosyaHatasi extends Error {}

async function deflateAc(bayt) {
  const akis = new Blob([bayt]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const okuyucu = akis.getReader();
  const parcalar = [];
  let toplam = 0;
  for (;;) {
    const { done, value } = await okuyucu.read();
    if (done) break;
    toplam += value.length;
    if (toplam > ACILMIS_SINIRI) {
      okuyucu.cancel();
      throw new DosyaHatasi("Dosya açıldığında çok büyük çıkıyor, okunamadı.");
    }
    parcalar.push(value);
  }
  return new Blob(parcalar).text();
}

// Zip'in merkez dizininden dosya listesini çıkarır: ad → {yontem, boyut, veriBasi}
function zipGirdileri(bayt) {
  const dv = new DataView(bayt.buffer, bayt.byteOffset, bayt.byteLength);
  let son = -1;
  for (let i = bayt.length - 22; i >= Math.max(0, bayt.length - 22 - 65535); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { son = i; break; }
  }
  if (son < 0) throw new DosyaHatasi("Bu dosya geçerli bir Excel (.xlsx) dosyası gibi görünmüyor.");
  const adet = dv.getUint16(son + 10, true);
  let p = dv.getUint32(son + 16, true);
  const ad = new TextDecoder();
  const girdiler = new Map();
  for (let i = 0; i < adet; i++) {
    if (p + 46 > bayt.length || dv.getUint32(p, true) !== 0x02014b50) break;
    const yontem = dv.getUint16(p + 10, true);
    const boyut = dv.getUint32(p + 20, true);
    const adUzun = dv.getUint16(p + 28, true);
    const ekUzun = dv.getUint16(p + 30, true);
    const notUzun = dv.getUint16(p + 32, true);
    const yerel = dv.getUint32(p + 42, true);
    const dosyaAdi = ad.decode(bayt.subarray(p + 46, p + 46 + adUzun));
    if (yerel + 30 <= bayt.length && dv.getUint32(yerel, true) === 0x04034b50) {
      const veriBasi = yerel + 30 + dv.getUint16(yerel + 26, true) + dv.getUint16(yerel + 28, true);
      girdiler.set(dosyaAdi, { yontem, boyut, veriBasi });
    }
    p += 46 + adUzun + ekUzun + notUzun;
  }
  return girdiler;
}

async function zipMetni(bayt, g) {
  const veri = bayt.subarray(g.veriBasi, g.veriBasi + g.boyut);
  if (g.yontem === 0) return new Blob([veri]).text();
  if (g.yontem === 8) return deflateAc(veri);
  throw new DosyaHatasi("Bu Excel dosyasının sıkıştırma biçimi desteklenmiyor.");
}

function xmlCoz(s) {
  return s.replace(/&(#[xX][0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g, (m, k) => {
    if (k === "amp") return "&";
    if (k === "lt") return "<";
    if (k === "gt") return ">";
    if (k === "quot") return '"';
    if (k === "apos") return "'";
    try {
      return String.fromCodePoint(k[1] === "x" || k[1] === "X" ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10));
    } catch (e) { return ""; }
  });
}

// <t>...</t> parçalarını birleştirir (zengin metinde birden fazla olabilir)
function xmlMetinleri(parca) {
  const t = parca.replace(/<rPh\b[\s\S]*?<\/rPh>/g, "");
  let out = "";
  for (const m of t.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)) out += xmlCoz(m[1]);
  return out;
}

function paylasilanMetinler(xml) {
  const liste = [];
  for (const m of xml.matchAll(/<si\b[^>]*?(?:\/>|>([\s\S]*?)<\/si>)/g)) liste.push(m[1] ? xmlMetinleri(m[1]) : "");
  return liste;
}

// Sayfadaki her satırı, hücreleri ";" ile birleştirilmiş bir metin satırına çevirir
function sayfaSatirlari(xml, paylasilan) {
  const satirlar = [];
  for (const sm of xml.matchAll(/<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    if (!sm[1]) continue;
    const hucreler = [];
    for (const hm of sm[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      if (!hm[2]) continue;
      const tur = (hm[1].match(/\bt="([^"]*)"/) || [])[1];
      const v = (hm[2].match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      let metin = "";
      if (tur === "s") metin = paylasilan[Number(v)] || "";
      else if (tur === "inlineStr") metin = xmlMetinleri(hm[2]);
      else if (v !== undefined) metin = xmlCoz(v);
      if (metin) hucreler.push(metin);
    }
    if (hucreler.length) satirlar.push(hucreler.join(";"));
  }
  return satirlar;
}

async function xlsxMetni(bayt) {
  const girdiler = zipGirdileri(bayt);
  if (!girdiler.has("xl/workbook.xml")) {
    throw new DosyaHatasi("Bu dosya geçerli bir Excel (.xlsx) dosyası gibi görünmüyor.");
  }
  const paylasilan = girdiler.has("xl/sharedStrings.xml")
    ? paylasilanMetinler(await zipMetni(bayt, girdiler.get("xl/sharedStrings.xml")))
    : [];
  const sayfalar = [...girdiler.keys()]
    .filter(a => /^xl\/worksheets\/[^/]+\.xml$/.test(a))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const satirlar = [];
  for (const sayfa of sayfalar) {
    satirlar.push(...sayfaSatirlari(await zipMetni(bayt, girdiler.get(sayfa)), paylasilan));
  }
  return satirlar.join("\n");
}

async function dosyadanMetin(dosya) {
  if (dosya.size > DOSYA_SINIRI) throw new DosyaHatasi("Dosya çok büyük (en fazla 20 MB).");
  const bayt = new Uint8Array(await dosya.arrayBuffer());
  if (bayt[0] === 0x50 && bayt[1] === 0x4b) return xlsxMetni(bayt);
  if (bayt[0] === 0xd0 && bayt[1] === 0xcf && bayt[2] === 0x11 && bayt[3] === 0xe0) {
    throw new DosyaHatasi("Eski .xls biçimi okunamıyor. Excel'de \"Farklı Kaydet\" ile .xlsx veya .csv olarak kaydedip yeniden deneyin.");
  }
  return new TextDecoder().decode(bayt);
}

// ---------- Dosya seçme arayüzü ----------
function dosyaDurumuYaz(metin, hata) {
  const p = document.getElementById("dosya-durum");
  p.textContent = metin;
  p.hidden = !metin;
  p.classList.toggle("hata", Boolean(hata));
}

async function dosyaIsle(dosya) {
  if (!dosya) return;
  dosyaDurumuYaz(dosya.name + " okunuyor…");
  try {
    const metin = await dosyadanMetin(dosya);
    const ibanlar = [];
    for (const satir of metin.split(/\r?\n/)) {
      ibanlar.push(...satirdanIbanlar(satir));
      if (ibanlar.length >= TOPLU_SINIR) break;
    }
    document.getElementById("toplu-girdi").value = ibanlar.slice(0, TOPLU_SINIR).map(grupla).join("\n");
    topluCalistir();
    dosyaDurumuYaz(ibanlar.length
      ? dosya.name + ": " + Math.min(ibanlar.length, TOPLU_SINIR) + " IBAN bulundu."
      : dosya.name + ": dosyada IBAN bulunamadı. IBAN'lar \"TR\" ile başlayan metin olarak yazılmış olmalı.");
  } catch (e) {
    dosyaDurumuYaz(e instanceof DosyaHatasi ? e.message : "Dosya okunamadı. .xlsx, .csv veya .txt dosyası seçin.", true);
  }
}

const dosyaKutusu = document.getElementById("dosya-sec");
document.getElementById("dosya-btn").addEventListener("click", () => dosyaKutusu.click());
dosyaKutusu.addEventListener("change", () => {
  const dosya = dosyaKutusu.files[0];
  dosyaKutusu.value = ""; // aynı dosya tekrar seçilebilsin
  dosyaIsle(dosya);
});

// Dosyayı panelin üzerine sürükleyip bırakma
const topluPanel = document.getElementById("panel-toplu");
const dosyaSurukleniyor = e => e.dataTransfer && [...e.dataTransfer.types].includes("Files");
topluPanel.addEventListener("dragover", e => {
  if (!dosyaSurukleniyor(e)) return;
  e.preventDefault();
  topluPanel.classList.add("surukle");
});
topluPanel.addEventListener("dragleave", e => {
  if (!topluPanel.contains(e.relatedTarget)) topluPanel.classList.remove("surukle");
});
topluPanel.addEventListener("drop", e => {
  if (!dosyaSurukleniyor(e)) return;
  e.preventDefault();
  topluPanel.classList.remove("surukle");
  dosyaIsle(e.dataTransfer.files[0]);
});

document.getElementById("yil").textContent = new Date().getFullYear();

// Logoya tıklayınca sayfayı baştan yükle (sonuçlar, sekme ve #adres sıfırlanır)
document.getElementById("logo-baglanti").addEventListener("click", e => {
  e.preventDefault();
  location.href = location.pathname + location.search;
});
