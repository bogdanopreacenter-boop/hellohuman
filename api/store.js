// api/store.js — serverul de date pentru HelloHuman
//
// Rulează pe Vercel. Aplicația vorbește cu propriul domeniu, deci nu există CORS.
//
// Funcționează imediat, fără nicio configurare.
// Opțional, dacă adaugi variabilele de mediu UPSTASH_REDIS_REST_URL și
// UPSTASH_REDIS_REST_TOKEN, datele se mută automat pe Upstash — mai rapid
// și mai stabil, fără să schimbi o linie de cod.

const UP_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UP_TOK = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const useUpstash = !!(UP_URL && UP_TOK);

const BLOB = 'https://jsonblob.com/api/jsonBlob';

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function upstash(cmd) {
  const r = await fetch(UP_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + UP_TOK, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  if (!r.ok) throw new Error('upstash ' + r.status);
  const d = await r.json();
  return d.result;
}

async function create(data) {
  if (useUpstash) {
    const id = newId();
    // păstrează evenimentul 30 de zile
    await upstash(['SET', 'hh:' + id, JSON.stringify(data), 'EX', 2592000]);
    return id;
  }
  const r = await fetch(BLOB, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error('jsonblob ' + r.status);
  const loc = r.headers.get('location') || '';
  const id = loc.split('/').pop();
  if (!id) throw new Error('jsonblob nu a returnat identificatorul');
  return 'b_' + id;
}

async function read(id) {
  if (id.startsWith('b_')) {
    const r = await fetch(BLOB + '/' + id.slice(2), { cache: 'no-store' });
    if (!r.ok) throw new Error('jsonblob ' + r.status);
    return r.json();
  }
  if (!useUpstash) throw new Error('identificator necunoscut');
  const v = await upstash(['GET', 'hh:' + id]);
  if (v === null || v === undefined) throw new Error('evenimentul nu există');
  return JSON.parse(v);
}

async function write(id, data) {
  if (id.startsWith('b_')) {
    const r = await fetch(BLOB + '/' + id.slice(2), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('jsonblob ' + r.status);
    return true;
  }
  if (!useUpstash) throw new Error('identificator necunoscut');
  await upstash(['SET', 'hh:' + id, JSON.stringify(data), 'EX', 2592000]);
  return true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const id = await create(body);
      return res.status(200).json({ id, store: useUpstash ? 'upstash' : 'blob' });
    }

    const id = (req.query && req.query.id) || '';
    if (!id) return res.status(400).json({ error: 'lipsește identificatorul' });

    if (req.method === 'GET') {
      const data = await read(String(id));
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      await write(String(id), body);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'metodă nepermisă' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
