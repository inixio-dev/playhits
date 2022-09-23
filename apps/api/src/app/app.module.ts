import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { Host } from '../host/entities/host.entity';
import { HostModule } from '../host/host.module';

import { Subscriber as EncryptedColumnSubscriber } from 'typeorm-encrypted-column';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Catalogue } from '../catalogue/entities/catalogue.entity';
import { CatalogueModule } from '../catalogue/catalogue.module';
import { AuthModule } from '../auth/auth.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { Song } from '../song/entities/song.entity';
import { SongModule } from '../song/song.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      entities: [Host, Catalogue, Song],
      synchronize: true,
      ...environment.database
    }),
    HostModule,
    CatalogueModule,
    AuthModule,
    SpotifyModule,
    SongModule
  ],
  controllers: [AppController],
  providers: [AppService, EncryptedColumnSubscriber],
})
export class AppModule {}
