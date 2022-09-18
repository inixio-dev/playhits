import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { HostModule } from '../host/host.module';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    HostModule,
    SpotifyModule
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService]
})
export class SongModule {}
