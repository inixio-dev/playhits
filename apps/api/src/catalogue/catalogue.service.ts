import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongService } from '../song/song.service';
import { Catalogue } from './entities/catalogue.entity';

@Injectable()
export class CatalogueService {

  constructor(@InjectRepository(Catalogue) private catalogueRepository: Repository<Catalogue>, private songsService: SongService) {}

  async create(createCatalogueDto, req) {
    const catalogue = await this.catalogueRepository.save([
      {
        spotifyPlaylistId: createCatalogueDto.id,
        name: createCatalogueDto.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ''),
        imageUrl: createCatalogueDto.images[0]?.url || 'assets/default-cover.png',
        host: req.user.host
      }
    ]);
    await this.songsService.addSongsFromCatalogue(req.user.host, catalogue[0]);
    return catalogue;
  }

  async remove(spotifyPlaylistId, req) {
    await this.catalogueRepository.delete({host: req.user.host, spotifyPlaylistId});
    return await this.songsService.remove(req.user.host, spotifyPlaylistId);
  }
}
