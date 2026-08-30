// api/store.js — serverul de date pentru HelloHuman
//
// Încearcă mai multe locuri de stocare, în ordine, și îl folosește pe primul
// care răspunde. Nu are nevoie de nicio configurare ca să pornească.
//
// Pentru ceva stabil pe termen lung, adaugă în Vercel două variabile de mediu:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// Se iau gratuit din Vercel, la Storage. Din acel moment se folosesc automat,
// fara sa schimbi nimic in cod.
//
// Diagnostic: deschide /api/store?diag=1 ca sa vezi ce functioneaza.

const UP_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UP_TOK = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const TTL = 2592000; // 30 de zile

function rid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- Upstash ---------- */
const upstash = {
  name: 'Upstash',
  ready: () => !!(UP_URL && UP_TOK),
  async cmd(arr) {
    const r = await fetch(UP_URL, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + UP_TOK, 'Content-Type': 'application/json' },
      body: JSON.stringify(arr)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return (await r.json()).result;
  },
  async create(data) {
    const id = rid();
    await this.cmd(['SET', 'hh:' + id, JSON.stringify(data), 'EX', TTL]);
    return 'u_' + id;
  },
  async read(id) {
    const v = await this.cmd(['GET', 'hh:' + id]);
    if (v === null || v === undefined) throw new Error('nu exista');
    return JSON.parse(v);
  },
  async write(id, data) {
    await this.cmd(['SET', 'hh:' + id, JSON.stringify(data), 'EX', TTL]);
    return true;
  }
};

/* ---------- kvdb.io ---------- */
const kvdb = {
  name: 'kvdb.io',
  ready: () => true,
  async create(data) {
    const r = await fetch('https://kvdb.io/', { method: 'POST', body: '' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const bucket = (await r.text()).trim();
    if (!bucket || bucket.length < 6) throw new Error('bucket invalid');
    const w = await fetch('https://kvdb.io/' + bucket + '/d', {
      method: 'PUT', body: JSON.stringify(data)
    });
    if (!w.ok) throw new Error('scriere HTTP ' + w.status);
    return 'k_' + bucket;
  },
  async read(id) {
    const r = await fetch('https://kvdb.io/' + id + '/d', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return JSON.parse(await r.text());
  },
  async write(id, data) {
    const r = await fetch('https://kvdb.io/' + id + '/d', {
      method: 'PUT', body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return true;
  }
};

/* ---------- jsonblob ---------- */
const blob = {
  name: 'jsonblob',
  ready: () => true,
  async create(data) {
    const r = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const loc = r.headers.get('location') || '';
    const id = loc.split('/').pop();
    if (!id) throw new Error('fara identificator');
    return 'b_' + id;
  },
  async read(id) {
    const r = await fetch('https://jsonblob.com/api/jsonBlob/' + id, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  },
  async write(id, data) {
    const r = await fetch('https://jsonblob.com/api/jsonBlob/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return true;
  }
};

const CHAIN = [upstash, kvdb, blob];
const BY_PREFIX = { 'u_': upstash, 'k_': kvdb, 'b_': blob };

function routeFor(id) {
  const p = String(id).slice(0, 2);
  const s = BY_PREFIX[p];
  if (!s) throw new Error('identificator necunoscut');
  return { store: s, key: String(id).slice(2) };
}

async function createAny(data) {
  const errs = [];
  for (const s of CHAIN) {
    if (!s.ready()) { errs.push(s.name + ': neconfigurat'); continue; }
    try { return await s.create(data); }
    catch (e) { errs.push(s.name + ': ' + (e && e.message ? e.message : 'eroare')); }
  }
  throw new Error(errs.join(' | '));
}

async function diag() {
  const out = [];
  for (const s of CHAIN) {
    if (!s.ready()) { out.push({ name: s.name, ok: false, err: 'neconfigurat' }); continue; }
    const t0 = Date.now();
    try {
      const id = await s.create({ t: 'test' });
      const r = routeFor(id);
      const d1 = await r.store.read(r.key);
      if (!d1 || d1.t !== 'test') throw new Error('citirea nu se potriveste');
      await r.store.write(r.key, { t: 'test2' });
      const d2 = await r.store.read(r.key);
      if (!d2 || d2.t !== 'test2') throw new Error('salvarea nu s-a propagat');
      out.push({ name: s.name, ok: true, ms: Date.now() - t0 });
    } catch (e) {
      out.push({ name: s.name, ok: false, err: String((e && e.message) || e) });
    }
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.query && req.query.diag) {
      return res.status(200).json({ results: await diag(), upstash: upstash.ready() });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const id = await createAny(body);
      return res.status(200).json({ id });
    }

    const id = (req.query && req.query.id) || '';
    if (!id) return res.status(400).json({ error: 'lipseste identificatorul' });
    const r = routeFor(id);

    if (req.method === 'GET') {
      return res.status(200).json(await r.store.read(r.key));
    }
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      await r.store.write(r.key, body);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'metoda nepermisa' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
