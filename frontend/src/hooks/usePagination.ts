import { useCallback, useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const visibleItems = useMemo(() => items.slice(0, page * pageSize), [items, page, pageSize]);
  const hasMore = visibleItems.length < items.length;
  const loadMore = useCallback(() => setPage((current) => current + 1), []);
  const reset = useCallback(() => setPage(1), []);
  return {
    page,
    visibleItems,
    hasMore,
    loadMore,
    reset,
  };
}
