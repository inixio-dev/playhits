import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogue } from './entities/catalogue.entity';
import { SongModule } from '../song/song.module';
import { HostModule } from '../host/host.module';
import { Host } from '../host/entities/host.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Catalogue, Host]),
    SongModule,
    HostModule
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService]
})
export class CatalogueModule {}
