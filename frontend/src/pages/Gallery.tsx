import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ArtworkCard } from '../components/common/ArtworkCard';
import { ArtworkFilter } from '../components/common/ArtworkFilter';
import { EmptyState } from '../components/common/EmptyState';
import { ExhibitionBanner } from '../components/common/ExhibitionBanner';
import { useGalleryFilters } from '../hooks/useGalleryFilters';
import { usePagination } from '../hooks/usePagination';
import { useArtistStore } from '../stores/artistStore';
import { useArtworkStore } from '../stores/artworkStore';
import { useExhibitionStore } from '../stores/exhibitionStore';
import { ArtworkStatus } from '../types/enums';

export function Gallery() {
  const { artworks, galleryArtworks, galleryLoading, loadArtworks, loadGalleryArtworks } = useArtworkStore();
  const { artists, loadArtists } = useArtistStore();
  const { exhibitions, loadExhibitions } = useExhibitionStore();
  const { filters, isActive, update, clear } = useGalleryFilters();
  const { visibleItems, hasMore, loadMore, reset } = usePagination(galleryArtworks, 6);

  // 全量数据用于热门排行与展览；筛选结果单独走 galleryArtworks。
  useEffect(() => {
    void Promise.all([loadArtworks(), loadArtists(), loadExhibitions()]);
  }, [loadArtworks, loadArtists, loadExhibitions]);

  // 筛选条件（来自地址栏）变化时重新拉取，只返回已发布作品。
  useEffect(() => {
    reset();
    void loadGalleryArtworks({ keyword: filters.keyword.trim(), medium: filters.medium });
  }, [filters.keyword, filters.medium, reset, loadGalleryArtworks]);

  const featured = exhibitions[0];
  const findArtist = (id: string) => artists.find((artist) => artist.id === id);
  const publishedArtworks = useMemo(
    () => artworks.filter((artwork) => artwork.status === ArtworkStatus.Published),
    [artworks],
  );

  return (
    <main className="page-shell">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/gallery" className="font-display text-2xl">Atelier Index</Link>
        <nav className="flex gap-5 text-sm text-ink/70">
          <Link to="/gallery">画廊</Link>
          <Link to="/studio">工作台</Link>
        </nav>
      </header>
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="pt-8">
            <p className="text-sm uppercase tracking-[0.25em] text-clay">Independent gallery system</p>
            <h1 className="mt-4 font-display text-6xl leading-[0.95] text-ink md:text-7xl">作品、展览与观众互动在同一个现场。</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">为独立艺术家和小型画廊准备的管理平台：从作品发布、展览策划到点赞评论，都保持在可审核、可追踪的工作流里。</p>
          </div>
          {featured ? <ExhibitionBanner exhibition={featured} large /> : <EmptyState title="暂无展览" description="创建第一个展览后会出现在这里。" />}
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_280px]">
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl">最新作品</h2>
              <span className="text-sm text-ink/55">{galleryArtworks.length} 件作品</span>
            </div>
            <ArtworkFilter filters={filters} isActive={isActive} loading={galleryLoading} onChange={update} onClear={clear} />
            {galleryLoading && !visibleItems.length ? (
              <p className="mt-6 border border-dashed border-ink/25 bg-rice/60 p-8 text-center text-sm text-ink/55">正在加载作品…</p>
            ) : visibleItems.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} artist={findArtist(artwork.artistId)} />)}
              </div>
            ) : isActive ? (
              <div className="mt-6">
                <EmptyState title="没有符合条件的作品" description="试试更换关键词或媒介，或清空筛选条件浏览全部作品。" />
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState title="作品库为空" description="上传作品并发布后将自动生成瀑布流展示。" />
              </div>
            )}
            {hasMore && <button onClick={loadMore} className="mt-8 border border-ink px-5 py-3 text-sm hover:bg-ink hover:text-rice">加载更多</button>}
          </section>
          <aside className="border-l border-ink/15 pl-6">
            <h2 className="font-display text-3xl">热门排行</h2>
            <div className="mt-5 space-y-4">
              {publishedArtworks.length ? (
                [...publishedArtworks].sort((a, b) => b.likes - a.likes).map((artwork, index) => (
                  <Link key={artwork.id} to={`/artwork/${artwork.id}`} className="grid grid-cols-[32px_1fr] gap-3 border-b border-ink/10 pb-4">
                    <span className="font-display text-3xl text-clay">{index + 1}</span>
                    <span>
                      <span className="block font-semibold">{artwork.title}</span>
                      <span className="text-sm text-ink/55">{artwork.views.toLocaleString()} views</span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-ink/55">暂无已发布作品。</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
