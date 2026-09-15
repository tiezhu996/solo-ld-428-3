import type { Artist } from '../types/artist';
import type { Artwork } from '../types/artwork';
import type { ArtworkStatus, Medium } from '../types/enums';

export interface ArtworkFilterParams {
  keyword?: string;
  medium?: Medium;
  status?: ArtworkStatus;
}

function includes(haystack: string, needle: string) {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
}

/**
 * 在本地按条件筛选作品，语义与后端 GET /api/artworks 保持一致：
 * keyword 匹配作品标题 / 标签 / 艺术家名，medium 可单独选择，两类条件可组合。
 */
export function filterArtworks(
  artworks: Artwork[],
  params: ArtworkFilterParams,
  artists: Artist[] = [],
): Artwork[] {
  const keyword = params.keyword?.trim().toLocaleLowerCase();
  const medium = params.medium;
  const status = params.status;

  return artworks.filter((artwork) => {
    // 仅在显式指定 status 时过滤；工作台全量加载不传 status，需保留草稿/已售等全部状态。
    if (status && artwork.status !== status) {
      return false;
    }
    if (medium && artwork.medium !== medium) {
      return false;
    }
    if (keyword) {
      const artist = artists.find((item) => item.id === artwork.artistId);
      const matched =
        includes(artwork.title, keyword) ||
        artwork.tags.some((tag) => includes(tag, keyword)) ||
        (artist ? includes(artist.artistName, keyword) : false);
      if (!matched) {
        return false;
      }
    }
    return true;
  });
}
