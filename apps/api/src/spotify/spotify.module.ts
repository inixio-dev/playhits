import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Host } from '../host/entities/host.entity';
import { SongRequest } from '../request/entities/request.entity';
import { RequestModule } from '../request/request.module';
import { Song } from '../song/entities/song.entity';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Host, SongRequest, Song]),
    HttpModule,
    AuthModule,
    RequestModule
  ],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [SpotifyService]
})
export class SpotifyModule {}
