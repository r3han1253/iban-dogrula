// Banka kodları sayfası: tabloyu banka adına ya da koduna göre süzer
const aramaKutusu = document.getElementById("banka-ara");
const satirlar = [...document.querySelectorAll("#banka-govde tr")];
const sonucYazisi = document.getElementById("ara-sonuc");

aramaKutusu.addEventListener("input", () => {
  const sorgu = aramaKutusu.value.trim().toLocaleLowerCase("tr");
  let gorunen = 0;
  for (const tr of satirlar) {
    const eslesir = !sorgu || tr.dataset.ara.includes(sorgu);
    tr.hidden = !eslesir;
    if (eslesir) gorunen++;
  }
  sonucYazisi.hidden = !sorgu;
  sonucYazisi.textContent = gorunen ? gorunen + " banka bulundu." : "Eşleşen banka bulunamadı.";
});
