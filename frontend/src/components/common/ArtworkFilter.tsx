import { useEffect, useState } from 'react';

import { mediumOptions } from '../../constants/mediumOptions';
import type { GalleryFilters } from '../../hooks/useGalleryFilters';
import { Medium } from '../../types/enums';

interface ArtworkFilterProps {
  filters: GalleryFilters;
  isActive: boolean;
  loading?: boolean;
  onChange: (next: Partial<GalleryFilters>) => void;
  onClear: () => void;
}

export function ArtworkFilter({ filters, isActive, loading = false, onChange, onClear }: ArtworkFilterProps) {
  // 本地缓冲输入，停止输入后再同步到地址，避免每次按键都触发查询。
  const [keywordDraft, setKeywordDraft] = useState(filters.keyword);

  useEffect(() => {
    setKeywordDraft(filters.keyword);
  }, [filters.keyword]);

  useEffect(() => {
    if (keywordDraft.trim() === filters.keyword.trim()) {
      return;
    }
    const timer = window.setTimeout(() => {
      onChange({ keyword: keywordDraft });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [keywordDraft, filters.keyword, onChange]);

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onChange({ keyword: keywordDraft });
      }}
    >
      <input
        value={keywordDraft}
        onChange={(event) => setKeywordDraft(event.target.value)}
        className="min-w-[220px] flex-1 border border-ink/20 bg-rice px-4 py-2.5 text-sm outline-none focus:border-clay"
        placeholder="搜索作品标题、标签或艺术家名"
        aria-label="关键词"
      />
      <select
        value={filters.medium ?? ''}
        onChange={(event) => onChange({ medium: (event.target.value || undefined) as Medium | undefined })}
        className="border border-ink/20 bg-rice px-4 py-2.5 text-sm outline-none focus:border-clay"
        aria-label="媒介"
      >
        <option value="">全部媒介</option>
        {mediumOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <button type="submit" className="border border-ink px-5 py-2.5 text-sm hover:bg-ink hover:text-rice">
        {loading ? '筛选中…' : '筛选'}
      </button>
      {isActive && (
        <button type="button" onClick={onClear} className="px-3 py-2.5 text-sm text-ink/60 underline-offset-4 hover:text-clay hover:underline">
          清空条件
        </button>
      )}
    </form>
  );
}
