import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { Catalogue } from './entities/catalogue.entity';

@Injectable()
export class CatalogueService {

  constructor(@InjectRepository(Catalogue) private catalogueRepository: Repository<Catalogue>) {}

  create(createCatalogueDto: any, req: any) {
    return this.catalogueRepository.save([
      {
        spotifyPlaylistId: createCatalogueDto.id,
        name: createCatalogueDto.name,
        imageUrl: createCatalogueDto.images[0].url,
        host: req.user.host
      }
    ]);
  }

  findAll() {
    return `This action returns all catalogue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalogue`;
  }

  remove(spotifyPlaylistId: string) {
    return this.catalogueRepository.delete({spotifyPlaylistId})
  }
}
