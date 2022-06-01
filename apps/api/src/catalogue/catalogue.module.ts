import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogue } from './entities/catalogue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Catalogue])
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService]
})
export class CatalogueModule {}
