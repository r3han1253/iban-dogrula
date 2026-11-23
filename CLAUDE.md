# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje

"IBAN Doğrula": Türkiye IBAN numaralarını doğrulayan ve bankasını gösteren, tamamen istemci tarafında çalışan statik site. Arayüz, kod yorumları, commit mesajları ve değişken adları Türkçedir; yeni kod ve commit mesajları da Türkçe yazılır. GitHub Pages'te (`r3han1253/iban-dogrula`, `main` dalı) yayınlanır.

## Komutlar

Derleme, paket yöneticisi, lint ya da test yoktur. Sadece düz HTML/CSS/JS.

- Çalıştırma: `index.html` dosyasını tarayıcıda açmak yeterli (ya da `python -m http.server`).
- Yayın: `git push` ile `main` dalına gönderilir, GitHub Pages kendisi yayınlar.

## Mimari

- [index.html](index.html): Tek sayfa uygulama; "Tekli" ve "Toplu" sekmeleri burada. Ayrıca SEO meta etiketleri, FAQPage JSON-LD ve Cloudflare Web Analytics betiği içerir.
- [app.js](app.js): Tüm mantık tek dosyada, framework yok. Başlıca bölümler: `BANKALAR` (5 haneli banka kodu → ad, TCMB listesi), `kontrolEt()` (yapı ve mod 97 denetimi), tekli sonuç gösterimi, paylaşma, sekmeler, toplu doğrulama, CSV çıktısı ve dosyadan okuma (.xlsx/.csv/.txt).
- [banka-kodlari.html](banka-kodlari.html): Tüm banka kodlarının tablosu (SEO sayfası). **Elle düzenlenmez**; `node araclar/banka-sayfasi-uret.cjs` ile `BANKALAR` listesinden ve `logolar/` klasöründen üretilir. Süzme betiği [banka-kodlari.js](banka-kodlari.js).
- [og-gorsel.png](og-gorsel.png): 1200×630 paylaşım görseli (`og:image` ve `twitter:image`).
- [tema.js](tema.js): Kayıtlı tema tercihini sayfa çizilmeden uygular (`<head>` içinde yüklenir, açılışta renk titremesini önler). Tema anahtarı mantığı `app.js` içindedir.
- [style.css](style.css): Tüm stiller. Renkler `:root` CSS değişkenleriyle tanımlı; karanlık mod hem `prefers-color-scheme` hem `data-theme="dark"` ile ayrı ayrı tekrar tanımlanır, bir renk eklerken iki yeri de güncelleyin.
- [kvkk.html](kvkk.html): KVKK ve gizlilik metni. İçinde doldurulmamış `[İLETİŞİM E-POSTA ADRESİ]` yer tutucusu var.
- `logolar/<5 haneli banka kodu>.png`: Banka logoları. Dosya yoksa arayüz baş harf rozeti gösterir. Yeni banka eklerken `BANKALAR` listesine kod eklenir, logo isteğe bağlıdır.

## Dikkat edilecekler

- **Gizlilik sözü:** Site "IBAN hiçbir yere gönderilmez" der. Girilen IBAN'ı ağa gönderen, kaydeden ya da üçüncü taraf betiğe veren hiçbir değişiklik yapmayın. [index.html](index.html) içindeki Content-Security-Policy (`default-src 'self'`, yalnızca Cloudflare izin listesinde) bunu güvence altına alır; yeni bir dış kaynak eklemek CSP'yi ve [kvkk.html](kvkk.html) metnini de güncellemeyi gerektirir. Satır içi script ve stil CSP nedeniyle çalışmaz, ayrı dosya kullanın.
- **Önbellek sürümü:** `style.css?v=…`, `app.js?v=…` ve `tema.js?v=…` sorgu parametreleri elle artırılır (`20261120d` biçimi: tarih + harf). Bu dosyalardan birini değiştirince [index.html](index.html) içindeki sürümü yükseltin. [kvkk.html](kvkk.html) kendi `style.css` sürümünü ayrıca taşır.
- **Alan adı:** Canonical, `og:url`, `og:image` ve [sitemap.xml](sitemap.xml) şu an `r3han1253.github.io/iban-dogrula/` adresini kullanır. `app.js` paylaşım metnindeki site adresini canonical etiketinden okur. Alan adı (`ibandogrula.com`) bağlanırsa bu adreslerin hepsi ve bir `CNAME` dosyası güncellenmelidir.
- **Toplu doğrulama:** Giriş satır başına en fazla 26 IBAN karakteriyle sınırlıdır (`satiriKisalt`), toplam en çok 10.000 IBAN işlenir (`TOPLU_SINIR`). IBAN ayıklama `satirdanIbanlar()` ve `IBAN_DESENI` ile yapılır; fazla haneli IBAN'ın yanlışlıkla geçerli görünmemesi için desen bilinçli olarak sıkıdır.
- **Dosyadan okuma:** .xlsx dosyası kütüphanesiz, `DecompressionStream` ile `app.js` içinde açılır (dış betik eklemeyin, CSP izin vermez). Dosya yalnızca tarayıcıda okunur; 20 MB dosya ve 100 MB açılmış boyut sınırı vardır. Eski .xls okunmaz, kullanıcıya .xlsx/.csv önerilir.
- **Banka listesi değişince:** `BANKALAR`a kod eklediğinizde ya da `logolar/`a logo koyduğunuzda `node araclar/banka-sayfasi-uret.cjs` çalıştırın; üretilen `banka-kodlari.html` ve `style.css` sürümü betikteki `SURUM` ile eşleşmelidir (betik, `style.css` sürümünü yükselttiğinizde elle güncellenir).
- **Düğme rengi:** Beyaz yazılı düğme zeminleri `--dugme` değişkenini kullanır (karanlık modda da koyu kalır). `--accent` karanlık modda açık mavidir; üzerine beyaz yazı koymayın (kontrast).
- **CSV:** Excel'in Türkçe ayarlarında açılması için `;` ayracı ve UTF-8 BOM kullanılır.

## Agent skills

### Issue tracker

Issue'lar GitHub Issues'ta tutulur (`gh` CLI). Bkz. `docs/agents/issue-tracker.md`.

### Triage labels

Varsayılan beş etiket kullanılır: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Bkz. `docs/agents/triage-labels.md`.

### Domain docs

Tek bağlamlı düzen: kökte `GLOSSARY.md` ve `docs/adr/`. Bkz. `docs/agents/domain.md`.
