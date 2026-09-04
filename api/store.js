// api/store.js — serverul de date pentru HelloHuman
//
// Fiecare bucata de stare are propria cheie in Redis, iar scrierile folosesc
// operatii atomice. Inscrierea unui participant e un HSET pe campul lui:
// nici doua, nici treizeci de telefoane simultane nu se pot suprascrie.
//
// Configurare in Vercel:
//   Storage -> Upstash Redis, conectat la proiect
//   Settings -> Environment Variables -> OWNER_KEY = parola ta
//
// Diagnostic: /api/store?diag=1

const UP_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  process.env.REDIS_REST_URL ||
  process.env.STORAGE_REST_API_URL || '';
const UP_TOK =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  process.env.REDIS_REST_TOKEN ||
  process.env.STORAGE_REST_API_TOKEN || '';

const OWNER = process.env.OWNER_KEY || 'sef2026';
const TTL = 2592000;              // evenimentele traiesc 30 de zile
const BOOK = 'hh:book';
const LEADS = 'hh:leads';
const REQS  = 'hh:reqs';

const ready = () => !!(UP_URL && UP_TOK);

/* ---------- Redis prin REST ---------- */
async function cmd(arr) {
  const r = await fetch(UP_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + UP_TOK, 'Content-Type': 'application/json' },
    body: JSON.stringify(arr)
  });
  if (!r.ok) throw new Error('Redis HTTP ' + r.status);
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}
async function pipe(cmds) {
  const r = await fetch(UP_URL.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + UP_TOK, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('Redis HTTP ' + r.status);
  const d = await r.json();
  return d.map(function (x) { return x.result; });
}

function newId() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
// HGETALL prin REST vine ca lista plata: [camp, valoare, camp, valoare...]
function toObj(flat) {
  const o = {};
  if (!Array.isArray(flat)) return o;
  for (let i = 0; i < flat.length; i += 2) o[flat[i]] = flat[i + 1];
  return o;
}
function parse(v, fb) { try { return v ? JSON.parse(v) : fb } catch (e) { return fb } }

/* ---------- cheile unui eveniment ---------- */
const K = (id) => ({
  cfg: 'hh:e:' + id + ':cfg',
  w:   'hh:e:' + id + ':w',    // hash: cine asteapta
  r:   'hh:e:' + id + ':r',    // runda curenta
  m:   'hh:e:' + id + ':m',    // hash: cine cu cine s-a intalnit
  v:   'hh:e:' + id + ':v',    // hash: voturi
  l:   'hh:e:' + id + ':l',    // lista: emailuri
  n:   'hh:e:' + id + ':n'     // numar de runde
});

async function evRead(id) {
  const k = K(id);
  const [cfg, w, r, m, v, l, n] = await pipe([
    ['GET', k.cfg], ['HGETALL', k.w], ['GET', k.r],
    ['HGETALL', k.m], ['HGETALL', k.v], ['LRANGE', k.l, '0', '-1'], ['GET', k.n]
  ]);
  if (cfg === null || cfg === undefined) throw new Error('evenimentul nu exista');
  const wait = Object.values(toObj(w)).map(function (x) { return parse(x, null) }).filter(Boolean);
  const met = {};
  const mo = toObj(m);
  Object.keys(mo).forEach(function (key) { met[key] = parse(mo[key], []) });
  const votes = toObj(v);
  return {
    cfg: parse(cfg, {}),
    state: {
      wait: wait,
      round: parse(r, null),
      rounds: parseInt(n || '0', 10) || 0,
      met: met,
      votes: votes,
      leads: (l || []).map(function (x) { return parse(x, null) }).filter(Boolean)
    }
  };
}

async function evCreate(cfg) {
  const id = newId();
  const k = K(id);
  await pipe([
    ['SET', k.cfg, JSON.stringify(cfg), 'EX', TTL],
    ['SET', k.n, '0', 'EX', TTL]
  ]);
  return id;
}

/* ---------- operatii atomice ---------- */
// Inscrierea nu poate pierde pe nimeni: fiecare om are campul lui in hash.
async function evJoin(id, p) {
  const k = K(id);
  await pipe([
    ['HSET', k.w, p.id, JSON.stringify(p)],
    ['EXPIRE', k.w, String(TTL)]
  ]);
  return true;
}
async function evLeave(id, pid) {
  await cmd(['HDEL', K(id).w, pid]);
  return true;
}
async function evVote(id, pid, val) {
  const k = K(id);
  await pipe([['HSET', k.v, pid, String(val)], ['EXPIRE', k.v, String(TTL)]]);
  return true;
}
async function evLead(id, lead) {
  const k = K(id);
  const cu = Object.assign({}, lead, { src: id, ts: lead.ts || Date.now() });
  // se scrie si in evenimentul lui, si in registrul general, ca sa apara in CRM
  await pipe([
    ['RPUSH', k.l, JSON.stringify(cu)], ['EXPIRE', k.l, String(TTL)],
    ['RPUSH', LEADS, JSON.stringify(cu)]
  ]);
  return true;
}
// Runda o scrie doar gazda, deci nu exista concurenta.
// Cine s-a inscris intre citire si scriere ramane in coada pentru runda urmatoare.
async function evRound(id, round, seatedIds, leftovers, metAdd) {
  const k = K(id);
  const cmds = [['SET', k.r, JSON.stringify(round), 'EX', TTL], ['INCR', k.n]];
  seatedIds.forEach(function (pid) { cmds.push(['HDEL', k.w, pid]) });
  leftovers.forEach(function (p) { cmds.push(['HSET', k.w, p.id, JSON.stringify(p)]) });
  Object.keys(metAdd || {}).forEach(function (pid) {
    cmds.push(['HSET', k.m, pid, JSON.stringify(metAdd[pid])]);
  });
  cmds.push(['EXPIRE', k.m, String(TTL)], ['EXPIRE', k.w, String(TTL)]);
  await pipe(cmds);
  return true;
}
async function evStop(id) {
  await cmd(['DEL', K(id).r]);
  return true;
}

/* ---------- cereri de la parteneri ---------- */
// Oricine poate trimite o cerere. Nimeni nu le poate citi fara cheia proprietarului.
async function addReq(r) {
  const rec = {
    id: 'rq' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: String(r.name || '').slice(0, 60),
    city: String(r.city || '').slice(0, 40),
    kind: String(r.kind || '').slice(0, 20),
    found: String(r.found || '').slice(0, 40),
    want: String(r.want || '').slice(0, 400),
    email: String(r.email || '').slice(0, 80),
    phone: String(r.phone || '').slice(0, 30),
    status: 'nou',
    ts: Date.now()
  };
  await cmd(['RPUSH', REQS, JSON.stringify(rec)]);
  return rec.id;
}
async function reqsRead() {
  const l = await cmd(['LRANGE', REQS, '0', '-1']);
  return (l || []).map(function (x) { return parse(x, null) }).filter(Boolean);
}
async function reqsWrite(list) {
  const cmds = [['DEL', REQS]];
  list.forEach(function (r) { cmds.push(['RPUSH', REQS, JSON.stringify(r)]) });
  if (list.length) await pipe(cmds); else await cmd(['DEL', REQS]);
  return true;
}

/* ---------- registrul proprietarului ---------- */
async function bookRead() {
  if (!ready()) throw new Error('registrul are nevoie de Upstash; adauga-l in Vercel');
  const [b, l] = await pipe([['GET', BOOK], ['LRANGE', LEADS, '0', '-1']]);
  const book = parse(b, { partners: [], events: [] });
  book.partners = book.partners || [];
  book.events = book.events || [];
  book.leads = (l || []).map(function (x) { return parse(x, null) }).filter(Boolean);
  book.requests = await reqsRead();
  return book;
}
async function bookWrite(data) {
  if (!ready()) throw new Error('registrul are nevoie de Upstash');
  const copy = { partners: data.partners || [], events: data.events || [] };
  await cmd(['SET', BOOK, JSON.stringify(copy)]);
  return true;
}
// Emailurile publice se adauga cu RPUSH, deci nu se pierd niciodata.
async function addLead(email, city, interests) {
  await cmd(['RPUSH', LEADS, JSON.stringify({
    email: email, city: city || '',
    interests: Array.isArray(interests) ? interests.slice(0, 8) : [],
    src: 'site', ts: Date.now()
  })]);
  return await cmd(['LLEN', LEADS]);
}

/* ---------- diagnostic ---------- */
async function diag() {
  const out = [];
  if (!ready()) { out.push({ name: 'Upstash', ok: false, err: 'neconfigurat' }); return out }
  const t0 = Date.now();
  try {
    const id = await evCreate({ t: 'test' });
    await evJoin(id, { id: 'x1', name: 'test' });
    const d = await evRead(id);
    if (!d.cfg || d.cfg.t !== 'test') throw new Error('citirea nu se potriveste');
    if (d.state.wait.length !== 1) throw new Error('inscrierea nu s-a propagat');
    await evLeave(id, 'x1');
    const k = K(id);
    await pipe([['DEL', k.cfg], ['DEL', k.w], ['DEL', k.n]]);
    out.push({ name: 'Upstash', ok: true, ms: Date.now() - t0 });
  } catch (e) {
    out.push({ name: 'Upstash', ok: false, err: String((e && e.message) || e) });
  }
  return out;
}

/* ---------- ruta ---------- */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const q = req.query || {};
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  try {
    if (q.diag) {
      const seen = Object.keys(process.env).filter(function (k) { return /REDIS|KV_|UPSTASH|STORAGE|OWNER/i.test(k) });
      return res.status(200).json({ results: await diag(), upstash: ready(), variabileGasite: seen.length ? seen : ['niciuna'] });
    }
    if (!ready()) return res.status(500).json({ error: 'Upstash nu e conectat la proiect' });

    /* --- email lasat pe pagina publica: doar scriere --- */
    if (req.method === 'POST' && q.lead && !q.id) {
      const email = String(body.email || '').trim();
      if (!email || email.indexOf('@') < 1) return res.status(400).json({ error: 'email invalid' });
      const n = await addLead(email, String(body.city || '').slice(0, 40), body.interests);
      return res.status(200).json({ ok: true, total: n });
    }

    /* --- cerere de alaturare: oricine poate scrie, nimeni nu poate citi --- */
    if (req.method === 'POST' && q.request) {
      const email = String(body.email || '').trim();
      const name = String(body.name || '').trim();
      if (!name) return res.status(400).json({ error: 'lipseste numele' });
      if (!email || email.indexOf('@') < 1) return res.status(400).json({ error: 'email invalid' });
      const id = await addReq(body);
      return res.status(200).json({ ok: true, id: id });
    }
    if (req.method === 'POST' && q.reqstatus) {
      if (String(q.k || '') !== OWNER) return res.status(401).json({ error: 'cheie gresita' });
      const list = await reqsRead();
      const one = list.filter(function (r) { return r.id === String(q.id || '') })[0];
      if (!one) return res.status(404).json({ error: 'inexistent' });
      one.status = String(q.s || 'nou');
      await reqsWrite(list);
      return res.status(200).json({ ok: true });
    }

    /* --- partener --- */
    if (q.partner) {
      const b = await bookRead();
      const p = (b.partners || []).filter(function (x) { return x.id === String(q.id || '') })[0];
      if (!p) return res.status(404).json({ error: 'inexistent' });
      if (p.off) return res.status(403).json({ error: 'dezactivat' });
      if (String(q.pw || '') !== p.pw) return res.status(401).json({ error: 'parola gresita' });
      return res.status(200).json({
        partner: { id: p.id, name: p.name, profile: p.profile },
        events: (b.events || []).filter(function (e) { return e.pid === p.id })
      });
    }
    if (req.method === 'POST' && (q.addevent || q.delevent)) {
      const b = await bookRead();
      const p = (b.partners || []).filter(function (x) { return x.id === String(q.id || '') })[0];
      if (!p) return res.status(404).json({ error: 'inexistent' });
      if (p.off) return res.status(403).json({ error: 'dezactivat' });
      if (String(q.pw || '') !== p.pw) return res.status(401).json({ error: 'parola gresita' });
      if (q.addevent) { body.pid = p.id; b.events.push(body) }
      else { const ev = String(q.ev || ''); b.events = b.events.filter(function (e) { return !(e.id === ev && e.pid === p.id) }) }
      await bookWrite(b);
      return res.status(200).json({ ok: true });
    }

    /* --- registrul complet: cere cheia proprietarului --- */
    if (q.book) {
      if (String(q.k || '') !== OWNER) return res.status(401).json({ error: 'cheie gresita' });
      if (req.method === 'GET') return res.status(200).json(await bookRead());
      if (req.method === 'PUT') { await bookWrite(body); return res.status(200).json({ ok: true }) }
      return res.status(405).json({ error: 'metoda nepermisa' });
    }

    /* --- crearea unui eveniment --- */
    if (req.method === 'POST' && !q.id) {
      const id = await evCreate(body.cfg || body.quiz ? (body.quiz ? { quiz: body.quiz } : body.cfg) : body);
      return res.status(200).json({ id: id });
    }

    const id = String(q.id || '');
    if (!id) return res.status(400).json({ error: 'lipseste identificatorul' });

    /* --- operatii atomice pe un eveniment --- */
    if (req.method === 'POST') {
      if (q.join)  { await evJoin(id, body); return res.status(200).json({ ok: true }) }
      if (q.leave) { await evLeave(id, String(body.id || '')); return res.status(200).json({ ok: true }) }
      if (q.vote)  { await evVote(id, String(body.id || ''), body.v); return res.status(200).json({ ok: true }) }
      if (q.lead)  { await evLead(id, body); return res.status(200).json({ ok: true }) }
      if (q.round) { await evRound(id, body.round, body.seated || [], body.left || [], body.met || {}); return res.status(200).json({ ok: true }) }
      if (q.stop)  { await evStop(id); return res.status(200).json({ ok: true }) }
      return res.status(400).json({ error: 'operatie necunoscuta' });
    }

    if (req.method === 'GET') return res.status(200).json(await evRead(id));
    return res.status(405).json({ error: 'metoda nepermisa' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
