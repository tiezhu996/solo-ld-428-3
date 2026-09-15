import { apiPaths } from '../constants/apiPaths';
import { artists } from '../utils/mockData';
import { normalizeIdList } from '../utils/normalizeId';
import { request } from '../utils/request';
import type { Artist } from '../types/artist';

export async function fetchArtists(): Promise<Artist[]> {
  try {
    return normalizeIdList(await request<Artist[]>(apiPaths.artists));
  } catch {
    return artists;
  }
}

export async function fetchArtist(id: string): Promise<Artist | undefined> {
  const list = await fetchArtists();
  return list.find((artist) => artist.id === id);
}
