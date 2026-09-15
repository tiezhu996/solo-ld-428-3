import { apiPaths } from '../constants/apiPaths';
import { artists, artworks } from '../utils/mockData';
import { filterArtworks, type ArtworkFilterParams } from '../utils/filterArtworks';
import { normalizeIdList } from '../utils/normalizeId';
import { request } from '../utils/request';
import type { Artwork } from '../types/artwork';

function buildQuery(params: ArtworkFilterParams): string {
  const search = new URLSearchParams();
  const keyword = params.keyword?.trim();
  if (keyword) {
    search.set('keyword', keyword);
  }
  if (params.medium) {
    search.set('medium', params.medium);
  }
  if (params.status) {
    search.set('status', params.status);
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function fetchArtworks(params: ArtworkFilterParams = {}): Promise<Artwork[]> {
  try {
    const list = await request<Artwork[]>(`${apiPaths.artworks}${buildQuery(params)}`);
    return normalizeIdList(list);
  } catch {
    return filterArtworks(artworks, params, artists);
  }
}

export async function fetchArtwork(id: string): Promise<Artwork | undefined> {
  try {
    const list = await request<Artwork[]>(apiPaths.artworks);
    return normalizeIdList(list).find((artwork) => artwork.id === id);
  } catch {
    return artworks.find((artwork) => artwork.id === id);
  }
}
