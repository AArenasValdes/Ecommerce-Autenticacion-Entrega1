import { searchProducts } from '../services/products.service.js';
import { buildPageLink } from '../utils/buildLinks.js';

export async function getProducts(req, res, next) {
try {
const { limit = 10, page = 1, sort, query } = req.query;
const result = await searchProducts({ limit, page, sort, query });

const path = '/api/products';
const originalQuery = { ...req.query };
const prevLink = result.hasPrevPage
? buildPageLink(path, originalQuery, result.prevPage)
: null;
const nextLink = result.hasNextPage
? buildPageLink(path, originalQuery, result.nextPage)
: null;


return res.json({
status: 'success',
payload: result.docs,
totalPages: result.totalPages,
prevPage: result.prevPage,
nextPage: result.nextPage,
page: result.page,
hasPrevPage: result.hasPrevPage,
hasNextPage: result.hasNextPage,
prevLink,
nextLink
});
} catch (err) {
if (err?.message === 'INVALID_LIMIT') return res.status(400).json({ status: 'error', error: 'limit must be a positive integer' });
if (err?.message === 'INVALID_PAGE') return res.status(400).json({ status: 'error', error: 'page must be an integer >= 1' });
if (err?.message === 'INVALID_STATUS_FILTER') return res.status(400).json({ status: 'error', error: 'status must be true or false' });
if (err?.message === 'INVALID_SORT') return res.status(400).json({ status: 'error', error: "sort must be 'asc' or 'desc'" });
return next(err);
}}   