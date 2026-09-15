import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Artwork, ArtworkDocument } from '../models/artwork.schema';
import { Artist, ArtistDocument } from '../models/artist.schema';
import { ArtworkStatus, Medium } from '../types/enums';

export interface ArtworkListFilters {
  keyword?: string;
  medium?: Medium;
  status?: ArtworkStatus;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class ArtworkService {
  constructor(
    @InjectModel(Artwork.name) private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Artist.name) private readonly artistModel: Model<ArtistDocument>,
  ) {}

  async list(filters: ArtworkListFilters = {}) {
    const query: FilterQuery<ArtworkDocument> = {};

    if (filters.medium) {
      query.medium = filters.medium;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    const keyword = filters.keyword?.trim();
    if (keyword) {
      const pattern = new RegExp(escapeRegExp(keyword), 'i');
      const matchedArtists = await this.artistModel.find({ artistName: pattern }).select('_id').lean();
      const artistIds = matchedArtists.map((artist) => String(artist._id));

      query.$or = [
        { title: pattern },
        { tags: pattern },
        ...(artistIds.length ? [{ artistId: { $in: artistIds } }] : []),
      ];
    }

    return this.artworkModel.find(query).sort({ updatedAt: -1 }).lean();
  }

  async find(id: string) {
    return this.artworkModel.findById(id).lean();
  }

  async create(input: Partial<Artwork>) {
    return this.artworkModel.create(input);
  }

  async publish(id: string) {
    return this.artworkModel.findByIdAndUpdate(id, { status: ArtworkStatus.Published }, { new: true });
  }

  async incrementMetric(id: string, field: 'likes' | 'bookmarks' | 'views', amount = 1) {
    return this.artworkModel.findByIdAndUpdate(id, { $inc: { [field]: amount } }, { new: true });
  }
}
