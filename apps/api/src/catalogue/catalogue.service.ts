import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongService } from '../song/song.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { Catalogue } from './entities/catalogue.entity';

@Injectable()
export class CatalogueService {

  constructor(@InjectRepository(Catalogue) private catalogueRepository: Repository<Catalogue>, private songsService: SongService) {}

  async create(createCatalogueDto: any, req: any) {
    console.log(`Creando ${createCatalogueDto.name} (${createCatalogueDto.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')})`)
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

  findAll() {
    return `This action returns all catalogue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogue`;
  }

  async remove(spotifyPlaylistId: string, req: any) {
    const deleteResult = await this.catalogueRepository.delete({host: req.user.host, spotifyPlaylistId});
    await this.songsService.remove(req.user.host, spotifyPlaylistId);
  }
}
