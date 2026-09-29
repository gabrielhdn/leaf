const maxDatabaseInteger = 2_147_483_647;

export class PageCountBelowCurrentPageError extends Error {}

export function parseCurrentPage(value: string | null, pageCount: number | null): number | null | undefined {
  const text = value?.trim() ?? "";
  if (!text) return null;
  if (!/^\d+$/.test(text)) return undefined;

  const page = Number(text);
  if (!Number.isSafeInteger(page) || page > maxDatabaseInteger) return undefined;
  if (pageCount !== null && page > pageCount) return undefined;
  return page;
}

export function getReadingProgress(currentPage: number | null, pageCount: number | null): number | null {
  if (currentPage === null || pageCount === null || pageCount <= 0) return null;
  return Math.min(100, Math.round((currentPage / pageCount) * 100));
}
