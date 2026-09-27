/* ============================================================
   emails.js — textele de email pentru CRM.
   Se incarca in crm.html cu: <script src="/emails.js"></script>
   Variabile: {{companie}}, {{loc}}, {{oras}}, {{reducere}},
              {{raspuns2}}, {{raspuns3}}, {{nume}}
   ============================================================ */

var EMAILS = {

  /* ============ CORPORATE — CEO, HR, Agenție/Consultanță ============ */
  corporate: {
    ro: {

      SILO: {
        subiect: 'Ce se întâmplă între echipele dumneavoastră',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Punctul pe care l-ați indicat este distanța dintre echipe.

Găsiți prezentarea aici — cinci pagini, un minut de citit:
https://hellohuman.ro/masuram

Prezentarea arată ce se poate face vizibil între departamente, în paisprezece zile, fără chestionare și fără acces la sistemele dumneavoastră.

{{raspuns3}}

{{reducere}}

Decizia rămâne a dumneavoastră. Vă răspund la orice întrebare, fără să insist.

Toate cele bune,
Bogdan
bogdan@hellohuman.ro`
      },

      VIZIBILITATE: {
        subiect: 'Ce nu apare în nicio organigramă',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Punctul pe care l-ați indicat este ce se întâmplă între oameni, fără să se vadă.

Găsiți prezentarea aici — cinci pagini, un minut de citit:
https://hellohuman.ro/masuram

Prezentarea arată exact ce vedeți la final și ce nu ajunge niciodată în document. Departamente întregi, niciodată persoane.

{{raspuns3}}

{{reducere}}

Dacă vreți să vedeți cum arată un raport real, vi-l trimit.

Toate cele bune,
Bogdan
bogdan@hellohuman.ro`
      },

      DOVADA: {
        subiect: 'Cifre pe care le puteți susține',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Punctul pe care l-ați indicat este lipsa unei cifre pe care să o puteți susține.

Găsiți prezentarea aici — cinci pagini, un minut de citit:
https://hellohuman.ro/masuram

Prezentarea are cifrele și sursele lor: anchete europene pe zeci de mii de respondenți, iar metodologia completă în anexă.

{{raspuns3}}

{{reducere}}

Dacă departamentul dumneavoastră juridic vrea documentația de prelucrare a datelor, o trimit înainte de orice discuție.

Toate cele bune,
Bogdan
bogdan@hellohuman.ro`
      },

      FRICTIUNE: {
        subiect: 'Fără acces. Fără timp pierdut.',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Punctul pe care l-ați indicat este costul în timp al oricărei inițiative noi.

Găsiți prezentarea aici — cinci pagini, un minut de citit:
https://hellohuman.ro/masuram

Nu cerem acces la niciun sistem, nu instalăm nimic și nu ocupăm timpul nimănui din echipă. Un cod QR lângă aparatul de cafea — atât.

{{raspuns3}}

{{reducere}}

Dacă la jumătate vă răzgândiți, se oprește dintr-un buton. Nu rămâne nimic instalat.

Toate cele bune,
Bogdan
bogdan@hellohuman.ro`
      },

      EFICIENTA: {
        subiect: 'Ce obțineți în paisprezece zile',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Punctul pe care l-ați indicat este efectul asupra rezultatelor, nu procesul.

Găsiți prezentarea aici — cinci pagini, un minut de citit:
https://hellohuman.ro/masuram

Prezentarea arată ce obțineți în paisprezece zile și ce decizie puteți lua pe baza acelor cifre. Fără șablon, construit pe nevoia pe care ați indicat-o.

{{raspuns3}}

{{reducere}}

Dacă vreți, calculăm împreună ce ar însemna asta pentru organizația dumneavoastră.

Toate cele bune,
Bogdan
bogdan@hellohuman.ro`
      },

      STATUSQUO: {
        subiect: 'Trei pași, niciun angajament',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Punctul pe care l-ați indicat este nevoia de dovadă înaintea oricărui angajament.

Găsiți prezentarea aici — cinci pagini, un minut de citit:
https://hellohuman.ro/masuram

Prezentarea are cei trei pași, în ordine, cu ce se întâmplă la fiecare. Nu semnați nimic înainte. Prima rundă e gratuită.

{{raspuns3}}

{{reducere}}

Nu e nevoie de nicio decizie acum. Citiți, iar dacă are sens, vorbim.

Toate cele bune,
Bogdan
bogdan@hellohuman.ro`
      }

    },

    en: {

      SILO: {
        subiect: 'What happens between your teams',
        body: `Hello,

Thank you for your answers.

The point you indicated is the distance between teams.

Here is the presentation — five pages, one minute to read:
https://hellohuman.ro/masuram

It shows what can be made visible between departments in fourteen days, without surveys and without access to your systems.

{{raspuns3}}

{{reducere}}

The decision remains yours. I will answer any question, without pushing.

Best,
Bogdan
bogdan@hellohuman.ro`
      },

      VIZIBILITATE: {
        subiect: 'What no org chart shows',
        body: `Hello,

Thank you for your answers.

The point you indicated is what happens between people, without being seen.

Here is the presentation — five pages, one minute to read:
https://hellohuman.ro/masuram

It shows exactly what you see at the end and what never reaches the document. Whole departments, never individuals.

{{raspuns3}}

{{reducere}}

If you would like to see what a real report looks like, I will send you one.

Best,
Bogdan
bogdan@hellohuman.ro`
      },

      DOVADA: {
        subiect: 'Figures you can stand behind',
        body: `Hello,

Thank you for your answers.

The point you indicated is the lack of a figure you can stand behind.

Here is the presentation — five pages, one minute to read:
https://hellohuman.ro/masuram

It has the figures and their sources: European research across tens of thousands of respondents, with the full methodology in the appendix.

{{raspuns3}}

{{reducere}}

If your legal team wants the data protection documentation, I will send it before any discussion.

Best,
Bogdan
bogdan@hellohuman.ro`
      },

      FRICTIUNE: {
        subiect: 'No access. No time lost.',
        body: `Hello,

Thank you for your answers.

The point you indicated is the time cost of any new initiative.

Here is the presentation — five pages, one minute to read:
https://hellohuman.ro/masuram

We request no access to any system, install nothing and take no time from anyone on your team. A QR code next to the coffee machine — that is all.

{{raspuns3}}

{{reducere}}

If you change your mind halfway, it stops with one button. Nothing stays installed.

Best,
Bogdan
bogdan@hellohuman.ro`
      },

      EFICIENTA: {
        subiect: 'What you get in fourteen days',
        body: `Hello,

Thank you for your answers.

The point you indicated is the effect on results, not the process.

Here is the presentation — five pages, one minute to read:
https://hellohuman.ro/masuram

It shows what you get in fourteen days and what decision you can make on those figures. No template, built around the need you indicated.

{{raspuns3}}

{{reducere}}

If you would like, we can work out together what this would mean for your organisation.

Best,
Bogdan
bogdan@hellohuman.ro`
      },

      STATUSQUO: {
        subiect: 'Three steps, no commitment',
        body: `Hello,

Thank you for your answers.

The point you indicated is the need for proof before any commitment.

Here is the presentation — five pages, one minute to read:
https://hellohuman.ro/masuram

It has the three steps, in order, with what happens at each. You sign nothing in advance. The first round is free.

{{raspuns3}}

{{reducere}}

There is no decision needed now. Read it, and if it makes sense, we talk.

Best,
Bogdan
bogdan@hellohuman.ro`
      }

    }
  },

  /* ============ LOCALURI — patroni de baruri, cafenele, etc. ============ */
  localuri: {
    ro: {

      bar: {
        subiect: '{{loc}} — o seară care nu costă nimic',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Ce urmează, pas cu pas:

1. Vorbim cincisprezece minute la telefon. Ne spuneți cum arată sala, ce ore sunt bune, câți clienți aveți într-o seară obișnuită.

2. Alegem împreună o seară slabă din săptămână. Nu ocupăm mese la ore de vârf.

3. Facem prima rundă gratuit. Suntem acolo, punem codurile pe mese, rămânem până se termină.

{{want}}

Vedeți rezultatul și decideți. Nu semnați nimic înainte. Nu cerem exclusivitate și nu cerem nimic în avans.

Vă răspundem în două zile lucrătoare la orice întrebare.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      },

      book: {
        subiect: '{{loc}} — un subiect, o masă, un ritm',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Formatul nostru pentru librării și cafenele e diferit de cel dintr-un bar. Aici nu e cronometru, nu e rundă. E o masă, o oră, un subiect anunțat din timp, la aceeași oră în fiecare săptămână.

Gazda din partea dumneavoastră citește întrebarea și predă scena mesei. Atât.

Ce urmează:

1. Vorbim cincisprezece minute. Ne spuneți ce public aveți și ce subiecte ar merge.

2. Alegem împreună un subiect de start și o oră fixă.

3. Facem prima serie gratuit. Patru ediții, ca să vedeți dacă lumea revine.

{{want}}

Cifra pe care o urmărim nu e câți vin prima dată. Ci câți din prima ediție sunt și la a patra.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      },

      cult: {
        subiect: '{{loc}} — conversația de după vizită',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Ideea e simplă: o masă la finalul vizitei, cu un subiect legat de expoziția curentă. Nu intervine peste experiența expoziției și nu cere ghid sau curator.

Gazda din partea muzeului se ocupă de întâlnire. Nu ține o prezentare.

Ce urmează:

1. Vorbim cincisprezece minute. Ne spuneți ce expoziție aveți și ce public vine.

2. Alegem împreună un subiect și o oră fixă pe săptămână.

3. Facem prima serie gratuit. Rămânem până se termină.

{{want}}

Vizitatorii care schimbă o propoziție cu cineva se oprește altfel în fața unui obiect. Iar cei care au legat ceva revin.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      },

      hotel: {
        subiect: '{{loc}} — oaspeții care coboară',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Cei care călătoresc singuri cinează de obicei în cameră. O oră în lobby le dă un motiv simplu să coboare. Și să rămână.

Ce urmează:

1. Vorbim cincisprezece minute. Ne spuneți ce fel de oaspeți aveți și în ce sezon.

2. Alegem o oră din programul pe care îl aveți deja — de obicei înainte de cină.

3. Facem prima seară gratuit. Recepția apasă un buton. O fișă de o pagină spune ce face.

{{want}}

Amestecul dintre oaspeți și oameni din oraș e ce aduce oaspeții înapoi. Localnicii pot participa — e chiar recomandat.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      },

      term: {
        subiect: '{{loc}} — pornește singur',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Ce e diferit aici: nu e gazdă și nu se fac anunțuri. Sistemul pornește de la sine când sunt trei oameni care așteaptă în același interval, și se închide automat cu douăzeci de minute înainte de prima plecare.

Un cod QR printat pe masă. Nimic de instalat sau de întreținut.

Ce urmează:

1. Vorbim cincisprezece minute. Ne spuneți despre ce zonă e vorba și câți oameni trec pe acolo.

2. Alegem zonele potrivite — cafenele, lounge-uri, zone de așteptare cu mese.

3. Facem prima rundă gratuit. Rămânem până se termină.

{{want}}

Pasagerii care ar fi stat la poartă rămân în zona comercială. Consumul nu se mută, se adaugă.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      },

      agency: {
        subiect: '{{loc}} — un instrument pentru clienții dumneavoastră',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Pentru o agenție, HelloHuman nu e un serviciu pe care îl propuneți — e un instrument pe care îl puneți în pachet, iar noi îl livrăm.

Nu vă consumă timp din echipă. La final, clientul primește patru cifre scrise, cu numele agenției pe document. Ceva concret de arătat la următoarea ședință.

Ce urmează:

1. Vorbim cincisprezece minute. Ne spuneți ce fel de evenimente organizați și pentru ce clienți.

2. Vă trimitem configurația pentru un client pilot. O testați cu el.

3. Dacă funcționează, extindem. Dacă nu, rămâne pilotul.

{{want}}

Un eveniment care lasă în urmă un raport se recomandă mai departe. Se vede în bugetul următor.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      },

      other: {
        subiect: '{{loc}} — spuneți-ne mai multe',
        body: `Bună ziua,

Mulțumim pentru interesul arătat. Am notat că {{loc}} este în {{oras}}.

Nu ne place să clasificăm locurile în categorii fixe. Formatul funcționează oriunde oamenii stau în același loc fără să se cunoască.

Ce urmează:

1. Vorbim cincisprezece minute. Ne descrieți cum arată spațiul și cum îl folosesc oamenii acum.

2. Construim împreună o variantă potrivită pentru locul dumneavoastră. Nu una standard.

3. Facem prima rundă gratuit. Rămânem până se termină.

{{want}}

Ne place partea asta — locuri noi, situații noi, oameni noi. Spuneți-ne mai multe, iar noi venim.

Cu bine,
Echipa HelloHuman
contact@hellohuman.ro`
      }

    },

    en: {

      bar: {
        subiect: '{{loc}} — an evening that costs nothing',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

Here is what happens next, step by step:

1. We talk for fifteen minutes on the phone. You tell us what the room looks like, which hours work, how many customers you get on a normal evening.

2. We choose together a slow evening of the week. We do not take tables at peak hours.

3. We run the first round for free. We are there, we put the codes on the tables, we stay until it is over.

{{want}}

You see the result and decide. You sign nothing in advance. No exclusivity, nothing paid upfront.

We reply within two working days to any question.

Best,
The HelloHuman team
contact@hellohuman.ro`
      },

      book: {
        subiect: '{{loc}} — a topic, a table, a rhythm',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

Our format for bookshops and cafés differs from the one in a bar. No timer, no rounds. One table, one hour, a topic announced in advance, at the same hour every week.

Your host reads the question and hands the floor to the table. That is all.

What happens next:

1. We talk for fifteen minutes. You tell us about your audience and which topics might work.

2. We choose together a starting topic and a fixed hour.

3. We run the first series for free. Four editions, to see if people come back.

{{want}}

The figure we follow is not how many come the first time. It is how many from the first edition are there at the fourth.

Best,
The HelloHuman team
contact@hellohuman.ro`
      },

      cult: {
        subiect: '{{loc}} — the conversation after the visit',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

The idea is simple: one table at the end of the visit, on a subject tied to the current exhibition. It does not interfere with the exhibition experience and needs no guide or curator.

Your host handles the meeting. No presentation.

What happens next:

1. We talk for fifteen minutes. You tell us what exhibition you have and who comes.

2. We choose together a subject and a fixed hour each week.

3. We run the first series for free. We stay until it is over.

{{want}}

Visitors who exchange a sentence with someone stop differently in front of an object. And those who connected come back.

Best,
The HelloHuman team
contact@hellohuman.ro`
      },

      hotel: {
        subiect: '{{loc}} — guests who come down',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

Those travelling alone usually dine in their room. One hour in the lobby gives them a simple reason to come down. And to stay.

What happens next:

1. We talk for fifteen minutes. You tell us what kind of guests you have and in what season.

2. We choose an hour from the schedule you already run — usually before dinner.

3. We run the first evening for free. Reception presses a button. A one-page sheet tells them what to do.

{{want}}

The mix of guests and people from the city is what brings guests back. Locals can join — we recommend it.

Best,
The HelloHuman team
contact@hellohuman.ro`
      },

      term: {
        subiect: '{{loc}} — it starts on its own',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

What is different here: no host, no announcements. The system starts by itself when three people are waiting in the same window, and closes twenty minutes before the first departure.

A QR code printed on the table. Nothing to install or maintain.

What happens next:

1. We talk for fifteen minutes. You tell us which area it is and how many people pass through.

2. We choose the right zones — cafés, lounges, waiting areas with tables.

3. We run the first round for free. We stay until it is over.

{{want}}

Passengers who would have waited at the gate stay in the commercial area. Spending is not shifted, it is added.

Best,
The HelloHuman team
contact@hellohuman.ro`
      },

      agency: {
        subiect: '{{loc}} — an instrument for your clients',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

For an agency, HelloHuman is not a service you deliver — it is an instrument you put in the package, and we deliver it.

It takes no time from your team. At the end, the client receives four written figures, with the agency's name on the document. Something concrete to show at the next meeting.

What happens next:

1. We talk for fifteen minutes. You tell us what kind of events you run and for which clients.

2. We send you the configuration for a pilot client. You test it with them.

3. If it works, we extend. If not, the pilot stays.

{{want}}

An event that leaves a report behind gets recommended further. It shows in the next budget.

Best,
The HelloHuman team
contact@hellohuman.ro`
      },

      other: {
        subiect: '{{loc}} — tell us more',
        body: `Hello,

Thank you for your interest. We noted that {{loc}} is in {{city}}.

We do not like putting places into fixed categories. The format works anywhere people sit in the same place without knowing each other.

What happens next:

1. We talk for fifteen minutes. You describe the space and how people use it now.

2. We build together a version that fits your place. Not a standard one.

3. We run the first round for free. We stay until it is over.

{{want}}

We like this part — new places, new situations, new people. Tell us more, and we come.

Best,
The HelloHuman team
contact@hellohuman.ro`
      }

    }
  }
};