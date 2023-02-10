import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Catalogue } from '../catalogue/entities/catalogue.entity';
import { Host } from '../host/entities/host.entity';
import { HostService } from '../host/host.service';
import { SpotifyService } from '../spotify/spotify.service';
import { Song } from './entities/song.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SongService {

  constructor(private hostsService: HostService, private spotifyService: SpotifyService, @InjectRepository(Song) private songsRepository: Repository<Song>) {
    this.populate();
  }

  async findAll(hostId: string) {
    const songs = await this.songsRepository.find({
      where: {
        host: {
          id: hostId
        }
      },
      order: {
        title: 'ASC'
      },
    });
    return songs.filter((s, i) => {
      if (songs[i-1]) {
        return s.title !== songs[i-1].title || s.artist !== songs[i-1].artist;
      } else {
        return true;
      }
    })
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
    hosts.filter(h => h.spotifyToken && h.spotifyRefreshToken).forEach(h => {
      h.catalogues.forEach(async c => {
          await this.addSongsFromCatalogue(h, c);
      })
    })
  }

  async addSongsFromCatalogue(h: Host, c: Catalogue) {
    const result = await this.spotifyService.getSongsFromPlaylist(h.id, c.spotifyPlaylistId);
    const songs: Song[] = result.items.map(({track}) => {
      const s: Song = {
        id: uuidv4(),
        spotifyPlaylistId: c.spotifyPlaylistId,
        spotifySongId: track.id,
        spotifySongUrl: track.uri,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        host: h,
        requests: []
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
