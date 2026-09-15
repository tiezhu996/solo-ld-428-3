import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Medium } from '../types/enums';

export interface GalleryFilters {
  keyword: string;
  medium?: Medium;
}

function parseMedium(value: string | null): Medium | undefined {
  return value && Object.values(Medium).includes(value as Medium) ? (value as Medium) : undefined;
}

/**
 * 画廊筛选条件与当前地址查询参数（keyword / medium）双向同步：
 * 刷新或浏览器返回后条件仍保留，清空后恢复为无参数的全部作品。
 */
export function useGalleryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<GalleryFilters>(
    () => ({
      keyword: searchParams.get('keyword') ?? '',
      medium: parseMedium(searchParams.get('medium')),
    }),
    [searchParams],
  );

  const isActive = Boolean(filters.keyword.trim() || filters.medium);

  const update = useCallback(
    (next: Partial<GalleryFilters>) => {
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        const keyword = next.keyword?.trim();
        if (keyword !== undefined) {
          if (keyword) {
            params.set('keyword', keyword);
          } else {
            params.delete('keyword');
          }
        }
        if (next.medium !== undefined) {
          if (next.medium) {
            params.set('medium', next.medium);
          } else {
            params.delete('medium');
          }
        }
        return params;
      });
    },
    [setSearchParams],
  );

  const clear = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams]);

  return { filters, isActive, update, clear };
}
