# HelloHuman

Format de seară care așază oameni care nu se cunosc la aceeași masă, pentru un interval scurt și anunțat dinainte. Funcționează în baruri, librării, muzee, hoteluri, terminale de călători și la evenimente de firmă.

Site și aplicație, fără cadru de dezvoltare și fără pas de compilare. Se urcă direct pe Vercel.

---

## Ce conține fiecare fișier

| Fișier | Ce face |
|---|---|
| `index.html` | Pagina pentru participanți **și** aplicația completă. Aplicația apare doar când adresa are un cod după diez. |
| `site.css` | Sistemul de design, folosit de toate paginile. O modificare aici schimbă tot site-ul. |
| `parteneri.html` | Pagina-hub pentru organizatori, cu cele șase tipuri de loc. |
| `localuri.html` | Baruri și restaurante. |
| `librarii.html` | Librării și cafenele. |
| `cultura.html` | Muzee și spații culturale. |
| `hoteluri.html` | Hoteluri și turism. |
| `terminale.html` | Aeroporturi și gări. |
| `corporate.html` | Evenimente de firmă și agenții. |
| `api/store.js` | Serverul. Ține registrul, evenimentele și emailurile. |
| `robots.txt` | Permite explicit și crawlerele de inteligență artificială. |
| `sitemap.xml` | Cele opt adrese, pentru motoarele de căutare. |
| `llms.txt` | Rezumat factual scris pentru motoarele cu inteligență artificială. |
| `vercel.json` | Antete de securitate și memorare în cache pentru fișierul de stiluri. |

---

## Cum se intră în fiecare parte

Totul trece prin `index.html`. Ce apare depinde de ce e scris după diez în adresă.

| Adresă | Cine intră | Ce vede |
|---|---|---|
| `hellohuman.ro/` | Oricine | Pagina de prezentare pentru participanți |
| `hellohuman.ro/#org` | **Tu** | Registrul cu toți partenerii și toate evenimentele |
| `hellohuman.ro/#p=ID` | Partenerul | Doar evenimentele lui. Nu vede alți parteneri și nici emailurile. |
| `hellohuman.ro/#m=ID` | Gazda serii | Panoul de moderator al unui singur eveniment |
| `hellohuman.ro/#e=ID` | Participantul | Înscrierea. Aici duce codul QR. |
| `hellohuman.ro/#c` | Clientul agenției | Chestionarul de șapte pași, doar pentru evenimente de firmă |

Adresa `#org` nu apare nicăieri pe site. O știi doar tu.

---

## Ce trebuie configurat în Vercel

Fără cele două de mai jos, registrul și emailurile nu funcționează.

**1. Baza de date.** În proiect, la secțiunea *Storage*, adaugă **Upstash Redis** pe planul gratuit. Bifează conectarea la proiect. Vercel adaugă singur variabilele de care are nevoie serverul.

**2. Parola de organizator.** La *Settings → Environment Variables*, adaugă:

```
OWNER_KEY = parola-ta
```

Bifează toate mediile: Production, Preview, Development.

Dacă nu o setezi, serverul folosește `sef2026` ca rezervă. **Schimb-o înainte să faci site-ul public.**

După orice modificare de variabile, proiectul trebuie reconstruit — cel mai simplu prin salvarea unui fișier pe GitHub.

---

## Verificare după urcare

1. Deschide `/#org` și intră cu parola ta.
2. Apasă **Testează legătura**. Prima linie trebuie să fie verde.
3. Creează un partener, copiază linkul și parola.
4. Deschide linkul de partener în altă fereastră și verifică că intri.
5. Creează un eveniment de probă și verifică codul QR.
6. Pe pagina principală, lasă un email în formular și verifică apoi în registru că a ajuns.

Pasul 6 e cel mai important — el pică dacă Upstash nu e conectat.

---


---

## Domeniul — de făcut înainte de lansare

