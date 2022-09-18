import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateHostDto } from './dto/create-host.dto';
import { HostDto } from './dto/host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { Host } from './entities/host.entity';

@Injectable()
export class HostService {

  constructor(@InjectRepository(Host) private hostsRepository: Repository<Host>) {
    this.populate();
  }

  create(createHostDto: CreateHostDto) {
  }

  async findOne(id: string): Promise<HostDto> {
    console.log('Host', id)
    const host = await this.hostsRepository.findOne(
      {
        username: id
      }, 
      {
        relations: ['catalogues']
      }
    ).then((host: Host) => {
      console.log(host);
      return {
        name: host.name,
        username: host.username,
        catalogues: host.catalogues,
        id: host.id
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

  update(id: number, updateHostDto: UpdateHostDto) {
    return `This action updates a #${id} host`;
  }

  remove(id: number) {
    return `This action removes a #${id} host`;
  }

  async populate() {
    const totalHosts = await this.hostsRepository.count();
    if (totalHosts === 0) {
      this.hostsRepository.save({
        name: 'Demo',
        username: 'bardemo',
        password: 'Admin1234',
        email: 'demo@inixio.dev'
      })
      .then(res => {
        console.log('Result', res);
      })
      .catch(err => {
        console.log('Error saving demo', err);
      })
    }
  }
}
