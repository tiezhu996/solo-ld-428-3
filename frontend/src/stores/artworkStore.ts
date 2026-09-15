import { create } from 'zustand';

import { fetchArtworks } from '../api/artwork';
import type { Artwork } from '../types/artwork';
import { ArtworkStatus } from '../types/enums';
import type { ArtworkFilterParams } from '../utils/filterArtworks';

interface ArtworkState {
  artworks: Artwork[];
  loading: boolean;
  galleryArtworks: Artwork[];
  galleryLoading: boolean;
  loadArtworks: () => Promise<void>;
  loadGalleryArtworks: (params: ArtworkFilterParams) => Promise<void>;
  updateArtworkMetrics: (id: string, patch: Partial<Pick<Artwork, 'likes' | 'bookmarks' | 'views'>>) => void;
}

export const useArtworkStore = create<ArtworkState>((set) => ({
  artworks: [],
  loading: false,
  galleryArtworks: [],
  galleryLoading: false,
  loadArtworks: async () => {
    set({ loading: true });
    const artworks = await fetchArtworks({ status: undefined });
    set({ artworks, loading: false });
  },
  loadGalleryArtworks: async (params) => {
    set({ galleryLoading: true });
    try {
      const galleryArtworks = await fetchArtworks({ status: ArtworkStatus.Published, ...params });
      set({ galleryArtworks });
    } finally {
      set({ galleryLoading: false });
    }
  },
  updateArtworkMetrics: (id, patch) =>
    set((state) => ({
      artworks: state.artworks.map((artwork) => (artwork.id === id ? { ...artwork, ...patch } : artwork)),
      galleryArtworks: state.galleryArtworks.map((artwork) =>
        artwork.id === id ? { ...artwork, ...patch } : artwork,
      ),
    })),
}));
