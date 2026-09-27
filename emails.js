/* ============================================================
   emails.js — textele de email pentru CRM.
   Se incarca in crm.html cu: <script src="/emails.js"></script>
   Variabile: {{companie}}, {{loc}}, {{oras}}, {{reducere}},
              {{raspuns2}}, {{raspuns3}}, {{nume}}, {{profil}}, {{want}}
   ============================================================ */

var EMAILS = {

  /* ============ CORPORATE ============ */
  corporate: {
    ro: {
      SILO: {
        subiect: 'Soluție pentru coeziunea inter-departamentală',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Găsiți propunerea de arhitectură a coeziunii aici — un document executiv, un minut de parcurs:
https://hellohuman.ro/masuram?p={{profil}}

Prezentarea demonstrează cum putem construi punți de vizibilitate între departamente, în 14 zile, cu integrare IT zero și fără a perturba sistemele curente.

{{raspuns3}}

{{reducere}}

Rămân la dispoziția dumneavoastră pentru a discuta aplicabilitatea în cadrul organizației, fără angajamente.

Toate cele bune,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      VIZIBILITATE: {
        subiect: 'Cartografierea invizibilă a organizației dumneavoastră',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Găsiți documentația de arhitectură a coeziunii aici — un rezumat executiv de un minut:
https://hellohuman.ro/masuram?p={{profil}}

Documentul expune exact ceea ce veți vedea la finalul procesului: o hartă clară a interacțiunilor reale între echipe, dincolo de organigrama formală. Totul strict anonimizat la nivel de departament.

{{raspuns3}}

{{reducere}}

Dacă doriți să consultați un raport de impact real, vi-l pot pune la dispoziție.

Toate cele bune,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      DOVADA: {
        subiect: 'Date măsurabile pentru strategii de HR',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Găsiți documentația tehnică aici — un rezumat executiv, clar și concis:
https://hellohuman.ro/masuram?p={{profil}}

Propunerea include metricile fundamentale și fundamentarea lor pe cercetări europene riguroase. Metodologia completă de extragere a ROI-ului se regăsește în anexă.

{{raspuns3}}

{{reducere}}

La cererea departamentului dumneavoastră juridic, pot furniza în avans documentația completă de securitate și prelucrare a datelor.

Toate cele bune,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      FRICTIUNE: {
        subiect: 'Implementare frictionless. Integrare IT zero.',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Găsiți descrierea ecosistemului aici — un minut de parcurs:
https://hellohuman.ro/masuram?p={{profil}}

Sistemul nostru se remarcă prin absența fricțiunilor tehnice. Nu solicităm acces la rețele interne, nu instalăm aplicații și nu consumăm resurse operaționale. Ecosistemul funcționează complet autonom.

{{raspuns3}}

{{reducere}}

Controlul rămâne 100% la dumneavoastră. Sistemul poate fi oprit instantaneu, fără a lăsa nicio amprentă digitală.

Toate cele bune,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      EFICIENTA: {
        subiect: 'Arhitectura unui program de coeziune în 14 zile',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Găsiți modelul de implementare aici — un document executiv clar și concis:
https://hellohuman.ro/masuram?p={{profil}}

Prezentarea detaliază arhitectura soluției livrabile în 14 zile și setul de date pe baza cărora puteți fundamenta decizii de management. Soluția este croită specific pe provocările pe care ni le-ați semnalat.

{{raspuns3}}

{{reducere}}

Sunt disponibil să calculăm împreună impactul strategic și financiar pentru organizația dumneavoastră.

Toate cele bune,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      STATUSQUO: {
        subiect: 'Implementare pilot. Risc operațional zero.',
        body: `Bună ziua,

Vă mulțumesc pentru răspunsurile oferite.

Găsiți etapele de arhitectură organizațională aici — un rezumat executiv:
https://hellohuman.ro/masuram?p={{profil}}

Documentul structurează procesul în 3 pași rapizi de implementare. Nu presupune niciun contract preliminar, iar inițierea pilotului este integral susținută de noi.

{{raspuns3}}

{{reducere}}

Analizați propunerea în ritmul dumneavoastră. Dacă structura face sens pentru companie, sunt aici să discutăm.

Toate cele bune,
Bogdan Oprea
bogdan@hellohuman.ro`
      }
    },
    en: {
      SILO: {
        subiect: 'Cross-departmental cohesion solution',
        body: `Hello,

Thank you for your answers.

Here is the cohesion architecture proposal — an executive brief, one minute to read:
https://hellohuman.ro/masuram?p={{profil}}

It demonstrates how we can build visibility bridges between departments in 14 days, with zero IT integration and without disrupting current workflows.

{{raspuns3}}

{{reducere}}

I remain at your disposal to discuss its applicability within your organization, completely obligation-free.

Best regards,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      VIZIBILITATE: {
        subiect: 'The invisible map of your organization',
        body: `Hello,

Thank you for your answers.

Here is the cohesion architecture documentation — an executive brief:
https://hellohuman.ro/masuram?p={{profil}}

The document outlines exactly what you will see at the end of the process: a clear map of real interactions between teams, bypassing the formal org chart. Everything strictly anonymized at the departmental level.

{{raspuns3}}

{{reducere}}

If you would like to examine a live impact report, I can provide one for reference.

Best regards,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      DOVADA: {
        subiect: 'Measurable data for HR strategies',
        body: `Hello,

Thank you for your answers.

Here is the technical documentation — an executive summary:
https://hellohuman.ro/masuram?p={{profil}}

The proposal includes fundamental metrics grounded in rigorous European research. The complete methodology for extracting ROI is available in the appendix.

{{raspuns3}}

{{reducere}}

At your legal department's request, I can provide comprehensive data security and processing documentation in advance.

Best regards,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      FRICTIUNE: {
        subiect: 'Frictionless deployment. Zero IT integration.',
        body: `Hello,

Thank you for your answers.

Here is the ecosystem overview — an executive brief:
https://hellohuman.ro/masuram?p={{profil}}

Our system is defined by its lack of technical friction. We require no access to internal networks, install no applications, and consume zero operational resources. The ecosystem functions completely autonomously.

{{raspuns3}}

{{reducere}}

You retain 100% control. The system can be terminated instantly, leaving zero digital footprint.

Best regards,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      EFICIENTA: {
        subiect: 'Cohesion architecture program in 14 days',
        body: `Hello,

Thank you for your answers.

Here is the deployment model — a clear, concise executive document:
https://hellohuman.ro/masuram?p={{profil}}

The presentation details the solution architecture deliverable in 14 days and the dataset you can use to drive management decisions. The solution is tailored specifically to the challenges you highlighted.

{{raspuns3}}

{{reducere}}

I am available to calculate the strategic and financial impact for your organization together.

Best regards,
Bogdan Oprea
bogdan@hellohuman.ro`
      },
      STATUSQUO: {
        subiect: 'Pilot deployment. Zero operational risk.',
        body: `Hello,

Thank you for your answers.

Here are the organizational architecture stages — an executive summary:
https://hellohuman.ro/masuram?p={{profil}}

The document structures the process into 3 rapid deployment steps. It requires no preliminary contracts, and the pilot initiation is entirely supported by us.

{{raspuns3}}

{{reducere}}

Review the proposal at your own pace. If the framework makes sense for your company, I am here to discuss it.

Best regards,
Bogdan Oprea
bogdan@hellohuman.ro`
      }
    }
  },

  /* ============ LOCALURI ============ */
  /* NOTĂ: Emailurile pentru localuri (bar, book, cafe, cult, hotel, term) rămân neschimbate 
     pentru a păstra mesajele care funcționează deja. Modificăm doar ramura agency. */
  localuri: {
    ro: {

      // ... [Segmentele bar, book, cafe, cult, hotel, term rămân la fel ca în sursa originală] ...

      agency: {
        subiect: '{{loc}} — arhitectură de coeziune pentru clienții dumneavoastră',
        body: `Bună ziua,

Vă mulțumim pentru interesul arătat. Am notat că agenția dumneavoastră acoperă zona {{oras}}.

Pentru o agenție B2B, HelloHuman nu este doar un serviciu — este o arhitectură de coeziune organizațională pe care o integrați în propunerile dumneavoastră, cu risc operațional zero.

Ce urmează:

1. O discuție strategică de cincisprezece minute. Analizăm tipologia evenimentelor corporate pe care le gestionați.

2. Vă transmitem arhitectura tehnică pentru o implementare pilot la un client selectat.

3. Validăm impactul. Dacă datele generează valoare, extindem parteneriatul.

{{want}}

Valoarea adăugată pentru agenție:

— O soluție premium propusă, fără efort de execuție. O integrați în arhitectura evenimentului, noi o livrăm integral. Zero consum de resurse din partea echipei dumneavoastră.

— Un raport executiv pe biroul clientului. La final, clientul primește un document cu KPI-uri, purtând brandul agenției. Argumentul perfect pentru justificarea ROI-ului.

— Generarea recurenței bugetare. Un eveniment cu impact măsurabil justifică un nou buget. Parteneriatul dumneavoastră devine indispensabil strategic.

Suntem pregătiți să discutăm cum integrăm acest modul în viitoarele dumneavoastră pitch-uri.

Toate cele bune,
Bogdan Oprea, HelloHuman
contact@hellohuman.ro`
      },

      other: {
        // Rămâne la fel
      }

    },

    en: {

      // ... [Segmentele bar, book, cafe, cult, hotel, term rămân la fel ca în sursa originală] ...

      agency: {
        subiect: '{{loc}} — cohesion architecture for your enterprise clients',
        body: `Hello,

Thank you for your interest. We noted your agency operations cover {{oras}}.

For a B2B agency, HelloHuman is not just another service to deliver — it is an organizational cohesion architecture you integrate directly into your proposals, carrying zero operational risk.

What happens next:

1. A fifteen-minute strategic discussion. We analyze the typology of the corporate events you manage.

2. We provide the technical architecture for a pilot deployment with a selected client.

3. We validate the impact. If the metrics drive value, we scale the partnership.

{{want}}

Added value for your agency:

— A premium solution proposed, without execution overhead. You embed it into the event's architecture, we deliver it seamlessly. Zero internal resources consumed.

— An executive report on the client's desk. At the end, the client receives a KPI document bearing your agency's brand. The definitive tool to justify ROI.

— Securing budget recurrence. An event with measurable impact secures the next budget allocation. Your partnership transitions from vendor to strategic ally.

We are ready to discuss how to embed this module into your upcoming pitches.

Best regards,
Bogdan Oprea, HelloHuman
contact@hellohuman.ro`
      },

      other: {
        // Rămâne la fel
      }

    }
  }
};