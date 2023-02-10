import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HostDto } from './dto/host.dto';
import { Host } from './entities/host.entity';

@Injectable()
export class HostService {

  constructor(@InjectRepository(Host) private hostsRepository: Repository<Host>) {
    this.populate();
  }

  async findOne(id: string): Promise<HostDto> {
    const host = await this.hostsRepository.findOne(
      {
        username: id
      }, 
      {
        relations: ['catalogues']
      }
    ).then((host: Host) => {
      return {
        name: host.name,
        username: host.username,
        catalogues: host.catalogues,
        id: host.id,
        canAddSongs: host.canAddSongs
      }
    });
    if (!host) {
      throw new NotFoundException();
    }
    return {
      ...host,
      loggedInSpotify: false
    }
  }

  find() {
    return this.hostsRepository.find({
      relations: ['catalogues']
    });
  }

  toggle(host: Host) {
    host.canAddSongs = !host.canAddSongs;
    this.hostsRepository.save(host);
    return this.findOne(host.username);
  }

  async populate() {
    const totalHosts = await this.hostsRepository.count();
    if (totalHosts === 0) {
      this.hostsRepository.save({
        name: 'Demo',
        username: 'bardemo',
        password: 'Admin1234',
        email: 'demo@inixio.dev'
      });
    }
  }
}
