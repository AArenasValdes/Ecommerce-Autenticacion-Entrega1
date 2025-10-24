import Product from '../models/Product.model.js';

// Analiza el parámetro de filtro
function parseFilter(query) {
if (!query) return {};
const raw = String(query).trim();
const isStatus = /^status\s*:/i.test(raw);
if (isStatus) {
const val = raw.split(':')[1]?.trim()?.toLowerCase();
if (val === 'true') return { status: true };
if (val === 'false') return { status: false };
throw new Error('INVALID_STATUS_FILTER');
}
// category exacta (normalizada a lower)
return { category: raw.toLowerCase() };
}

// Analiza el parámetro de ordenamiento
function parseSort(sort) {
if (!sort) return undefined;
const s = String(sort).toLowerCase();
if (s === 'asc') return { price: 1 };
if (s === 'desc') return { price: -1 };
throw new Error('INVALID_SORT');
}

// Búsqueda de productos con paginación, filtrado y ordenamiento
export async function searchProducts({ limit = 10, page = 1, sort, query }) {
const l = Number(limit);
const p = Number(page);
if (!Number.isInteger(l) || l <= 0) throw new Error('INVALID_LIMIT');
if (!Number.isInteger(p) || p < 1) throw new Error('INVALID_PAGE');

// Construir filtro y orden
const filter = parseFilter(query);
const sortObj = sort ? parseSort(sort) : undefined;
const totalDocs = await Product.countDocuments(filter);
const totalPages = Math.max(1, Math.ceil(totalDocs / l));
const skip = (p - 1) * l;
const docs = await Product.find(filter)
.sort(sortObj)
.skip(skip)
.limit(l)
.lean();

const hasPrevPage = p > 1;
const hasNextPage = p < totalPages;

return {
docs,
totalDocs,
limit: l,
page: p,
totalPages,
hasPrevPage,
hasNextPage,
prevPage: hasPrevPage ? p - 1 : null,
nextPage: hasNextPage ? p + 1 : null
};
}