Adresele canonice din toate paginile arată spre `hellohuman.ro`. Cât timp site-ul rulează doar pe adresa de probă `.vercel.app`, motoarele de căutare sunt ținute afară prin `robots.txt`.

**Când conectezi domeniul la Vercel:**

1. În Vercel, la *Settings → Domains*, adaugi `hellohuman.ro`. Vercel îți dă două înregistrări DNS.
2. La HostGate, unde ai cumpărat domeniul, adaugi acele înregistrări.
3. În `robots.txt`, ștergi linia `Disallow: /` și decomentezi blocul de dedesubt.
4. Trimiți sitemap-ul în Google Search Console.

**Dacă rămâi pe altă adresă**, caută `hellohuman.ro` în toate fișierele `.html`, în `sitemap.xml` și în `llms.txt`, și înlocuiește-l.

---

## Adresa de domeniu

Adresele canonice și datele structurate conțin `hellohuman.ro`. Dacă folosești alt domeniu, caută-l și înlocuiește-l în toate fișierele `.html`, în `sitemap.xml` și în `llms.txt`.

---

## Cum se schimbă lucrurile

**Textele de pe site** stau direct în paginile `.html`. Cele din aplicație stau în dicționarul `T` din `index.html`, cu o versiune în română și una în engleză. Fiecare cheie trebuie să existe în ambele.

**Aspectul** se schimbă din `site.css`. Variabilele de culoare sunt la început, în blocul `:root`.

**Profilurile de eveniment** — bar, librărie, aeroport, firmă — stau în `PROFILES` din `index.html`. Acolo se schimbă variantele pe care le alege participantul, întrebările de la mese, durata implicită și numărul de locuri.

**Întrebările de la mese** urcă pe niveluri între runde. Prima rundă le ia pe primele din listă, a doua pe următoarele.

---

## De ce nu se pierd înscrierile

Fiecare participant are propriul lui câmp în baza de date. Când se înscrie, atinge doar câmpul lui — nu poate suprascrie pe nimeni, oricâți ar fi simultan. Același lucru pentru ieșirea din coadă, voturi și emailuri.

Runda o scrie doar gazda, deci acolo nu există concurență. Cine se înscrie chiar în secunda în care ea apasă butonul rămâne în coadă pentru runda următoare.

Verificat prin simulare: o sută de înscrieri simultane, zero pierderi.

---

## Cum funcționează formarea meselor

Sistemul **nu potrivește oameni pe compatibilitate**. Studiul lui Aron (1997) a testat exact asta și nu a găsit niciun efect asupra apropierii.

Ce face în schimb: încearcă trei sute de aranjări posibile și o alege pe cea cu cel mai mic cost. Costul penalizează perechile care s-au mai întâlnit, mesele fără nimeni dispus să vorbească, și mesele sub doi oameni.

Grupurile sunt de trei sau patru. La doi seamănă a întâlnire, la cinci doi rămân tăcuți.

Cine alege *rămânem aici* între runde își păstrează masa intactă la runda următoare; restul se redistribuie.

---

## Ce nu e făcut încă

- Vibrația și sunetul pe telefon când începe și se termină runda
- Dezvăluirea reciprocă la finalul serii, când doi oameni vor amândoi să continue
- Registrul e vizibil doar cu parola, nu are conturi separate pe echipă
- Codul QR depinde de o bibliotecă externă, deci are nevoie de internet

---

## Cercetarea din spate

- **Aron et al., 1997** — schimbul reciproc în trepte produce apropiere; conversația ușoară nu. Potrivirea pe atitudini comune nu are efect.
- **Epley și Schroeder, 2014** — navetiștii puși să vorbească cu un străin s-au bucurat de drum mai mult decât cei lăsați singuri, exact opusul a ce preziseseră.
- **Boothby, Cooney, Sandstrom și Clark, 2018** — după o conversație, oamenii subestimează sistematic cât de mult i-au plăcut celuilalt. Efectul ține luni de zile.

---

Contact: contact@hellohuman.ro · 0750 255 200
