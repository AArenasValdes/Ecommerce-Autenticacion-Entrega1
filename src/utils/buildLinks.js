import qs from 'node:querystring';

export function buildPageLink(path, originalQuery = {}, targetPage) {
const q = { ...originalQuery };
if (targetPage && Number(targetPage) !== 1) {
q.page = targetPage;
} else {
delete q.page;
}
const query = qs.stringify(q);
return query ? `${path}?${query}` : path;
}