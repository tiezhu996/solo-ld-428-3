import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { ArtworkService } from '../services/artwork.service';
import { ArtworkStatus, Medium } from '../types/enums';
import { ok } from '../utils/response';

function parseMedium(value?: string): Medium | undefined {
  return value && Object.values(Medium).includes(value as Medium) ? (value as Medium) : undefined;
}

function parseStatus(value?: string): ArtworkStatus | undefined {
  return value && Object.values(ArtworkStatus).includes(value as ArtworkStatus)
    ? (value as ArtworkStatus)
    : undefined;
}

@Controller('api/artworks')
export class ArtworkController {
  constructor(private readonly artworkService: ArtworkService) {}

  @Get()
  async list(
    @Query('keyword') keyword?: string,
    @Query('medium') medium?: string,
    @Query('status') status?: string,
  ) {
    return this.artworkService.list({
      keyword: keyword?.trim() || undefined,
      medium: parseMedium(medium),
      status: parseStatus(status),
    });
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return ok(await this.artworkService.find(id));
  }

  @Post()
  async create(@Body() body: Record<string, unknown>) {
    return ok(await this.artworkService.create(body));
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return ok(await this.artworkService.publish(id));
  }
}
