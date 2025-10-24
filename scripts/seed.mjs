import 'dotenv/config.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './seedMongo.mjs';
import Product from '../src/models/Product.model.js';

// ...existing code...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helpers arriba del run()
function toNumberSafe(val, def = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}

function normalizeCategory(raw) {
  const s = String(raw ?? '').trim().toLowerCase();
  return s.length ? s : 'general';
}

function makeCode(p, i) {
  const base = String(p.code ?? p.id ?? p.title ?? 'PROD')
    .replace(/\s+/g, '-')
    .toUpperCase()
    .slice(0, 12);
  return `${base}-${i + 1}`;
}

async function run() {
  const file = path.join(__dirname, '../products.json');
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) throw new Error('products.json debe ser un array');

  await Product.deleteMany({});

  const normalized = data.map((p, i) => {
    const price = toNumberSafe(p.price, 0);
    if (price < 0) throw new Error(`Precio inválido en índice ${i}`);

    return {
      title: String(p.title ?? `Producto ${i + 1}`).trim() || `Producto ${i + 1}`,
      description: String(p.description ?? `Sin descripción`).trim() || 'Sin descripción',
      price,
      category: normalizeCategory(p.category),
      stock: Number.isInteger(p.stock) && p.stock >= 0 ? p.stock : 10,
      status: typeof p.status === 'boolean' ? p.status : true,
      thumbnails: Array.isArray(p.thumbnails) ? p.thumbnails : [],
      code: makeCode(p, i),
    };
  });

  const result = await Product.insertMany(normalized, { ordered: true });
  console.log(`✅ Insertados ${result.length} productos`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });