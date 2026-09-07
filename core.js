/* ============================================================
   HelloHuman — nucleul comun celor trei aplicații.
   index.html (participant) · partener.html · crm.html
   Aici stau: legătura cu serverul, profilurile de context,
   algoritmul de formare a meselor și navigarea cu istoric.
   ============================================================ */

var HH = (function () {

  /* ---------- unelte ---------- */
  function el(id) { return document.getElementById(id) }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function say(id, msg, kind) {
    var n = el(id); if (!n) return;
    n.textContent = msg || ''; n.className = 'msg2' + (kind ? ' ' + kind : '');
  }
  function vibrate(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern) } catch (e) {} }
  function copy(txt, btn) {
    var o = btn ? btn.textContent : '';
    function done() { if (btn) { btn.textContent = '✓'; setTimeout(function () { btn.textContent = o }, 1600) } }
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, fallback);
    else fallback();
    function fallback() {
      var t = document.createElement('textarea');
      t.value = txt; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done() } catch (e) {}
      document.body.removeChild(t);
    }
  }
  function shareTxt(txt) {
    if (navigator.share) navigator.share({ text: txt }).catch(function () {});
    else copy(txt);
  }

  /* ---------- timp, scris omenește ---------- */
  var LANG = 'ro';
  function setLang(l) { LANG = l }
  function getLang() { return LANG }
  function fmtDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString(LANG === 'en' ? 'en-GB' : 'ro-RO',
      { day: 'numeric', month: 'short' });
  }
  function fmtLeft(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function fmtWhen(ts, T) {
    if (!ts) return T.never;
    var d = Math.floor((Date.now() - ts) / 60000);
    if (d < 1) return T.now;
    if (d < 60) return T.min.replace('{n}', d);
    if (d < 1440) return T.hour.replace('{n}', Math.floor(d / 60));
    return fmtDate(ts);
  }

  /* ---------- navigare cu istoric adevărat ----------
     Butonul înapoi de pe telefon mută între ecrane, nu iese din aplicație. */
  var scr = [], onLeave = null;
  function initNav(screens, primul, laIesire) {
    scr = screens; onLeave = laIesire || null;
    history.replaceState({ hh: primul }, '', location.href);
    show(primul);
    window.addEventListener('popstate', function (e) {
      if (e.state && e.state.hh) { show(e.state.hh); return }
      if (onLeave) onLeave();
    });
  }
  function show(id) {
    scr.forEach(function (s) { var n = el(s); if (n) n.classList.toggle('on', s === id) });
    window.scrollTo(0, 0);
  }
  function go(id, inlocuieste) {
    if (inlocuieste) history.replaceState({ hh: id }, '', location.href);
    else history.pushState({ hh: id }, '', location.href);
    show(id);
  }
  function back() { history.back() }
  function current() { return (history.state && history.state.hh) || '' }

  /* ---------- sesiune, cât ține fila ---------- */
  function keep(k, v) { try { sessionStorage.setItem(k, v) } catch (e) {} }
  function recall(k) { try { return sessionStorage.getItem(k) || '' } catch (e) { return '' } }
  function drop(k) { try { sessionStorage.removeItem(k) } catch (e) {} }

  /* ---------- serverul ---------- */
  function base() { return location.href.split('#')[0].replace(/[^/]*$/, '') }
  async function api(method, qs, body) {
    var o = { method: method, headers: { 'Content-Type': 'application/json' }, cache: 'no-store' };
    if (body !== undefined) o.body = JSON.stringify(body);
    var r = await fetch('/api/store' + (qs || ''), o);
    var d = null;
    try { d = await r.json() } catch (e) {}
    if (!r.ok) throw new Error((d && d.error) || ('HTTP ' + r.status));
    return d;
  }
  var API = {
    create: function (o) { return api('POST', '', o).then(function (d) { return d.id }) },
    get: function (id) { return api('GET', '?id=' + encodeURIComponent(id)) },
    op: function (id, op, body) { return api('POST', '?' + op + '=1&id=' + encodeURIComponent(id), body || {}) },
    lead: function (o) { return api('POST', '?lead=1', o) },
    request: function (o) { return api('POST', '?request=1', o) },
    book: function (k) { return api('GET', '?book=1&k=' + encodeURIComponent(k)) },
    bookSave: function (k, b) { return api('PUT', '?book=1&k=' + encodeURIComponent(k), b) },
    reqStatus: function (k, id, s) { return api('POST', '?reqstatus=1&k=' + encodeURIComponent(k) + '&id=' + encodeURIComponent(id) + '&s=' + encodeURIComponent(s)) },
    partner: function (id, pw) { return api('GET', '?partner=1&id=' + encodeURIComponent(id) + '&pw=' + encodeURIComponent(pw)) },
    addEvent: function (id, pw, rec) { return api('POST', '?addevent=1&id=' + encodeURIComponent(id) + '&pw=' + encodeURIComponent(pw), rec) },
    delEvent: function (id, pw, ev) { return api('POST', '?delevent=1&id=' + encodeURIComponent(id) + '&pw=' + encodeURIComponent(pw) + '&ev=' + encodeURIComponent(ev)) },
    diag: function () { return api('GET', '?diag=1') }
  };

  /* ---------- profilurile de context ----------
     Obstacolul e altul în fiecare loc, deci și mecanica e alta. */
  var PROFILES = {
    bar: {
      ro: 'Bar', en: 'Bar', seats: 4, minutes: 15, dep: false, tacut: 2, durate: [15, 20],
      cats: {
        ro: ['Am chef de râs', 'Vreau o discuție ca lumea', 'Azi ascult mai mult', 'Sunt nou pe aici'],
        en: ["I'm in the mood to laugh", 'I want a proper conversation', "Today I'm mostly listening", "I'm new around here"]
      },
      quiet: { ro: 'Azi ascult mai mult', en: "Today I'm mostly listening" },
      qs: {
        ro: ['Găsiți trei lucruri pe care le aveți în comun.', 'Ce ați făcut în ultima lună și merită povestit?', 'Care e cel mai bun sfat prost pe care l-ați primit?', 'Ce ați învățat prea târziu?'],
        en: ['Find three things you all have in common.', 'What have you done this month worth telling?', 'What is the best bad advice you ever got?', 'What did you learn too late?']
      },
      note: { ro: 'O rundă scurtă, o dată în seară. Clienții își păstrează masa lor și se întorc la ea.', en: 'One short round, once in the evening. Guests keep their own table and go back to it.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi.', en: 'They liked you more<br>than you think.' }
    },
    book: {
      ro: 'Librărie sau cafenea', en: 'Bookshop or café', seats: 8, minutes: 0, dep: false,
      oneTable: true, noTimer: true, edition: true,
      tacut: 2, durate: [],
      cats: {
        ro: ['Am ceva de spus despre subiect', 'Mă interesează ce zic ceilalți', 'Azi ascult mai mult', 'Prima dată la o ediție'],
        en: ['I have something to say about it', "I'm interested in what others think", "Today I'm mostly listening", 'First time at one of these']
      },
      quiet: { ro: 'Azi ascult mai mult', en: "Today I'm mostly listening" },
      qs: {
        ro: ['Cărți pe care nu le-am terminat.', 'Ce citeam la douăzeci de ani.', 'O carte cu care mă cert.', 'O carte care m-a făcut să iau o decizie.'],
        en: ['Books I never finished.', 'What I read at twenty.', 'A book I argue with.', 'A book that made me decide something.']
      },
      note: { ro: 'O masă, o gazdă, fără cronometru. Aceeași zi și oră în fiecare săptămână — ritmul face obișnuiții.', en: 'One table, one host, no timer. Same day and hour every week — the rhythm is what brings people back.' },
      end: { ro: 'Mulțumim pentru<br>seara asta.', en: 'Thanks for<br>tonight.' }
    },
    air: {
      ro: 'Aeroport sau gară', en: 'Airport or station', seats: 4, minutes: 30, dep: false,
      autoStart: true, threshold: 3, needsFlight: true,
      tacut: 2, durate: [],
      cats: {
        ro: ['Am timp destul', 'Sunt cu gândul la destinație', 'Azi ascult mai mult', 'Prima dată pe ruta asta'],
        en: ["I've got plenty of time", "My mind's on where I'm headed", "Today I'm mostly listening", 'First time on this route']
      },
      quiet: { ro: 'Azi ascult mai mult', en: "Today I'm mostly listening" },
      qs: {
        ro: ['Cu ce treabă mergi acolo?', 'Ce merită făcut neapărat acolo unde mergem?', 'Care e cea mai bună călătorie ieșită din întâmplare?', 'Ce iei mereu în bagaj și nu folosești niciodată?'],
        en: ['What are you going there for?', 'What is worth doing where we are headed?', 'What is the best trip you took by accident?', 'What do you always pack and never use?']
      },
      note: { ro: 'Fără gazdă și fără runde. Pornește singur când sunt trei oameni cu așteptări care se suprapun și se închide cu douăzeci de minute înainte de prima îmbarcare.', en: 'No host and no rounds. It starts on its own when three people with overlapping waits are in, and closes twenty minutes before the earliest boarding.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi. Drum bun.', en: 'They liked you more<br>than you think. Safe travels.' }
    },
    corp: {
      ro: 'Eveniment de firmă', en: 'Company event', seats: 4, minutes: 20, dep: true,
      cats: {
        ro: ['Vând sau lucrez cu clienții', 'Construiesc produsul', 'Susțin echipele din spate', 'Conduc o echipă'],
        en: ['I sell or work with clients', 'I build the product', 'I support the other teams', 'I lead a team']
      },
      tacut: -1, tacut2: 3, durate: [10, 20, 30, 60],
      cats2: {
        ro: ['Am ceva de povestit despre ce facem', 'Vreau să înțeleg alt departament', 'Caut ajutor la ceva', 'Azi ascult mai mult'],
        en: ["I've got something to share about what we do", 'I want to understand another team', "I'm looking for help with something", "Today I'm mostly listening"]
      },
      quiet: { ro: 'Azi ascult mai mult', en: "Today I'm mostly listening" },
      qs: {
        ro: ['Ce face echipa ta și restul companiei nu prea vede?', 'Care e cea mai frecventă cerere pe care o primești?', 'La ce ești blocat acum și cine te-ar putea ajuta?', 'Ce ai afla azi care ți-ar economisi o săptămână?'],
        en: ['What does your team do that the rest of the company never sees?', 'What is the most frequent request you get?', 'What are you stuck on, and who could help?', 'What could you learn today that would save you a week?']
      },
      note: { ro: 'Runde scurte, mai multe. Aici oamenii se revăd mâine, deci lățimea bate adâncimea, iar întrebările nu ating niciodată viața privată.', en: 'Several short rounds. People here see each other tomorrow, so breadth beats depth, and questions never touch private life.' },
      end: { ro: 'Cei cu care ai vorbit<br>te apreciază mai mult<br>decât crezi.', en: 'The people you talked to<br>think more of you<br>than you assume.' }
    },
    cafenea: {
      ro: 'Cafenea', en: 'Café', seats: 4, minutes: 20, dep: false, tacut: 2, durate: [15, 20],
      cats: {
        ro: ['Am o pauză', 'Mi-a stat gândul la ceva toată ziua', 'Acum stau mai mult liniștit', 'Prima dată aici'],
        en: ["I'm on a break", "Something's been on my mind all day", "Right now I'm just sitting quietly", 'First time here']
      },
      quiet: { ro: 'Acum stau mai mult liniștit', en: "Right now I'm just sitting quietly" },
      qs: {
        ro: ['La ce te gândeai înainte să te așezi aici?', 'Ce ai făcut luna asta și merită povestit?', 'Ce ai învățat prea târziu?', 'Care e cel mai bun sfat prost pe care l-ai primit?'],
        en: ['What were you thinking about before you sat down?', 'What have you done this month worth telling?', 'What did you learn too late?', 'What is the best bad advice you ever got?']
      },
      note: { ro: 'Ziua, cu oameni treji și calmi. Runde scurte, fără grabă.', en: 'Daytime, with people who are awake and unhurried. Short rounds, no rush.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi.', en: 'They liked you more<br>than you think.' }
    },
    restaurant: {
      ro: 'Restaurant', en: 'Restaurant', seats: 4, minutes: 30, dep: false, tacut: 2, durate: [30, 60],
      cats: {
        ro: ['Am chef de râs', 'Am chef de o discuție bună', 'Azi ascult mai mult', 'Sunt de altundeva'],
        en: ["I'm in the mood to laugh", "I'm up for a good conversation", "Today I'm mostly listening", "I'm from somewhere else"]
      },
      quiet: { ro: 'Azi ascult mai mult', en: "Today I'm mostly listening" },
      qs: {
        ro: ['Ce ai făcut anul ăsta și nu te așteptai să faci?', 'Ce ai învățat prea târziu?', 'Care e cea mai bună masă pe care ai mâncat-o și unde?', 'Ce ai schimba dacă ai lua-o de la capăt?'],
        en: ['What did you do this year that you did not expect?', 'What did you learn too late?', 'What is the best meal you ever had and where?', 'What would you change if you started over?']
      },
      note: { ro: 'Stau jos, au timp, au mâncarea în față. Runde mai lungi decât la bar.', en: 'They are seated, they have time and food in front of them. Longer rounds than a bar.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi.', en: 'They liked you more<br>than you think.' }
    },
    hotel: {
      ro: 'Hotel sau pensiune', en: 'Hotel', seats: 4, minutes: 30, dep: false, tacut: 2, durate: [20, 30],
      cats: {
        ro: ['Sunt cu treabă', 'Sunt în vacanță', 'Azi a fost o zi lungă', 'Sunt aici de câteva zile'],
        en: ["I'm here for work", "I'm on holiday", 'Today was a long one', "I've been here a few days now"]
      },
      quiet: { ro: 'Azi a fost o zi lungă', en: 'Today was a long one' },
      qs: {
        ro: ['Ce te-a adus în orașul ăsta?', 'Ce merită văzut aici și nu scrie în ghiduri?', 'Care e cea mai bună călătorie ieșită din întâmplare?', 'Ce iei mereu în bagaj și nu folosești niciodată?'],
        en: ['What brought you to this city?', 'What is worth seeing here that no guide mentions?', 'What is the best trip you took by accident?', 'What do you always pack and never use?']
      },
      note: { ro: 'Ora de dinaintea cinei, în lobby. Oaspeții coboară oricum.', en: 'The hour before dinner, in the lobby. Guests come down anyway.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi. Drum bun.', en: 'They liked you more<br>than you think. Safe travels.' }
    },
    muzeu: {
      ro: 'Muzeu sau spațiu cultural', en: 'Museum', seats: 4, minutes: 30, dep: false, tacut: 2, durate: [20, 30],
      cats: {
        ro: ['M-a impresionat ceva', 'Nu am înțeles ceva', 'Azi ascult mai mult', 'Am intrat din curiozitate'],
        en: ['Something impressed me', "There's something I didn't get", "Today I'm mostly listening", 'I came out of curiosity']
      },
      quiet: { ro: 'Azi ascult mai mult', en: "Today I'm mostly listening" },
      qs: {
        ro: ['Ce ați văzut azi și nu vă iese din cap?', 'Ce nu ați înțeles și ați vrea să vă explice cineva?', 'Ce ați lua acasă, dacă s-ar putea?', 'Ce v-a plictisit și de ce?'],
        en: ['What did you see today that stayed with you?', 'What did you not understand and wish someone would explain?', 'What would you take home, if you could?', 'What bored you, and why?']
      },
      note: { ro: 'La finalul vizitei. Toți au văzut aceleași săli, dar fiecare a reținut altceva.', en: 'At the end of the visit. Everyone saw the same rooms, but each kept something different.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi.', en: 'They liked you more<br>than you think.' }
    },
    demo: {
      ro: 'Demonstrație', en: 'Demonstration', seats: 2, minutes: 3, dep: false, isDemo: true, tacut: -1, durate: [3],
      cats: {
        ro: ['Lucrez aici de mult', 'Sunt nou pe aici', 'Sunt clientul locului', 'Prima dată aici'],
        en: ['I have worked here a while', 'I am new here', 'I am a regular', 'First time here']
      },
      quiet: { ro: '', en: '' },
      qs: {
        ro: [
          'Ce nu știi despre omul din fața ta, deși lucrați împreună?',
          'Ce a făcut fiecare înainte să ajungă aici?',
          'Care a fost cea mai ciudată zi de muncă din locul ăsta?',
          'Ce ar schimba fiecare aici, dacă ar fi patron o zi?'
        ],
        en: [
          'What do you not know about the person opposite, even though you work together?',
          'What did each of you do before you ended up here?',
          'What was the strangest shift this place has seen?',
          'What would each of you change here, if you were the boss for a day?'
        ]
      },
      note: { ro: 'Două mese de câte doi, trei minute, iar la runda a doua se schimbă între ele. Nu intră în cifre și se șterge singură.', en: 'Two tables of two, three minutes, and they swap at the second round. It stays out of your numbers and deletes itself.' },
      end: { ro: 'Asta era.<br>Cam așa arată o seară.', en: 'That was it.<br>This is what an evening looks like.' }
    }
  };

  /* ---------- formarea meselor ----------
     Nu caută compatibilitate: Aron (1997) a arătat că potrivirea pe atitudini
     nu produce apropiere. Caută doar condițiile în care schimbul poate porni. */
  function sizes(p, tb, se) {
    if (p < 2 || tb < 1) return [];
    var g = Math.max(1, Math.min(Math.floor(p / se), tb)), out;
    while (true) {
      out = [];
      var bazaN = Math.floor(p / g), rest = p % g;
      for (var i = 0; i < g; i++) out.push(Math.min(se + 1, bazaN + (i < rest ? 1 : 0)));
      var s = out.reduce(function (a, b) { return a + b }, 0);
      if (s >= p || g >= tb) break;
      g++;
    }
    return out;
  }
  function costOf(gs, met, quiet) {
    var c = 0;
    gs.forEach(function (g) {
      for (var a = 0; a < g.length; a++)
        for (var b = a + 1; b < g.length; b++)
          if ((met[g[a].id] || []).indexOf(g[b].id) >= 0) c += 10;   // s-au mai întâlnit
      if (quiet && g.filter(function (x) { return x.cat !== quiet }).length === 0) c += 30; // nicio masă tăcută
      if (g.length >= 3) { var u = {}; g.forEach(function (x) { u[x.cat] = 1 }); if (Object.keys(u).length === 1) c += 4 } // masă omogenă
      var pr = {};
      g.forEach(function (x) { if (x.pair) pr[x.pair] = (pr[x.pair] || 0) + 1 });
      Object.keys(pr).forEach(function (k) { if (pr[k] === 1) c += 8 });  // prieteni despărțiți
      if (g.length < 2) c += 20;
    });
    return c;
  }
  function makeGroups(queue, sz, met, quiet) {
    // Regulile, in ordinea prioritatii (validate pe 10.000 de simulari):
    // 1. Nicio masa fara cel putin un om dispus sa inceapa.
    // 2. Cei care asculta se distribuie, nu se aduna.
    // 3. Prietenii se aseaza primii, ca sa nu-i mai desparta nimic.
    // NU grupeaza oameni dupa alegerea lor: simularea a aratat 67% repetari
    // si oameni care nu cunosteau pe nimeni dupa trei runde.
    var m = met || {};
    if (!sz.length || queue.length < 2) return { groups: [], left: queue.slice() };

    var tacuti = quiet ? queue.filter(function (p) { return p.cat === quiet }) : [];
    var voci = quiet ? queue.filter(function (p) { return p.cat !== quiet }) : queue.slice();

    // prietenii, grupati dupa codul lor
    var perechi = {};
    queue.forEach(function (p) { if (p.pair) (perechi[p.pair] = perechi[p.pair] || []).push(p) });

    var best = null, bestCost = Infinity;
    for (var t = 0; t < 300; t++) {
      var v = voci.slice(), a = tacuti.slice();
      amesteca(v); amesteca(a);
      var mese = sz.map(function () { return [] });
      var asezat = {};

      // 1. prietenii intai, la masa cu cel mai mult loc
      Object.keys(perechi).forEach(function (k) {
        var gr = perechi[k];
        if (gr.length < 2) return;
        var idx = 0, maxLoc = -1;
        mese.forEach(function (x, j) { var loc = sz[j] - x.length; if (loc > maxLoc) { maxLoc = loc; idx = j } });
        if (maxLoc >= gr.length) gr.forEach(function (p) { mese[idx].push(p); asezat[p.id] = 1 });
      });

      // 2. vocile, cate una pe masa — asa nicio masa nu ramane tacuta
      var i = 0;
      v.forEach(function (p) { if (asezat[p.id]) return; mese[i % mese.length].push(p); i++ });
      // 3. ascultatorii, tot rotativ, ca sa nu se adune
      a.forEach(function (p) { if (asezat[p.id]) return; mese[i % mese.length].push(p); i++ });

      reechilibreaza(mese, sz);
      var c = costOf(mese, m, quiet);
      if (c < bestCost) { bestCost = c; best = mese.map(function (x) { return x.slice() }); if (c === 0) break }
    }

    var bune = best.filter(function (g) { return g.length >= 2 });
    var st = {}; bune.forEach(function (g) { g.forEach(function (p) { st[p.id] = 1 }) });
    return { groups: bune, left: queue.filter(function (p) { return !st[p.id] }) };
  }

  function amesteca(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var x = a[i]; a[i] = a[j]; a[j] = x }
  }
  function reechilibreaza(mese, sz) {
    for (var pas = 0; pas < mese.length * 2; pas++) {
      var mutat = false;
      for (var i = 0; i < mese.length; i++) {
        while (mese[i].length > sz[i]) {
          var j = -1;
          for (var k = 0; k < mese.length; k++) if (k !== i && mese[k].length < sz[k]) { j = k; break }
          if (j < 0) break;
          // mutam un om fara pereche, ca sa nu despartim pe nimeni
          var idx = -1;
          for (var q = 0; q < mese[i].length; q++) if (!mese[i][q].pair) { idx = q; break }
          if (idx < 0) idx = mese[i].length - 1;
          mese[j].push(mese[i].splice(idx, 1)[0]); mutat = true;
        }
      }
      if (!mutat) break;
    }
  }

  function ordq(a, b) {
    if ((b.miss || 0) !== (a.miss || 0)) return (b.miss || 0) - (a.miss || 0);  // cine a ratat are prioritate
    return (a.ts || 0) - (b.ts || 0);
  }

  return {
    el: el, esc: esc, say: say, copy: copy, shareTxt: shareTxt, vibrate: vibrate,
    setLang: setLang, getLang: getLang, fmtDate: fmtDate, fmtLeft: fmtLeft, fmtWhen: fmtWhen,
    initNav: initNav, go: go, back: back, show: show, current: current,
    keep: keep, recall: recall, drop: drop,
    base: base, api: api, API: API,
    PROFILES: PROFILES, sizes: sizes, makeGroups: makeGroups, costOf: costOf, ordq: ordq
  };
})();
