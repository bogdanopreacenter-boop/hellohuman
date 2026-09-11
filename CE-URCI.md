# Ce urci — 11 septembrie

Șase fișiere în rădăcină, plus unul în `api/`.

| Fișier | Ce s-a schimbat |
|---|---|
| `core.js` | erori de algoritm + rută nouă |
| `index.html` | adresa codului QR, oferta localului, titlul |
| `crm.html` | email partener, întrebări la vedere, ofertă |
| `partener.html` | emailul lui, întrebări la vedere, ofertă |
| `site.css` | spațierea |
| `locuri-hellohuman.jpg` | **fișier nou** |
| `api/store.js` | rută pentru salvarea emailului |

---

## 1. Codul QR nu mai duce înapoi pe site

**Cauza:** adresa era `hellohuman.ro/#e=ID`. Fragmentul de după diez se pierde în unele aplicații de mesagerie — WhatsApp și Facebook îl taie uneori.

**Acum:** `hellohuman.ro/?e=ID`.

**Codurile vechi, deja printate, funcționează în continuare.** Pagina prinde ambele forme.

---

## 2. Librăria nu mai e „Librărie sau cafenea"

Erau profiluri separate în cod, dar numele te făcea să alegi greșit.

---

## 3. Întrebările se văd la creare

Erau ascunse sub „Ajustează detaliile", iar ți se cerea să alegi fără să le vezi.

Acum sunt sus, editabile, cu explicația: *fiecare masă primește una, pe rând.*

---

## 4. Partenerul are email

**La creare:** un câmp nou. Dacă îl lași gol, se folosește adresa ta.

**În panoul lui:** și-l poate schimba singur. Serverul îi permite să modifice doar emailul, nimic altceva.

---

## 5. Ce oferă localul

Un câmp nou la crearea serii: *o cafea din partea casei*, *a doua bere la jumătate*, orice.

Apare pe telefonul participantului, pe ecranul mesei, sub întrebare. Dacă e gol, nu apare nimic.

---

## Algoritmul

**Neatins azi.** Verificat pe 20.000 de simulări: zero oameni pe dinafară, zero prieteni despărțiți.

O masă tăcută la fiecare 4.260 formate — adică o dată la ~850 de seri. E sub pragul la care merită complexitate în plus.
