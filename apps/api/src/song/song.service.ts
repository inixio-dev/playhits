import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Catalogue } from '../catalogue/entities/catalogue.entity';
import { Host } from '../host/entities/host.entity';
import { HostService } from '../host/host.service';
import { SpotifyService } from '../spotify/spotify.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SongService {

  constructor(private hostsService: HostService, private spotifyService: SpotifyService, @InjectRepository(Song) private songsRepository: Repository<Song>) {
    this.populate();
  }

  create(createSongDto: CreateSongDto) {
    return 'This action adds a new song';
  }

  findAll(hostId: string) {
    return this.songsRepository.find({
      where: {
        host: {
          id: hostId
        }
      },
      order: {
        title: 'ASC'
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(host: Host, spotifyPlaylistId: string) {
    return this.songsRepository.delete({
      host,
      spotifyPlaylistId
    })
  }

  private async populate() {
    const totalSongs = await this.songsRepository.count();
    if (totalSongs > 0) return;
    const hosts = await this.hostsService.find();
    console.log('Total hosts', hosts);
    hosts.filter(h => h.spotifyToken && h.spotifyRefreshToken).forEach(h => {
      console.log(h.name);
      h.catalogues.forEach(async c => {
          await this.addSongsFromCatalogue(h, c);
      })
    })
  }

  async addSongsFromCatalogue(h: Host, c: Catalogue) {
    const result = await this.spotifyService.getSongsFromPlaylist(h.id, c.spotifyPlaylistId);
    const songs: Song[] = result.items.map(({track}) => {
      const s: Song = {
        id: randomUUID(),
        spotifyPlaylistId: c.spotifyPlaylistId,
        spotifySongId: track.id,
        spotifySongUrl: track.uri,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        host: h
      };
      return s;
    });
    this.songsRepository.save(songs);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async reloadSongs() {
    await this.songsRepository.delete({});
    await this.populate();
  }
}
