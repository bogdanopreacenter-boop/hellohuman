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
      ro: 'Bar sau restaurant', en: 'Bar or restaurant', seats: 3, minutes: 15, dep: false,
      cats: {
        ro: ['Vreau să râd', 'Vreau o discuție ca lumea', 'Vreau mai mult să ascult', 'Vreau să cunosc pe cineva nou'],
        en: ['I want to laugh', 'I want a real conversation', 'I would rather listen', 'I want to meet someone new']
      },
      quiet: { ro: 'Vreau mai mult să ascult', en: 'I would rather listen' },
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
      cats: {
        ro: ['Prima dată aici', 'Vin des', 'Am venit cu cineva', 'Am intrat din întâmplare'],
        en: ['First time here', 'I come often', 'I brought someone', 'I just walked in']
      },
      quiet: { ro: '', en: '' },
      qs: {
        ro: ['Cărți pe care nu le-am terminat.', 'Ce citeam la douăzeci de ani.', 'O carte cu care mă cert.', 'O carte care m-a făcut să iau o decizie.'],
        en: ['Books I never finished.', 'What I read at twenty.', 'A book I argue with.', 'A book that made me decide something.']
      },
      note: { ro: 'O masă, o gazdă, fără cronometru. Aceeași zi și oră în fiecare săptămână — ritmul face obișnuiții.', en: 'One table, one host, no timer. Same day and hour every week — the rhythm is what brings people back.' },
      end: { ro: 'Mulțumim pentru<br>seara asta.', en: 'Thanks for<br>tonight.' }
    },
    air: {
      ro: 'Aeroport sau gară', en: 'Airport or station', seats: 3, minutes: 30, dep: false,
      autoStart: true, threshold: 3, needsFlight: true,
      cats: {
        ro: ['Prima dată în orașul ăsta', 'Locuiesc unde mergem', 'Călătoresc cu treabă', 'Doar în tranzit'],
        en: ['First time in this city', 'I live where we are going', 'Travelling for work', 'Just passing through']
      },
      quiet: { ro: '', en: '' },
      qs: {
        ro: ['Cu ce treabă mergi acolo?', 'Ce merită făcut neapărat acolo unde mergem?', 'Care e cea mai bună călătorie ieșită din întâmplare?', 'Ce iei mereu în bagaj și nu folosești niciodată?'],
        en: ['What are you going there for?', 'What is worth doing where we are headed?', 'What is the best trip you took by accident?', 'What do you always pack and never use?']
      },
      note: { ro: 'Fără gazdă și fără runde. Pornește singur când sunt trei oameni cu așteptări care se suprapun și se închide cu douăzeci de minute înainte de prima îmbarcare.', en: 'No host and no rounds. It starts on its own when three people with overlapping waits are in, and closes twenty minutes before the earliest boarding.' },
      end: { ro: 'Le-ai plăcut mai mult<br>decât crezi. Drum bun.', en: 'They liked you more<br>than you think. Safe travels.' }
    },
    corp: {
      ro: 'Eveniment de firmă', en: 'Company event', seats: 3, minutes: 10, dep: true,
      cats: {
        ro: ['Vând sau lucrez cu clienții', 'Construiesc produsul', 'Susțin echipele din spate', 'Conduc o echipă'],
        en: ['I sell or work with clients', 'I build the product', 'I support the other teams', 'I lead a team']
      },
      quiet: { ro: '', en: '' },
      qs: {
        ro: ['Ce face echipa ta și restul companiei nu prea vede?', 'Care e cea mai frecventă cerere pe care o primești?', 'La ce ești blocat acum și cine te-ar putea ajuta?', 'Ce ai afla azi care ți-ar economisi o săptămână?'],
        en: ['What does your team do that the rest of the company never sees?', 'What is the most frequent request you get?', 'What are you stuck on, and who could help?', 'What could you learn today that would save you a week?']
      },
      note: { ro: 'Runde scurte, mai multe. Aici oamenii se revăd mâine, deci lățimea bate adâncimea, iar întrebările nu ating niciodată viața privată.', en: 'Several short rounds. People here see each other tomorrow, so breadth beats depth, and questions never touch private life.' },
      end: { ro: 'Cei cu care ai vorbit<br>te apreciază mai mult<br>decât crezi.', en: 'The people you talked to<br>think more of you<br>than you assume.' }
    },
    demo: {
      ro: 'Demonstrație', en: 'Demonstration', seats: 2, minutes: 3, dep: false, isDemo: true,
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
      if (quiet && g.filter(function (x) { return x.cat !== quiet }).length === 0) c += 6; // masă doar de ascultători
      var pr = {};
      g.forEach(function (x) { if (x.pair) pr[x.pair] = (pr[x.pair] || 0) + 1 });
      Object.keys(pr).forEach(function (k) { if (pr[k] === 1) c += 8 });  // prieteni despărțiți
      if (g.length < 2) c += 20;
    });
    return c;
  }
  function makeGroups(queue, sz, met, quiet) {
    var m = met || {}, bG = null, bC = 1e9;
    if (!sz.length) return { groups: [], left: queue.slice() };
    for (var t = 0; t < 300; t++) {
      var pool = queue.slice();
      for (var i = pool.length - 1; i > 0; i--) {
        var j = (Math.random() * (i + 1)) | 0, x = pool[i]; pool[i] = pool[j]; pool[j] = x;
      }
      if (t === 0 && quiet) pool.sort(function (a, b) { return (a.cat === quiet ? 1 : 0) - (b.cat === quiet ? 1 : 0) });
      var gs = [], k = 0;
      for (var s = 0; s < sz.length; s++) { var g = pool.slice(k, k + sz[s]); k += sz[s]; if (g.length) gs.push(g) }
      var c = costOf(gs, m, quiet);
      if (c < bC) { bC = c; bG = gs; if (c === 0) break }
    }
    var st = {}; bG.forEach(function (g) { g.forEach(function (p) { st[p.id] = 1 }) });
    return { groups: bG.filter(function (g) { return g.length >= 2 }), left: queue.filter(function (p) { return !st[p.id] }) };
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
